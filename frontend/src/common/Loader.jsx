import React from 'react'

const Loader = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
       <div className='h-10 w-10 rounded-full border-3  border-blue-500 border-t-transparent absolute  animate-spin'></div>
       <h3 className='mt-20'>Please wait...</h3>
    </div>
  )
}

export default Loader