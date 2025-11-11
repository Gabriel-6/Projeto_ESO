import { toast } from 'react-toastify';

const toastConfig = {
    position: 'bottom-center',
    autoClose: 5000,
    hideProgressBar: false,
    newestOnTop: false,
    closeOnClick: false,
    rtl: false,
    theme: 'light'
}

export const showSucessMessage = (message) => {
    toast.success(message, toastConfig)
}

export const showErrorMessage = (message) => {
    toast.error(message, toastConfig)
}

export const showInfoMessage = (message) => {
    toast.info(message, toastConfig)
}
