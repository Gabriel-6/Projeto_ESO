import React from 'react'
import TypeIcon from './TypeIcon'
import { useBuyItem } from '../utils/BuyItems'

const ModalItem = ({ item, isOpen, onClose }) => {
    const { handleBuy } = useBuyItem()

    if (!isOpen) return null

    const rarityClass = {
        common: 'bg-gray-400 text-white',
        uncommon: 'bg-green-500 text-white',
        rare: 'bg-sky-500 text-white',
        epic: 'bg-purple-500 text-white',
        legendary: 'bg-amber-500 text-white',
        default: 'bg-red-500 text-white',
    }

    const rarityStyle = rarityClass[item.rarity?.value] || rarityClass.default

    return (
        <>
            <div className='fixed inset-0 bg-black bg-opacity-50 z-40' />

            <div className='fixed inset-0 flex items-center justify-center z-50'>
                <div className='bg-white shadow-lg w-full max-w-2xl max-h-[85vh] overflow-y-auto p-4 sm:p-6'>
                    <div className='flex justify-between mb-3 items-center'>
                        <p className='text-lg sm:text-xl text-gray-700 font-medium'>Detalhes do Item</p>
                        <button
                            className='text-xl text-gray-700 font-medium hover:text-red-600'
                            onClick={onClose}>
                            X
                        </button>
                    </div>
                    <div>
                        {item.isBundle ? (
                            <div>
                                <TypeIcon source={item.source} key={item.id} />
                                <img src={item.images.icon || item.images?.smallIcon} alt={item.name} className={`w-80 h-80 mx-auto mb-3 mt-3 ${rarityStyle}`} />
                                <h2 className='text-lg font-medium ml-3 mb-3'>{item.name}</h2>
                                <p className='text-gray-700 text-sm capitalize ml-3 mb-3'>{item.description}</p>

                                <div className='max-h-96 overflow-y-auto'>
                                    {(Array.isArray(item.includedItems) && item.includedItems.length > 0) && (
                                        <div className='mx-3'>
                                            <p className='text-gray-800 font-medium'>Itens do Pacote</p>
                                            <div>
                                                {item.includedItems?.map((item) => (
                                                    <div key={item.id} className='border rounded'>
                                                        <div className='flex'>
                                                            <img src={item.images?.icon || item.images?.smallIcon} alt={item.name} className={`w-28 h-28 rounded ${rarityStyle}`} />
                                                            <div className='grid md:grid-cols-[2fr_1fr] gap-2 px-1 py-1'>
                                                                <div className='flex flex-col justify-between capitalize '>
                                                                    <p className='font-medium text-gray-900 text-lg'>{item.name}</p>
                                                                    <p className='font-medium text-gray-700'>{item?.description}</p>
                                                                    <p className='font-medium text-gray-600'>{item.type?.value}</p>
                                                                </div>
                                                                <div className='flex flex-col justify-between capitalize'>
                                                                    <p className={`text-sm text-center rounded-md px-4 py-2 ${rarityStyle}`}>{item.rarity?.value}</p>
                                                                    <p className='text-gray-500 text-sm font-medium'>Adicionado: {new Date(item?.added).toLocaleString('pt-BR')}</p>
                                                                </div>
                                                            </div>
                                                            <div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {item?.finalPrice &&
                                    <div className=' justify-between mx-3 my-3'>
                                        <div className='flex items-center'>
                                            <img src='https://fortnite-api.com/images/vbuck.png' alt='v-buck' className='h-6 w-6 mr-1' />
                                            {item.discount ? (
                                                <div className='flex gap-3 items-center'>
                                                    <p className='text-gray-700 font-bold'>{item?.finalPrice}</p>
                                                    <p className='text-gray-500 text-sm line-through'>{item?.regularPrice}</p>
                                                </div>
                                            ) : (
                                                <p className='text-gray-700 font-medium'>{item?.finalPrice}</p>
                                            )}

                                        </div>
                                        <div>
                                            <button className='bg-green-500 px-3 py-2 rounded-md w-full hover:bg-green-700 mt-2 text-white' onClick={(e) => {
                                                handleBuy(item)
                                                e.stopPropagation()
                                            }}>Comprar</button>
                                        </div>

                                    </div>
                                }
                            </div>
                        ) : (
                            <div>
                                <TypeIcon source={item.source} key={item.id} />
                                <img src={item.images.icon || item.images?.smallIcon} alt={item.name} className={`w-60 h-56 mx-auto mb-3 mt-3 ${rarityStyle}`} />
                                <h2 className='text-lg font-medium ml-3 mb-3'>{item.name}</h2>
                                <p className='text-gray-700 text-sm capitalize ml-3 mb-3'>{item.description}</p>
                                <p className='text-gray-700 text-sm capitalize ml-3 mb-3'>{item.type?.value}</p>

                                <div className='mx-3 mb-3'>
                                    <span className={`text-sm text-center rounded-md px-4 py-2 capitalize ${rarityStyle}`}>{item.rarity?.value}</span>
                                </div>


                                {item?.finalPrice &&
                                    <div className='justify-between mx-3 my-3'>
                                        <div className='flex items-center'>
                                            <img src='https://fortnite-api.com/images/vbuck.png' alt='v-buck' className='h-8 w-8 mr-1' />
                                            {item.discount ? (
                                                <div className='md:flex gap-3 items-center'>
                                                    <p className='text-gray-700 font-bold'>{item?.finalPrice}</p>
                                                    <p className='text-gray-500 text-sm line-through'>{item?.regularPrice}</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className='text-gray-700 font-medium'>{item?.finalPrice}</p>
                                                </div>
                                            )}

                                        </div>
                                        <div className='py-1.5'>
                                            <button className='bg-green-500 px-3 py-2 rounded-md w-full hover:bg-green-700 mt-2 text-white' onClick={(e) => {
                                                handleBuy(item)
                                                e.stopPropagation()
                                            }}>Comprar</button>
                                        </div>
                                    </div>
                                }
                                <div className='px-3 py-2'>
                                    <p className='text-gray-500 text-sm font-medium'>Adicionado em: {new Date(item?.added).toLocaleString('pt-BR')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalItem