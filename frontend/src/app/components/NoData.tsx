import Image from 'next/image'
import React from 'react'

interface NoDataProps {
    message:string,
    imageUrl:string,
    description:string,
    onClick?: () => void,
    buttonText:string
}

export default function NoData({ message,
    imageUrl,
    description,
    onClick,
    buttonText="try again"}:NoDataProps) {
  return (
    <div className='flex flex-col items-center justify-center p-6 bg-white overflow-x-hidden space-y-6 mx-auto'>

        <div className='relative w-60 md:w-80'>
           <Image
           src={imageUrl}
           alt='no_data'
           width={320}
           height={320}
           className='shadow-md hover:shadow-lg transition duration-300' 
           />
        </div>
        <div className='text-center max-w-md space-y-2'>
            <p className='text-2xl tracking-wide text-gray-900'>{message}</p>
            <p className='text-base leading-relaxed text-gray-600'>{description}</p>
        </div>      

        {
            onClick && (
                <button onClick={onClick} className='px-6 w-60 py-3 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform-transition duration-300 ease-in-out'>{buttonText}</button>
            )
        }
    </div>
  )
}
