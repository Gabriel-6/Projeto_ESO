import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import Api from '../utils/Api';
import { showErrorMessage } from '../utils/Notifications';
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user')
        return savedUser ? JSON.parse(savedUser) : null
    })

    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null
    })

    const [buyed, setBuyed] = useState([])

    const isLogged = !!token && !!user

    const refreshAuth = () => {
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        setToken(savedToken || null)
        setUser(savedUser ? JSON.parse(savedUser) : null)
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    const updateUserData = useCallback(async () => {
        if (!isLogged) return

        try {
            const response = await Api.get('/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const { id, email, creditos } = response.data.message

            const updatedUser = { id, email, creditos }

            setUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser))

        } catch (error) {
            console.error(error)
            showErrorMessage('Erro ao atualizar os dados do usuário.')
        }
    }, [isLogged, token])

    const updateBuyedItems = useCallback(async () => {
        if (!isLogged) return

        try {
            const response = await Api.get('/buyed', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setBuyed(response.data?.buyedItems)
        } catch (error) {
            console.log(error)
        }
    }, [isLogged, token])

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'user' || event.key === 'token') {
                refreshAuth()
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    return (
        <AuthContext.Provider value={{ user, token, logout, isLogged, refreshAuth, updateUserData, updateBuyedItems, buyed }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
