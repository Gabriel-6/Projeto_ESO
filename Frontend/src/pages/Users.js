import React, { useEffect, useState } from 'react'
import Api from '../utils/Api'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'

const Users = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])

    useEffect(() => {
        Api.get('/users')
            .then((response) => {
                setUsers(response.data.users || [])
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])
    
    return (
        <div className='bg-gray-200 min-h-screen'>
            <Header />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                {users.map(user => (
                    <div
                        key={user.id}
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-xl shadow hover:shadow-md bg-white transition-all cursor-pointer"
                        onClick={() => navigate(`/inventory/${user.id}`)}
                    >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center text-white font-bold text-xl">
                            {user.email[0].toUpperCase()}
                        </div>

                        <h3 className="mt-3 font-semibold text-gray-800">{user.email}</h3>
                        <p className="text-gray-500 text-sm">ID: {user.id}</p>

                        <div className="mt-3 text-sm text-emerald-600 font-medium">Ver inventário</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Users