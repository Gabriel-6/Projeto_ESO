import Api from "./Api"
import { showErrorMessage, showInfoMessage, showSucessMessage } from '../utils/Notifications'
import { useAuth } from '../context/AuthContext'

export const useSellItem = () => {
    const { isLogged, token, updateUserData } = useAuth()

    const handleSell = async (item) => {
        if (!isLogged) {
            showInfoMessage('É necessário estar logado para realizar uma compra.')
            return false
        }

        try {
            const response = await Api.delete('/itens', {
                data: item,
                headers: { Authorization: `Bearer ${token}` },
            })

            showSucessMessage(response.data.message)

            await new Promise(res => setTimeout(res, 300))
            await updateUserData()

            return true
        } catch (error) {
            console.error(error)
            showErrorMessage(error.response?.data?.error || 'Erro ao realizar a venda.')
            return false
        }
    }

    return { handleSell }
}