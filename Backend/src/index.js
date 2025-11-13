import express from 'express'
import cors from 'cors'
import { prisma } from './utils/db.js'
import { gerarHash, compareHash } from './utils/bcrypt.js'
import { geraToken, verificaToken } from './utils/auth.js'

const app = express()

app.use(express.json())
app.use(cors())

const middleware = (req, res, next) => {
    const auth = req.headers['authorization']

    const token = auth.split(' ')[1]

    if (!token) return res.status(401).json({ error: 'Token não informado' })

    const decoded = verificaToken(token)

    if (!decoded) return res.status(403).json({ error: 'Token Invalido' })

    req.user = decoded
    next()
}

app.post('/register', async (req, res) => {
    try {
        const { email, senha } = req.body

        const alredyExists = await prisma.usuario.findUnique({
            where: { email }
        })

        if (alredyExists) return res.status(400).json({ error: 'Este email já esta cadastrado' })

        const user = await prisma.usuario.create({
            data: {
                email,
                senha: await gerarHash(senha)
            }
        })

        return res.json({ message: 'Usuario registrado com sucesso!' })
    } catch (error) {
        res.status(400).json({ message: `Erro ao cadastrar o usuario ${error}` })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body

        const emailExists = await prisma.usuario.findUnique({
            where: { email }
        })

        if (!emailExists) return res.status(401).json({ error: 'Email ou senha incorretos' })

        const valid = await compareHash(senha, emailExists.senha)
        if (!valid) return res.status(401).json({ error: 'Email ou senha incorretos' })

        const token = geraToken(emailExists)

        const data = {
            'id': emailExists.id,
            'email': emailExists.email,
            'creditos': emailExists.creditos
        }

        return res.status(200).json({ message: 'Login realizado com sucesso', authorization: token, content: data })
    } catch (error) {
        res.status(400).json({ message: `Erro ao realizar o login ${error}` })
    }
})

