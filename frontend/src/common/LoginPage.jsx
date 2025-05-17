// LoginPage.jsx
import { signInWithPopup } from 'firebase/auth';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { userDataContext } from '../store/UserContext';
import { HiOutlineMail } from "react-icons/hi";
import { MdLockOutline } from "react-icons/md";
import toast from 'react-hot-toast';


const LoginPage = (props) => { 
    const {setCurrentUser, setToken} = useContext(userDataContext)
    const navigate = useNavigate();
    const [User, setUser] = useState({
        email: "",
        password: ""
    })

    const handleInput = (e)=> {
        let name = e.target.name;
        let value = e.target.value;
    
        setUser({...User, [name]: value}) 
    }

    const handleSubmit = async(e)=> {
         e.preventDefault();
         console.log(User)
         
         const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(User)
          });
        
         const data = await response.json();

         if(response.ok) {
            setCurrentUser(data.user);
            setToken(data.token)

            console.log('login user data is ', data)
            props.setIsModalOpen(false)
            toast.success('login successful')
            navigate('/')
         } else {
            toast.error(data.message)
         } 
    }
  return (
        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center'>
            <div className='flex w-[90%] rounded border-1 focus-within:ring-1 focus-within:ring-blue-500 p-2 mb-2 items-center'>
              <HiOutlineMail className='text-gray-700 mr-2'/>
              <input
                type="email"
                name='email'
                placeholder="Email"
                className="outline-none w-[90%] bg-none" 
                value={User.email}
                onChange={handleInput}
              />
            </div>
            <div className='flex w-[90%] rounded border-1 focus-within:ring-1 focus-within:ring-blue-500 p-2 mb-2 items-center'>
              <MdLockOutline className='text-gray-700 mr-2'/>
              <input
                type="text"
                name='password'
                placeholder="Enter your password"
                className="outline-none w-[90%] bg-none" 
                value={User.password}
                onChange={handleInput}
              />
            </div>

            <button className="bg-green-600 text-white px-4 py-2 rounded w-[90%]  mb-2 mt-2 cursor-pointer">
              Login
            </button>

            <div
              onClick={() => setMode('signup')}
              className="mb-2 flex items-center justify-center"
            >
              Don't have an account? &nbsp; <span className='text-blue-700 cursor-pointer' onClick={() => props?.setMode('signup')}> Register </span>
            </div>
        </form>
  )
};

export default LoginPage;
