import React, { useState } from 'react'
import { FaRegUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { showSucessMessage } from '../utils/Notifications';
import { MdInventory2, MdOutlineMenu } from 'react-icons/md';


const Header = () => {
    const [open, setOpen] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const navigate = useNavigate()

    const { logout, isLogged } = useAuth()
    const creditos = JSON.parse(localStorage.getItem('user'))?.creditos

    return (
        <header>
            <div className='bg-header text-white shadow-lg'>
                <div className='container mx-auto flex px-4 py-4 justify-between items-center'>
                    <div className=''>
                        <a href='/' className='text-2xl font-medium'>Sistema ESO</a>
                    </div>
                    <div className='hidden md:flex space-x-6'>
                        <a href='/' className='font-medium'>Items</a>
                        <a href='/inventory/me' className='font-medium'>Inventario</a>
                        <a href='/users' className='font-medium' >Usuarios</a>
                    </div>
                    <div className='relative items-center space-x-4'>
                        <div className='flex items-center'>
                            <div className='md:hidden'>
                                <MdOutlineMenu className='h-8 w-8' onClick={() => (setOpenMenu(!openMenu))} />
                            </div>

                            {isLogged && (
                                <div className='flex items-center mr-3'>
                                    <img src='https://fortnite-api.com/images/vbuck.png' alt='v-buck' className='h-8 w-8 ' />
                                    <p className='font-bold text-lg'>{creditos}</p>
                                </div>)
                            }

                            <div className='w-10 h-10 rounded-full border-2 border-white text-2xl flex items-center justify-center cursor-pointer' onClick={() => (setOpen(!open))}>
                                <FaRegUser />
                            </div>
                        </div>
                        {open && (
                            <div className='absolute top-14 right-0 bg-white text-black rounded-lg shadow-md py-2 w-40 z-50'>
                                <>
                                    {isLogged ? (
                                        <div>
                                            <button
                                                className='flex items-center gap-1 w-full p-2 hover:bg-gray-100'
                                                onClick={() => {
                                                    navigate('/inventory/me')
                                                }}
                                            >
                                                <MdInventory2 /> <p>Inventario</p>
                                            </button>
                                            <button
                                                className='flex items-center gap-1 w-full p-2 hover:bg-gray-100'
                                                onClick={() => {
                                                    logout()
                                                    showSucessMessage('Você foi deslogado com sucesso!')
                                                }
                                                }
                                            >
                                                <FaSignOutAlt /> <p>Sair</p>
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <button
                                                className='flex items-center gap-1 w-full p-2 hover:bg-gray-100'
                                                onClick={() => (
                                                    navigate('/login')
                                                )}
                                            >
                                                <FaSignInAlt /> <p>Login</p>
                                            </button>
                                        </div>
                                    )
                                    }
                                </>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {openMenu && (
                <div className='md:hidden flex flex-col space-y-3 px-4 py-4 bg-white transition-all duration-300 ease-in-out overflow-hidden text-gray-800'>
                    <a href='/' className='font-medium'>Items</a>
                    <a href='/inventory/me' className='font-medium'>Inventario</a>
                    <a href='/users' className='font-medium' >Usuarios</a>
                </div>
            )}

        </header>
    )
}

export default Header
