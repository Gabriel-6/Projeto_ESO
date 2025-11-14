import { test, assert } from 'poku';
import request from 'supertest';
import app from '../src/index.js';
import { itemData, bundleData, bundleSell, genarateEmail, itemSell } from './tests.js';


const email = genarateEmail()
var token = ''

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

await test('POST /register - Registro de um novo usuario', async () => {
    const response = await request(app)
        .post('/register')
        .send({
            email: email,
            senha: '12345'
        })

    assert.deepStrictEqual(response.body, { 'message': 'Usuario registrado com sucesso!' })
})

await delay(500)

await test('POST /login - Realizar o login do usuario', async () => {
    const response = await request(app)
        .post('/login')
        .send({
            email: email,
            senha: '12345'
        })

    token = response.body.authorization

    assert.deepStrictEqual(response.body.message, 'Login realizado com sucesso')
})

await delay(500)

await test('POST /itens - Comprar um item', async () => {
    const response = await request(app)
        .post('/itens')
        .set({ 'Authorization': `Bearer ${token}` })
        .send(itemData)

    assert.deepStrictEqual(response.body.message, 'Item comprado com sucesso')
})

await delay(500)

await test('POST /itens - Comprar um pacote', async () => {
    const response = await request(app)
        .post('/itens')
        .set({ 'Authorization': `Bearer ${token}` })
        .send(bundleData)

    assert.deepStrictEqual(response.body.message, 'Pacote comprado com sucesso')
})

await delay(500)

await test('POST /itens - Impedir compra de item duplicado', async () => {
    const response = await request(app)
        .post('/itens')
        .set({ 'Authorization': `Bearer ${token}` })
        .send(itemData)
    
    console.log(response.body)
    assert.deepStrictEqual(response.body.error, 'Você já possui esse item.')
})

await delay(500)

await test('POST /itens - Impedir compra de pacote duplicado', async () => {
    const response = await request(app)
        .post('/itens')
        .set({ 'Authorization': `Bearer ${token}` })
        .send(bundleData)

    assert.deepStrictEqual(response.body.error, 'Você já possui esse pacote.')
})

await delay(500)

await test('DELETE /itens - Reembolsar um item', async () => {
    const response = await request(app)
        .delete('/itens')
        .set({ 'Authorization': `Bearer ${token}` })
        .send(itemSell)

    assert.deepStrictEqual(response.body.message, 'Item reembolsado com sucesso')
})

await delay(500)

await test('DELETE /itens - Reembolsar um pacote', async () => {
    const response = await request(app)
        .delete('/itens')
        .set({ 'Authorization': `Bearer ${token}` })
        .send(bundleSell)

    console.log(response)
    assert.deepStrictEqual(response.body.message, 'Pacote reembolsado com sucesso')
})