app.post('/itens', middleware, async (req, res) => {
    const userId = req.user.id
    const item = req.body

    try {
        const usuario = await prisma.usuario.findFirst({ where: { id: userId } })

        if (item.isBundle) {
            const bundleExists = await prisma.bundle.findFirst({
                where: {
                    bundleId: item.id,
                    usuarioId: userId
                }
            })

            if (usuario.creditos < item.finalPrice) return res.status(409).json({ error: 'Não possui VBucks suficientes' })

            if (bundleExists) {
                if (bundleExists.ativo) {
                    return res.status(409).json({ error: 'Você já possui esse pacote.' })
                } else {
                    for (const it of item.includedItems) {
                        const existingItem = await prisma.item.findFirst({
                            where: {
                                itemId: it.id,
                                usuarioId: userId,
                                ativo: true
                            }
                        })
                        if (existingItem) {
                            return res.status(409).json({ error: `Você já possui o item "${existingItem.nome}" deste pacote. Reembolse-o antes de comprar o pacote.` })
                        }
                    }

                    const bundle = await prisma.bundle.update({
                        where: { usuarioId_bundleId: { usuarioId: userId, bundleId: item.id } },
                        data: { ativo: true }
                    })

                    await prisma.usuario.update({
                        where: { id: userId },
                        data: { creditos: { decrement: item.finalPrice } }
                    })

                    for (const it of item.includedItems) {
                        const existingItem = await prisma.item.findFirst({
                            where: { itemId: it.id, usuarioId: userId }
                        })

                        if (existingItem) {
                            await prisma.item.update({
                                where: { usuarioId_itemId: { usuarioId: userId, itemId: it.id } },
                                data: { bundleId: bundle.id, ativo: true }
                            })
                        } else {
                            await prisma.item.create({
                                data: {
                                    itemId: it.id,
                                    nome: it.name,
                                    descricao: it.description ?? null,
                                    tipo: it.type?.displayValue ?? null,
                                    raridade: it.rarity?.value ?? null,
                                    imagemIcon: it.images?.icon ?? null,
                                    imagemPequena: it.images?.smallIcon ?? null,
                                    preco: 0,
                                    ativo: true,
                                    usuario: { connect: { id: userId } },
                                    bundle: { connect: { id: bundle.id } }
                                }
                            })
                        }
                    }

                    await prisma.historicoTransacao.create({
                        data: {
                            tipo: 'COMPRA',
                            valor: item.finalPrice,
                            bundleId: bundle.id,
                            usuarioId: userId
                        }
                    })
                    return res.status(200).json({ message: 'Pacote comprado com sucesso' })
                }
            }

            const novoBundle = await prisma.$transaction(async (tx) => {
                await tx.usuario.update({
                    where: { id: userId },
                    data: { creditos: { decrement: item.finalPrice } }
                })

                const novoBundle = await tx.bundle.create({
                    data: {
                        bundleId: item.id,
                        nome: item.name,
                        descricao: item.description ?? null,
                        imagemIcon: item.images?.icon ?? null,
                        precoOriginal: item.regularPrice ?? 0,
                        precoFinal: item.finalPrice ?? 0,
                        desconto: item.discount ?? false,
                        usuario: { connect: { id: userId } }
                    }
                })

                for (const it of item.includedItems) {
                    const itemExists = await tx.item.findFirst({
                        where: { itemId: it.id, usuarioId: userId }
                    })

                    if (itemExists) {
                        if (!itemExists.ativo) {
                            await tx.item.update({
                                where: { usuarioId_itemId: { usuarioId: userId, itemId: it.id } },
                                data: { ativo: true }
                            })
                        }
                    } else {
                        await tx.item.create({
                            data: {
                                itemId: it.id,
                                nome: it.name,
                                descricao: it.description ?? null,
                                tipo: it.type?.displayValue ?? null,
                                raridade: it.rarity?.value ?? null,
                                imagemIcon: it.images?.icon ?? null,
                                imagemPequena: it.images?.smallIcon ?? null,
                                preco: 0,
                                ativo: true,
                                usuario: { connect: { id: userId } },
                                bundle: { connect: { id: novoBundle.id } }
                            }
                        })
                    }
                }

                await tx.historicoTransacao.create({
                    data: {
                        tipo: 'COMPRA',
                        valor: item.finalPrice,
                        bundleId: novoBundle.id,
                        usuarioId: userId
                    }
                })
                return novoBundle
            })

            return res.json({
                type: 'bundle',
                item: novoBundle,
                message: 'Pacote comprado com sucesso'
            })
        } else {
            const itemExists = await prisma.item.findFirst({
                where: {
                    itemId: item.id,
                    usuarioId: userId
                }
            })

            if (usuario.creditos < item.finalPrice) return res.status(409).json({ error: 'Não possui VBucks suficientes' })

            if (itemExists) {
                if (itemExists.ativo) {
                    return res.status(409).json({ error: 'Você já possui esse item.' })
                } else {
                    const i = await prisma.item.update({
                        where: { usuarioId_itemId: { usuarioId: userId, itemId: item.id } },
                        data: {
                            ativo: true,
                            preco: item.finalPrice ?? 0,
                            bundleId: null,
                        }
                    })

                    await prisma.usuario.update({
                        where: { id: userId },
                        data: { creditos: { decrement: item.finalPrice } }
                    })

                    await prisma.historicoTransacao.create({
                        data: {
                            tipo: 'COMPRA',
                            valor: item.finalPrice,
                            itemId: i.id,
                            usuarioId: userId
                        }
                    })

                    return res.status(200).json({ message: 'Item comprado com sucesso' })
                }
            }

            const novoItem = await prisma.$transaction(async (tx) => {
                await tx.usuario.update({
                    where: { id: userId },
                    data: { creditos: { decrement: item.finalPrice } }
                })

                const novoItem = await tx.item.create({
                    data: {
                        itemId: item.id,
                        nome: item.name,
                        descricao: item.description ?? null,
                        tipo: item.type?.displayValue ?? null,
                        raridade: item.rarity?.value ?? null,
                        imagemIcon: item.images?.icon ?? null,
                        imagemPequena: item.images?.smallIcon ?? null,
                        preco: item.finalPrice ?? 0,
                        usuario: {
                            connect: { id: userId }
                        },
                    }
                })

                await tx.historicoTransacao.create({
                    data: {
                        tipo: 'COMPRA',
                        valor: item.finalPrice,
                        itemId: novoItem.id,
                        usuarioId: userId
                    }
                })

                return novoItem
            })

            return res.json({
                type: 'item',
                item: novoItem,
                message: 'Item comprado com sucesso'
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Você já pode ter um item deste pacote. Reembolse-o antes de comprar novamente.' })
    }
})

app.delete('/itens', middleware, async (req, res) => {
    const userId = req.user.id
    const item = req.body

    try {
        if (item.bundleId) {
            const inativeBundle = await prisma.$transaction(async (tx) => {

                const isInative = await tx.bundle.findUnique({
                    where: { usuarioId_bundleId: { usuarioId: userId, bundleId: item.bundleId } }
                })

                if (isInative.ativo) {
                    const pc = await tx.bundle.update({
                        where: { usuarioId_bundleId: { usuarioId: userId, bundleId: item.bundleId } },
                        data: { ativo: false }
                    })

                    await tx.item.updateMany({
                        where: {
                            usuarioId: userId,
                            bundleId: pc.id,
                            ativo: true
                        },
                        data: { ativo: false }
                    })

                    await tx.usuario.update({
                        where: { id: userId },
                        data: { creditos: { increment: item.precoFinal } }
                    })

                    await tx.historicoTransacao.create({
                        data: {
                            tipo: 'DEVOLUCAO',
                            valor: item.precoFinal,
                            bundleId: pc.id,
                            usuarioId: userId,
                        }
                    })
                    return res.json({ message: 'Pacote reembolsado com sucesso' })
                } else {
                    return res.status(409).json({ error: 'Você não possui este pacote para reembolsa-lo.' })
                }
            })
        } else {
            const inativeItem = await prisma.$transaction(async (tx) => {
                const isInative = await tx.item.findUnique({
                    where: { usuarioId_itemId: { usuarioId: userId, itemId: item.itemId } }
                })

                if (isInative.ativo) {
                    const it = await tx.item.update({
                        where: {
                            usuarioId_itemId: { usuarioId: userId, itemId: item.itemId },
                        },
                        data: { ativo: false }
                    })

                    await tx.usuario.update({
                        where: { id: userId },
                        data: { creditos: { increment: item.preco } }
                    })

                    await tx.historicoTransacao.create({
                        data: {
                            tipo: 'DEVOLUCAO',
                            valor: item.preco,
                            itemId: it.id,
                            usuarioId: userId,
                        }
                    })

                    return res.status(200).json({ message: 'Item reembolsado com sucesso' })
                } else {
                    return res.status(409).json({ error: 'Você não possui este item para reembolsa-lo.' })
                }
            })
        }
    } catch (error) {
        console.log(error)
        return res.json({ error: 'Não foi possivel reembolsar o item' })
    }
})

app.get('/inventory/:id', async (req, res) => {
    const userId = parseInt(req.params.id)

    try {
        const usuario = await prisma.usuario.findUnique({
            where: { id: userId },
            select: {
                itens: true,
                bundles: {
                    select: {
                        id: true,
                        nome: true,
                        descricao: true,
                        imagemIcon: true,
                        precoOriginal: true,
                        precoFinal: true,
                        desconto: true,
                        ativo: true,
                        bundleId: true,
                        itens: true,
                    }
                }
            }
        })

        const itens = usuario.itens.filter(item => item.bundleId === null)

        res.json({ itens, bundles: usuario.bundles })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erro ao buscar o inventario' })
    }
})

app.get('/me', middleware, async (req, res) => {
    const userId = req.user.id

    try {
        const itens = await prisma.usuario.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                creditos: true,
            }
        })

        return res.json({ message: itens })
    } catch (error) {
        console.log(error)
        return res.json({ message: 'Erro ao localizar o usuario' })
    }
})

