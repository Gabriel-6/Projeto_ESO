import bcrypt from 'bcrypt';

export const gerarHash = async (senha) => {
    const hash = await bcrypt.hash(senha, 10)
    return String(hash)
}

export const compareHash = async (senha, hash) => {
    const decrypt = await bcrypt.compare(senha, hash)
    return decrypt
}