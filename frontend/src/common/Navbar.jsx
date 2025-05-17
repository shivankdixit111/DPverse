import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { userDataContext } from '../store/UserContext'; 
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

import LoginPage from './LoginPage';
import SignUp from './SignUp';
import toast, { Toaster } from 'react-hot-toast';


let navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'Topics', href: '/topics', current: false },
  { name: 'Leaderboard', href: '/leaderboard', current: false }, 
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


const Navbar = () => {  
  const navigate = useNavigate();
  const path = useLocation(); 
  const { setCurrentUser, currentUser, setToken, logOut, isLoggedIn, isModalOpen, setIsModalOpen } = useContext(userDataContext);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const [mode, setMode] = useState('login'); // login or signup 



  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50 w-[70%] md:w-[50%] mx-auto">
        <div className={`bg-white p-6 ${mode=='signup' ? 'h-[90%]' : 'h-[80%]'} rounded shadow-lg min-w-[450px] relative`}>
          {/* Top-right close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-4 text-gray-600 hover:text-black text-2xl font-bold cursor-pointer"
          >  
            &times;
          </button>
  
           <div className='flex flex-col items-center gap-3 mt-8 mb-10'>
              <h3 className='font-bold text-lg'>Welcome to DPverse</h3>
              <p className='text-sembold text-md text-gray-800'>Sign up to start your journey with us</p>
              <button onClick={ handleGoogleLogin } className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded shadow hover:bg-gray-100 transition cursor-pointer">
                  <span className="text-gray-700 font-medium">Login with Google</span>
                  <img className="h-6 w-6" src="https://t4.ftcdn.net/jpg/03/91/79/25/360_F_391792593_BYfEk8FhvfNvXC5ERCw166qRFb8mYWya.jpg" alt="Google logo" />
              </button>
           </div>
          
  
           <div className='flex items-center justify-center gap-6 mb-5'>
              <hr className='text-black w-[40%]'/>
              <p>Or</p>
              <hr className='w-[40%]'/>
           </div>
  
          {children}
        </div>
      </div>
    );
  };

  const handleGoogleLogin = async() => {
        const result = await signInWithPopup(auth, googleProvider);
        const tokenId = await result.user.getIdToken();
        setToken(tokenId);
    
        const body = {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName
        }
    
       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/google-login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': tokenId,
        },
        body: JSON.stringify(body)
        });
    
        const data = await response.json();

        if(response.ok) {
            setCurrentUser(data);
            setIsModalOpen(false)
            toast.success('login successful!')
            navigate('/')
        } else {
            alert('Internal server error')
        } 
   };

  useEffect(()=> {
     navigation.map((nav)=> nav.href===path.pathname ? nav.current = true : nav.current = false)
  }, [path.pathname])

  const controlNavbar = () => {
    if(window.scrollY > lastScrollY) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
    setLastScrollY(window.scrollY);
  }

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);
 

  const nameFirstLetter = currentUser?.name?.[0]?.toUpperCase() || "";

  return ( 
    <> 
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"> 
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href} 
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"> 

              {/* Profile dropdown */} 
              {  isLoggedIn ? 
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <div className='h-9 w-9 rounded-full text-black bg-white text-lg flex items-center justify-center cursor-pointer'>{nameFirstLetter}</div>
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <MenuItem>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      >
                        Your Profile
                      </Link>
                    </MenuItem> 
                    <MenuItem>
                      <Link
                        onClick={logOut}
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      >
                        Sign out
                      </Link>
                    </MenuItem>
                  </MenuItems>
                </Menu>
                :    <button onClick={() => setIsModalOpen(true)} className='bg-green-500 h-8 w-20 rounded cursor-pointer'>Login</button>
              }
              
            
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>


      <Modal
        isOpen={isModalOpen}
        onClose={() => { 
          setIsModalOpen(false); 
          setMode('login');
        }}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          {mode === 'login' ? 'Login' : 'Signup'}
        </h2>

        {mode === 'login' ? (
           <LoginPage setMode={setMode} setIsModalOpen={setIsModalOpen}/>
        ) : (
           <SignUp setMode={setMode} setIsModalOpen={setIsModalOpen}/>
        )}
      </Modal>
    </>

  )
}

export default Navbar;