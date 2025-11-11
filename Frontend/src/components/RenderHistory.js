import React from 'react'

const RenderHistory = (item) => {
  const typeStyles = {
    COMPRA: {
      bg: 'bg-green-100',
      border: 'border border-green-400',
      tag: 'bg-green-500 text-white',
      label: 'Compra',
    },
    DEVOLUCAO: {
      bg: 'bg-red-100',
      border: 'border border-red-400',
      tag: 'bg-red-500 text-white',
      label: 'Devolução',
    },
  }

  const style = typeStyles[item.tipo]
  const isBundle = !!item.bundle
  const dataFormatada = item?.data ? new Date(item?.data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : 'Data Indisponivel'

  const nome = isBundle ? item.bundle.nome : item.item?.nome
  const imagem = isBundle ? item.bundle.imagemIcon : item.item?.imagemIcon
  const preco = isBundle ? item.bundle?.precoFinal ?? 0 : item.item?.preco ?? 0
  const raridade = item.item?.raridade

  return (
    <div
      key={item.id}
      className={`flex items-center gap-3 p-3 rounded-md shadow-sm ${style.bg} ${style.border}`}
    >
      {imagem && (
        <img
          src={imagem}
          alt={nome}
          className='w-14 h-14 rounded-md object-cover border border-gray-300'
        />
      )}

      <div className='flex-1'>
        <div className='flex justify-between items-center'>
          <h1 className='font-semibold text-gray-800'>{nome}</h1>
          <span
            className={`text-xs px-2 py-1 rounded-md ${style.tag}`}
          >
            {style.label}
          </span>
        </div>

        <p className='text-gray-600 text-sm capitalize'>
          {isBundle
            ? `Pacote - ${preco.toLocaleString('pt-BR')} V-Bucks`
            : `Item ${raridade ? `(${raridade})` : ''} - ${preco.toLocaleString('pt-BR')} V-Bucks`}
        </p>

        <p className='text-gray-500 text-xs font-medium mt-1'>
          {item.tipo === 'COMPRA'
            ? `Comprado em: ${dataFormatada}`
            : `Devolvido em: ${dataFormatada}`}
        </p>
      </div>
    </div>
  )
}

export default RenderHistory
