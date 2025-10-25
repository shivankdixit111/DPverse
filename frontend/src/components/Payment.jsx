import React, { useContext } from 'react'
import { userDataContext } from '../store/UserContext'

const Payment = () => {

  const handlePayment = async()=> {
    try {
        
    } catch(error) {
        console.log('error is ', error)
    }
  }

  return ( 
    <div className='h-screen flex justify-center items-center'>
        <button className='px-2 py-4 bg-blue-300' onClick={handlePayment}> Make Payment Rupee 10 </button>
    </div>
  )
}

export default Payment