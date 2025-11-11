import React from 'react'
import Header from '../components/Header'
import Template from '../components/Template'
import ModalItem from '../components/ModalItem'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { updateUserData, token, isLogged, buyed, updateBuyedItems } = useAuth()

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [filterItems, setFilterItems] = useState([])
  const [filters, setFilters] = useState({
    name: '',
    type: 'all',
    rarity: 'all',
    dateStart: '2000-01-01',
    dateEnd: '2100-01-01',
    showShop: true,
    showNew: false,
    showDiscount: false,
    showCosmetics: false,
    showBundle: 'all',
  })

  const [visibleCount, setVisibleCount] = useState(20)
  const containerRef = useRef(null)
  const loaderRef = useRef(null)
  const [selectedItem, setSelectedItem] = useState()

  useEffect(() => {
    const getCosmetics = async () => {
      try {
        const [cosmeticsItems, newItems, shopItems] = await Promise.all([
          axios.get('https://fortnite-api.com/v2/cosmetics/br'),
          axios.get('https://fortnite-api.com/v2/cosmetics/new'),
          axios.get('https://fortnite-api.com/v2/shop')
        ])

        const cosmetics = (cosmeticsItems.data.data || []).map(item => ({
          ...item,
          source: ['cosmetics']
        }))

        const nItems = (newItems.data.data.items.br || []).map(item => ({
          ...item,
          source: ['new']
        }))

        const shopData = shopItems.data.data || {}
        const entries = shopData.entries || []

        const shopItem = entries
          .filter(entry => !entry.bundle)
          .flatMap(entry => {
            const regularPrice = entry.regularPrice
            const finalPrice = entry.finalPrice
            const hasDiscount = regularPrice !== finalPrice
            if (!entry.brItems) return []
            return entry.brItems.map(item => {
              return {
                ...item,
                source: hasDiscount ? ['shop', 'discount'] : ['shop'],
                isBundle: false,
                regularPrice,
                finalPrice,
                discount: hasDiscount,
                bundle: null,
              }
            })
          })

        const shopBundle = entries
          .filter(entry => entry.bundle)
          .map(entry => {
            const regularPrice = entry.regularPrice
            const finalPrice = entry.finalPrice
            const hasDiscount = regularPrice !== finalPrice
            return {
              id: entry.bundle?.name || entry.offerId,
              name: entry.bundle?.name || 'Pacote Desconhecido',
              description: entry.bundle?.info || 'Pacote especial da loja',
              images: { icon: entry.bundle?.image },
              source: hasDiscount ? ['shop', 'bundle', 'discount'] : ['shop', 'bundle'],
              isBundle: true,
              regularPrice,
              finalPrice,
              discount: regularPrice !== finalPrice,

              includedItems: entry.brItems?.map(innerItem => ({
                id: innerItem.id,
                name: innerItem.name,
                description: innerItem.description,
                images: innerItem.images,
                rarity: innerItem.rarity,
                type: innerItem.type,
                added: innerItem.added,
              })) || [],
            }
          })


        const allItems = [...shopItem, ...nItems, ...cosmetics, ...shopBundle]

        const mergeItems = allItems.reduce((acc, item) => {
          if (!acc[item.id]) {
            acc[item.id] = { ...item }
          } else {
            acc[item.id].source = Array.from(new Set([...acc[item.id].source, ...item.source]))
          }
          return acc
        }, {})

        const uniqueItems = Object.values(mergeItems)

        setItems(uniqueItems)
        setFilterItems(uniqueItems)

      } catch (error) {
        console.error('Erro ao buscar dados da API', error)
      } finally {
        setLoading(false)
      }
    }

    getCosmetics()
  }, [])

  useEffect(() => {
    updateUserData()
    const filtered = items.filter(item => {
      const matchesName = item.name.toLowerCase().includes(filters.name.toLowerCase())

      const matchesBundle =
        filters.showBundle === 'all' ||
        (filters.showBundle === 'bundle' && item.isBundle) ||
        (filters.showBundle === 'normal' && !item.isBundle) ||
        (filters.showBundle === 'discount' && item.discount)

      const matchesSource =
        (
          (filters.showCosmetics && item.source.includes('cosmetics')) ||
          (filters.showNew && item.source.includes('new')) ||
          (filters.showShop && item.source.includes('shop')) ||
          (filters.showDiscount && item.source.includes('discount'))
        )

      const matchesType =
        filters.type === 'all' ||
        item.type?.value.toLowerCase() === filters.type.toLowerCase() ||
        (filters.type === 'others' && ![
          'outfit',
          'pickaxe',
          'backpack',
          'glider',
          'banner',
          'pet',
          'emote',
          'spray',
          'contrail',
        ].includes(item.type?.value?.toLowerCase()))

      const matchesRarity =
        (filters.rarity === 'all') ||
        (item.rarity?.value.toLowerCase() === filters.rarity.toLowerCase()) ||
        ((filters.rarity === 'others') && ![
          'common',
          'uncommon',
          'rare',
          'epic',
          'legendary',
        ].includes(item.rarity?.value?.toLowerCase()))

      const matchesDate =
        (!filters.dateStart && !filters.dateEnd)
          ? true
          : item.added
            ? (new Date(item.added) >= new Date(filters.dateStart) &&
              new Date(item.added) <= new Date(filters.dateEnd + 'T23:59:59'))
            : true

      return matchesName && matchesSource && matchesRarity && matchesType && matchesDate && matchesBundle
    })

    setFilterItems(filtered)
  }, [filters, items, updateUserData])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting) {
          setVisibleCount((prev) => prev + 20)
        }
      },
      {
        root: container,
        rootMargin: '0px',
        threshold: 0.1,
      }
    )

    if (loaderRef.current) observer.observe(loaderRef.current)

    return () => {
      // eslint-disable-next-line
      if (loaderRef.current) observer.unobserve(loaderRef.current)
    }
  }, [items])

  useEffect(() => {
    updateBuyedItems()
  }, [isLogged, token, updateBuyedItems])

  useEffect(() => {
    if (!buyed.length || !items.length) return

    const bought = new Set(buyed)

    const updateItems = items.map(item => ({
      ...item,
      source: bought.has(item.id) ? Array.from(new Set([...(Array.isArray(item.source) ? item.source : [item.source]).filter(Boolean), 'buy'])) : item.source
    }))

    if (JSON.stringify(updateItems) !== JSON.stringify(items)) {
      setItems(updateItems)
    }
  }, [buyed, items])

  const visibleItems = filterItems.slice(0, visibleCount)

  if (loading) return <p className='text-center mt-10'>Carregando...</p>
  return (
    <div className='bg-gray-200 min-h-screen'>
      <Header />
      <section className='container mx-auto my-12' id='home'>
        <div className='grid grid-cols-1 md:grid-cols-3 md:gap-5'>

          <ModalItem
            item={selectedItem}
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
          />

          <div className='bg-white p-6 rounded-lg shadow-xl border border-gray-300 w-full my-6 max-h-max'>
            <h1 className='font-medium text-2xl'>Filtros</h1>
            <div className='gap-3 mb-4'>

              <div className='my-4'>
                <h1 className='text-gray-700 font-medium'>Tipo de Loja</h1>
                <select
                  className='w-full border border-gray-300 rounded px-2 py-1 text-sm'
                  value={filters.showBundle}
                  onChange={(e) => setFilters({ ...filters, showBundle: e.target.value })}
                >
                  <option value='all'>Todos</option>
                  <option value='normal'>Itens Normais</option>
                  <option value='bundle'>Pacotes</option>
                </select>
              </div>

              <div className='my-4'>
                <h1 className='text-gray-700 font-medium'>Tipo de Item</h1>
                <select
                  className='w-full border border-gray-300 rounded px-2 py-1 text-sm'
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value='all'>Todos</option>
                  <option value='outfit'>Skin</option>
                  <option value='pickaxe'>Picareta</option>
                  <option value='backpack'>Mochila</option>
                  <option value='glider'>Planador</option>
                  <option value='banner'>Banner</option>
                  <option value='pet'>Pet</option>
                  <option value='emote'>Emote</option>
                  <option value='spray'>Spray</option>
                  <option value='contrail'>Rastro</option>
                  <option value='others'>Outros</option>
                </select>
              </div>

              <div className='my-4'>
                <h1 className='text-gray-700 font-medium'>Raridade</h1>
                <select
                  className='w-full border border-gray-300 rounded px-2 py-1 text-sm'
                  value={filters.rarity}
                  onChange={(e) => setFilters({ ...filters, rarity: e.target.value })}
                >
                  <option value='all'>Todas</option>
                  <option value='common'>Comum</option>
                  <option value='uncommon'>Incomum</option>
                  <option value='rare'>Raro</option>
                  <option value='epic'>Épico</option>
                  <option value='legendary'>Lendário</option>
                  <option value='others'>Outras</option>
                </select>
              </div>

              <div className='my-4'>
                <h1 className='text-gray-700 font-medium'>Periodo</h1>
                <div className='grid md:grid-cols-2 md:justify-between gap-5'>
                  <div>
                    <h1 className='text-sm text-gray-700 font-medium'>Data Inicial</h1>
                    <input className='border border-gray-300 rounded px-2 py-1 text-sm w-full md:full text-center' type='date' value={filters.dateStart} onChange={(e) => (setFilters({ ...filters, dateStart: e.target.value }))} />
                  </div>
                  <div>
                    <h1 className='text-sm text-gray-700 font-medium'>Data Final</h1>
                    <input className='border border-gray-300 rounded px-2 py-1 text-sm w-full md:full text-center' type='date' value={filters.dateEnd} onChange={(e) => (setFilters({ ...filters, dateEnd: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div className='flex gap-5 items-center'>
                <div>
                  <h1 className='text-gray-700 font-medium'>Filtrar por Itens</h1>
                  <div className='space-y-3 text-gray-700 font-medium'>
                    <label className='flex items-center space-x-2 text-gray-700'>
                      <input
                        type='checkbox'
                        checked={filters.showShop}
                        onChange={(e) => setFilters({ ...filters, showShop: e.target.checked })}
                        className='w-4 h-4 rounded-full border-2'
                      />
                      <h1>A Venda</h1>
                    </label>

                    <label className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        checked={filters.showNew}
                        onChange={(e) => setFilters({ ...filters, showNew: e.target.checked })}
                        className='w-4 h-4 rounded-full border-2'
                      />
                      <h1>Novo</h1>
                    </label>

                    <label className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        checked={filters.showDiscount}
                        onChange={(e) => setFilters({ ...filters, showDiscount: e.target.checked })}
                        className='w-4 h-4 rounded-full border-2'
                      />
                      <h1>Em Promoção</h1>
                    </label>

                    <label className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        checked={filters.showCosmetics}
                        onChange={(e) => setFilters({ ...filters, showCosmetics: e.target.checked })}
                        className='w-4 h-4 rounded-full border-2'
                      />
                      <h1>Todos os itens</h1>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-span-2'>
            <h1 className='text-gray-700 font-medium ml-1'>Item</h1>
            <input type='text' className='w-full px-4 py-2 border border-gray-300 rounded-lg mb-5' placeholder='Pesquisar pelo item.' value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />

            <div ref={containerRef} className='bg-white max-h-[70vh] overflow-y-auto border rounded-lg p-3'>
              <div className='flex justify-between items-center my-3'>
                <div>
                  <p className='text-gray-700 font-medium mb-3'>Foram encontrados {filterItems.length} itens.</p>
                </div>

              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5'>
                {visibleItems.map((item) => (
                  <Template item={item} key={item.id} openModal={() => setSelectedItem(item)} />
                ))}
              </div>
              <div ref={loaderRef} className='flex justify-center mt-6'>
                {filterItems.length === 0 ? (
                  <p className='text-gray-500 text-center'>Nenhum item encontrado.</p>
                ) : visibleCount < filterItems.length ? (
                  <p className='text-gray-500'>Carregando mais itens...</p>
                ) : (
                  <p className='text-gray-400'>Todos os itens foram carregados.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home