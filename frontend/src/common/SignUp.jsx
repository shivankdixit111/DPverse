import React, { useContext, useState } from 'react'
import { HiOutlineMail } from "react-icons/hi";
import { MdLockOutline } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { userDataContext } from '../store/UserContext';
import toast from 'react-hot-toast';

const years = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034]


const SignUp = (props) => {
    const {setCurrentUser} = useContext(userDataContext)
    const [User, setUser] = useState({
          name: "",
          email: "",
          password: "",
          graduationYear: "",
    })

    const handleInput = (e)=> {
        let name = e.target.name;
        let value = e.target.value;
    
        setUser({...User, [name]: value}) 
    }

    const handleSubmit = async(e)=> {
          e.preventDefault();
          console.log(User)

          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/signup`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(User)
          });
        
         const data = await response.json();

         console.log(data)

         if(response.ok) {
            setCurrentUser(data);  
            props.setMode('login')
            toast.success("Registeration successful")
         } else {
            toast.error(data.message)
         } 
    }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center'>
        <div className='flex w-[90%] rounded border-1 focus-within:ring-1 focus-within:ring-blue-500 p-2 mb-2 items-center'>
            <FaRegUser className='text-gray-700 mr-2'/>
            <input
                type="name"
                name='name'
                placeholder="Fullname"
                className="outline-none w-[90%]" 
                value={User.name}
                onChange={handleInput}
            />
        </div>
        <div className='flex w-[90%] rounded border-1 focus-within:ring-1 focus-within:ring-blue-500 p-2 mb-2 items-center'>
            <HiOutlineMail className='text-gray-700 mr-2'/>
            <input
                type="email"
                name='email'
                placeholder="Email"
                className="outline-none w-[90%]" 
                value={User.email}
                onChange={handleInput}
            />
        </div>
        <div className='flex w-[90%] rounded border-1 focus-within:ring-1 focus-within:ring-blue-500 p-2 mb-2 items-center'>
            <MdLockOutline className='text-gray-700 mr-2'/>
            <input
                type="password"
                name='password'
                placeholder="Password"
                className="outline-none w-[90%]" 
                value={User.password}
                onChange={handleInput}
            />
        </div>

        <select name='graduationYear' className="border p-2 rounded w-[90%]  mb-2" onChange={handleInput}>
            <option className='text-gray-500' selected disabled>Choose your graduation graduationYear</option>
            {years.map((y, idx)=> (
            <option key={idx} value={y}>{y}</option>
            ))}
        </select>
        <button className="bg-green-600 text-white px-4 py-2 rounded w-[90%]  mb-2 mt-2 cursor-pointer">
            Signup
        </button>

        <div  className="mb-2 flex items-center justify-center">
            Already have an account? &nbsp; <span className='text-blue-700 cursor-pointer' onClick={() => props.setMode('login')}> Login </span>
        </div>
    </form>
  )
}

export default SignUp