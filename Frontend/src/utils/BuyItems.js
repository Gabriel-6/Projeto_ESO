import { showErrorMessage, showInfoMessage, showSucessMessage } from '../utils/Notifications'
import Api from '../utils/Api'
import { useAuth } from '../context/AuthContext'

export const useBuyItem = () => {
    const { isLogged, token, updateUserData, updateBuyedItems } = useAuth()

    const handleBuy = async (item) => {
        if (!isLogged) {
            showInfoMessage('É necessário estar logado para realizar uma compra.')
            return false
        }

        try {
            const response = await Api.post('/itens', item, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            await new Promise(res => setTimeout(res, 300))
            await updateUserData()
            await updateBuyedItems()
            showSucessMessage(response.data.message)
            return true
        } catch (error) {
            showErrorMessage(error.response?.data?.error || 'Erro ao realizar a compra.')
            return false
        }

    }

    return { handleBuy }
}