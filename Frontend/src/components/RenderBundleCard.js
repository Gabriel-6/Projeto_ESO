import React from 'react'
import { CgShoppingCart } from 'react-icons/cg'
import { useSellItem } from '../utils/SellItems'

const RenderBundleCard = ({ myInventory, onSellSuccess, ...bundle }) => {
    const rarityClass = {
        common: 'bg-gray-400 text-white',
        uncommon: 'bg-green-500 text-white',
        rare: 'bg-sky-500 text-white',
        epic: 'bg-purple-500 text-white',
        legendary: 'bg-amber-500 text-white',
        default: 'bg-red-500 text-white',
    }

    const { handleSell } = useSellItem()

    const handleSellClick = async () => {
        const success = await handleSell(bundle)
        if (success && typeof onSellSuccess === 'function') {
            await onSellSuccess()
        }
    }

    console.log(bundle)

    const rarityStyle = rarityClass[bundle.raridade] || rarityClass.default
    return (
        <div key={bundle.id} className='mb-6 p-3 border border-gray-200 rounded-md bg-gray-50'>
            <div className='flex items-center gap-4 mb-3 justify-between'>
                <div className=''>
                    <img
                        src={bundle.imagemIcon}
                        alt={bundle.nome}
                        className='h-20 w-20 object-contain'
                    />
                    <div>
                        <h3 className='text-lg font-semibold'>{bundle.nome}</h3>
                        <p className='text-sm text-gray-500'>{bundle.descricao}</p>
                        <div className='mt-1'>
                            {bundle.desconto ? (
                                <div className='flex items-center'>
                                    <img src='https://fortnite-api.com/images/vbuck.png' alt='v-buck' className='h-8 w-8 mr-1' />
                                    <span className='text-gray-700 font-bold mr-2'>{bundle.precoFinal}</span>
                                    <span className='line-through text-gray-400 '>{bundle.precoOriginal}</span>
                                </div>
                            ) : (
                                <div className='flex items-center'>
                                    <img src='https://fortnite-api.com/images/vbuck.png' alt='v-buck' className='h-8 w-8 mr-1' />
                                    <span className='font-bold'>{bundle.precoFinal || bundle.precoOriginal}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {myInventory && (
                    <div
                        className='flex items-center px-3 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white self-center cursor-pointer'
                        onClick={handleSellClick} >
                        <CgShoppingCart className="w-6 h-6 pr-1" /> <p>Devolver</p>
                    </div>
                )}

            </div>
            <div className='grid grid-cols-3 gap-3'>
                {bundle.itens.map(item => (
                    <div key={item.id} className='flex flex-col items-center text-center'>
                        <img
                            src={item.imagemIcon || item.imagemPequena}
                            alt={item.nome}
                            className={`h-14 w-14 object-contain mb-1 ${rarityStyle}`}
                        />
                        <p className='text-sm font-medium'>{item.nome}</p>
                        <p className='text-xs text-gray-500'>{item.tipo}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RenderBundleCard