app.get('/history/:id', middleware, async (req, res) => {
    const userId = parseInt(req.params.id)

    try {
        const historico = await prisma.historicoTransacao.findMany({
            where: { usuarioId: userId },
            include: {
                item: {
                    select: {
                        id: true,
                        nome: true,
                        raridade: true,
                        imagemIcon: true,
                        preco: true
                    },
                },
                bundle: {
                    select: {
                        id: true,
                        nome: true,
                        imagemIcon: true,
                        precoFinal: true,
                        precoOriginal: true,
                        desconto: true
                    },
                }
            },
            orderBy: { data: 'desc' }
        })

        return res.json({ message: historico })
    } catch (error) {
        console.log(error)
        return res.json({ message: 'Erro ao obter o histórico de compras' })
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await prisma.usuario.findMany({
            select: {
                email: true,
                id: true,
            }
        })
        return res.send({ users })
    } catch (error) {
        console.log(error)
        res.send({ error: 'Não foi possivel obter os usuarios' })
    }
})

app.get('/buyed', middleware, async (req, res) => {
    const userId = req.user.id

    try {
        const user = await prisma.usuario.findUnique({
            where: { id: userId },
            select: {
                itens: {
                    select: { itemId: true },
                    where: {
                        ativo: true,
                        bundle: null
                    }
                },
                bundles: {
                    select: {
                        itens: {
                            select: { itemId: true },
                        },
                    },
                    where: { ativo: true }
                }
            }
        })

        const itemIds = [
            ...user.itens.map(i => i.itemId),
            ...user.bundles.flatMap((b) => b.itens.map((i) => i.itemId))
        ]

        res.json({ buyedItems: itemIds })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erro ao buscar itens comprados' })
    }
})

app.listen(5000, () => {
    console.log(`Servidor rodando em http://localhost:5000`)
})

export default app
