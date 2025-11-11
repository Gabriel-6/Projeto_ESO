import React from 'react'
import TypeIcon from './TypeIcon'
import { useBuyItem } from '../utils/BuyItems'


const Template = ({ item, openModal }) => {

    const { handleBuy } = useBuyItem()

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
        <div key={item.id} className='bg-white border transition rounded-lg overflow-hidden shadow-sm hover:-translate-y-1 hover:scale-110 cursor-pointer' onClick={openModal}>
            <div className=''>
                <TypeIcon source={item.source} key={item.id} />
            </div>

            <div>
                <img src={item.images.icon || item.images?.smallIcon} alt={item.name} className={`w-60 h-56 mx-auto mb-3 mt-3 ${rarityStyle}`} />
            </div>

            {item.source.includes('bundle') ? (
                <div>
                    <h2 className='text-lg font-medium ml-3 mb-3'>{item.name}</h2>
                    <p className='text-gray-700 text-sm capitalize ml-3 mb-3'>{item.description}</p>

                    {item?.finalPrice &&
                        <div className=' justify-between mx-3 my-3'>

                            <div className='flex items-center'>
                                <img src='https://fortnite-api.com/images/vbuck.png' alt='v-buck' className='h-6 w-6 mr-1' />
                                {item.discount ? (
                                    <div className='flex gap-3 items-center'>
                                        <p className='text-gray-700 font-medium'>{item?.finalPrice}</p>
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
                    <h2 className='text-lg font-medium ml-3 mb-3'>{item.name}</h2>
                    <p className='text-gray-700 text-sm capitalize ml-3 mb-3'>{item.type?.value}</p>

                    <div className='ml-3 mb-3'>
                        <span className={`text-sm text-center rounded-md px-4 py-2 capitalize ${rarityStyle}`}>{item.rarity?.value}</span>
                    </div>

                    {item?.finalPrice &&
                        <div className='justify-between mx-3 my-3'>
                            <div className='flex items-center'>
                                <img src='https://fortnite-api.com/images/vbuck.png' alt='v-buck' className='h-8 w-8 mr-1' />
                                {item.discount ? (
                                    <div className='md:flex gap-3 items-center'>
                                        <p className='text-gray-700 font-medium'>{item?.finalPrice}</p>
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
            )}
        </div >
    )
}

export default Template