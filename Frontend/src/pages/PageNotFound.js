import React from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {

    const navigate = useNavigate()
    return (
        <div className='bg-gray-200'>
            <Header />
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <h1 className='text-9xl text-gradient font-bold'>404</h1>
                <h2 className='text-gray-700 mb-6 text-2xl font-medium'>Pagina Não Encontrada</h2>
                <div className='border border-gray-300 py-3 px-2 rounded-md text-gray-800 hover:bg-gray-100'>
                    <button className='text-gray-700 ' onClick={() => navigate('/')}>Voltar a Pagina Inicial</button>
                </div>
            </div>
        </div>
    )
}

export default PageNotFound