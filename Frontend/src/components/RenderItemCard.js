import { CgShoppingCart } from "react-icons/cg"
import { useSellItem } from '../utils/SellItems'

const RenderItemCard = ({ myInventory, onSellSuccess, ...i }) => {
    const { handleSell } = useSellItem()
    const rarityClass = {
        common: 'bg-gray-400 text-white',
        uncommon: 'bg-green-500 text-white',
        rare: 'bg-sky-500 text-white',
        epic: 'bg-purple-500 text-white',
        legendary: 'bg-amber-500 text-white',
        default: 'bg-red-500 text-white',
    }

    const rarityStyle = rarityClass[i.raridade] || rarityClass.default

    const handleSellClick = async () => {
        const success = await handleSell(i)
        if(success && typeof onSellSuccess === 'function') {
            await onSellSuccess()
        }
    }

    return (
        <div
            key={i.id}
            className='w-40 border border-gray-200 rounded-md p-3 flex flex-col justify-between bg-gray-50'
        >
            <div className='flex flex-col items-center'>
                <img
                    src={i.imagemIcon || i.imagemPequena}
                    alt={i.nome}
                    className={`h-20 w-20 object-contain mb-2 ${rarityStyle}`}
                />
                <h3 className='text-lg font-medium text-center line-clamp-1'>{i.nome}</h3>
                <p className='text-gray-700 text-sm capitalize line-clamp-1'>{i.tipo}</p>
                <p className='text-gray-700 text-sm italic text-center line-clamp-2'>{i.descricao}</p>
            </div>

            <div>
                <div className='flex items-center justify-center my-2'>
                    <img src='https://fortnite-api.com/images/vbuck.png' alt='v-buck' className='h-8 w-8 mr-1' />
                    <p className='font-semibold'>{i.preco}</p>
                </div>

                {myInventory && (
                    <div
                        className='flex items-center justify-center px-3 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white mx-auto cursor-pointer'
                        onClick={handleSellClick}
                    >
                        <CgShoppingCart className='w-6 h-6 pr-1' /> <p>Devolver</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RenderItemCard