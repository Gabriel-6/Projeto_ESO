import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Api from '../utils/Api'
import { showSucessMessage } from '../utils/Notifications'
import { useAuth } from '../context/AuthContext'


const Login = () => {
    const navigate = useNavigate()

    const { refreshAuth } = useAuth()

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [error, setError] = useState(false)

    const validUsers = () => {
        if (!email || !senha) {
            setError('Informe o email e senha.')
            return
        }

        Api.post('/login', {
            email,
            senha
        })
            .then((response) => {
                localStorage.setItem('token', response.data.authorization)
                localStorage.setItem('user', JSON.stringify(response.data.content))

                refreshAuth()

                showSucessMessage('Login realizado com sucesso.')
                navigate('/')
            }).catch((error) => {
                setError(error.response?.data?.error || 'Erro ao realizar o login')
            })
    }


    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-200 text-center'>
            <div className='flex flex-col items-center bg-white p-8 rounded-lg shadow-md'>
                <h1 className='text-4xl font-bold mb-2'>Atividade ESO</h1>
                <h2 className='mb-4 text-gray-600'>Faça login para continuar</h2>

                <div className='flex flex-col gap-3 w-64'>
                    <input type='email' placeholder='Email' className='border p-2 rounded-md' onChange={(e) => setEmail(e.target.value)} />
                    <input type='password' placeholder='Senha' className='border p-2 rounded-md' onChange={(e) => setSenha(e.target.value)} />
                    <button className='bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700' onClick={() => {
                        validUsers()
                    }}>
                        Entrar
                    </button>
                </div>

                {error && (
                    <div className='mt-4 text-red-600'>
                        <p>{error}</p>
                    </div>
                )}

                <p className='mt-4 text-gray-500'>ou</p>
                <p className='text-gray-600'>
                    Não tem uma conta?{' '}
                    <span className='text-blue-600 cursor-pointer hover:underline' onClick={() => navigate('/register')}>Registrar</span>
                </p>
            </div>
        </div>

    )
}

export default Login