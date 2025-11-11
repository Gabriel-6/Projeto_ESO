import { CiShop } from 'react-icons/ci'
import { MdOutlineFiberNew } from 'react-icons/md'
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import { BsBagCheck } from 'react-icons/bs';

const TypeIcon = ({ source = [] }) => {
  const normalizedSources = Array.isArray(source) ? source : [source]

  const sourceIcons = {
    new: {
      Icon: MdOutlineFiberNew,
      bg: 'bg-sky-500',
      tooltip: 'Item Novo',
      direction: 'justify-start',
      position: 'right',
    },
    shop: {
      Icon: CiShop,
      bg: 'bg-emerald-500',
      tooltip: 'Item a Venda',
      direction: 'justify-start',
      position: 'left',
    },
    buy: {
      Icon: BsBagCheck,
      bg: 'bg-gray-500',
      tooltip: 'Item Comprado',
      direction: 'justify-center',
      position: 'left',
    }
  }

  return (
    <div className='flex justify-between'>
      {
        normalizedSources.map((src, index) => {
          const key = src.toLowerCase()
          const cfg = sourceIcons[key]

          if (!cfg) return null

          const { Icon, bg, tooltip, direction, position } = cfg

          return (
            <div key={`${index}`}>
              <Tooltip
                title={tooltip}
                position={position}
                trigger='mouseenter click'
                arrow
              >
                <div className={`flex ${direction}`}>
                  <div className={`flex items-center mt-3 ml-3 mr-3 justify-center ${bg} rounded-xl h-12 w-12 shadow-md cursor-pointer`}>
                    <Icon className='text-white w-7 h-7' />
                  </div>
                </div>
              </Tooltip>
            </div>
          )
        })
      }
    </div>
  )
}

export default TypeIcon