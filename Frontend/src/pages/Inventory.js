import React, { useCallback, useEffect, useState } from 'react'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { useParams } from 'react-router-dom'
import Api from '../utils/Api'
import RenderItemCard from '../components/RenderItemCard'
import RenderBundleCard from '../components/RenderBundleCard'
import RenderHistory from '../components/RenderHistory'

const Inventory = () => {
  const { token, user, updateUserData } = useAuth()
  const { id } = useParams()
  const [items, setItems] = useState([])
  const [bundles, setBundles] = useState([])
  const [history, setHistory] = useState([])

  const userId = id === 'me' ? user?.id : id

  const fetchInventory = useCallback(async () => {
    try {
      const response = await Api.get(`/inventory/${userId}`)
      setItems(response.data.itens || [])
      setBundles(response.data.bundles || [])
      console.log(bundles)
    } catch (error) {
      console.log(error)
    }

  }, [userId])

  const fetchHistory = useCallback(async () => {
    updateUserData()
    try {
      const response = await Api.get(`/history/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setHistory(response.data.message || [])
    } catch (error) {
      console.log(error)
    }
  }, [userId, token, updateUserData])

  useEffect(() => {
    fetchInventory()
    fetchHistory()
  }, [fetchInventory, fetchHistory])

  const activeItems = items.filter(i => i.ativo)
  const activeBundles = bundles.filter(b => b.ativo)
  const myInventory = String(userId) === String(user?.id)

  return (
    <div>
      <Header />
      <div className='min-h-screen bg-gray-200 p-6 flex flex-col min-h-screen' id='inventory'>
        <div className='grid md:grid-cols-2 gap-6 flex-grow'>
          <div className='flex flex-col gap-8'>
            <div className='bg-white rounded-md border border-gray-100 shadow p-4 flex flex-col'>
              <h2 className='text-gray-700 font-semibold text-xl mb-4'>Itens</h2>
              <div className='gap-4 overflow-y-auto min-h-[300px] max-h-[300px]'>
                {activeItems.length > 0 ? (
                  <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {activeItems.map((item) => (
                      <RenderItemCard key={item.id} {...item} myInventory={myInventory} onSellSuccess={async () => {
                        await fetchHistory()
                        await fetchInventory()
                      }} />
                    ))}
                  </div>
                ) : (
                  <div className='flex items-center justify-center w-full h-full'>
                    <p className='text-gray-500 '>Não possui nenhum item.</p>
                  </div>
                )}
              </div>
            </div>

            <div className='bg-white rounded-md border border-gray-100 shadow p-4 flex flex-col'>
              <h2 className='text-gray-700 font-semibold text-xl mb-4'>Pacotes</h2>
              <div className='gap-4 overflow-y-auto min-h-[300px] max-h-[300px]'>
                {activeBundles.length > 0 ? (
                  activeBundles.map((item) => (
                    <RenderBundleCard key={item.id} {...item} myInventory={myInventory} onSellSuccess={async () => {
                      await fetchHistory()
                      await fetchInventory()
                    }} />
                  ))
                ) : (
                  <div className='flex items-center justify-center h-full'>
                    <p className='text-gray-500'>Não possui nenhum pacote.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='bg-white rounded-md border border-gray-100 shadow p-4 flex flex-col max-h-[730px]'>
            <h1 className='text-gray-700 font-semibold text-xl mb-4'>Histórico de Compras</h1>
            <div className={`flex flex-col gap-4 overflow-y-auto ${history.length === 0 ? 'items-center justify-center' : ''}`}>
              {history.length > 0 ? (
                <div className='w-full flex flex-col gap-2'>
                  {history.map((item) => (
                    <RenderHistory key={item.id} {...item} />
                  ))}
                </div>
              ) : (
                <p className='text-gray-500 text-center'>Não houve nenhuma movimentação</p>
              )}
            </div>
          </div>
        </div >
      </div >
    </div>
  )
}

export default Inventory