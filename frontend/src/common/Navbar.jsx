import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { userDataContext } from '../store/UserContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Disclosure, Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { FcGoogle } from "react-icons/fc";

import LoginPage from './LoginPage';
import SignUp from './SignUp';
import toast from 'react-hot-toast';
import Loader from './Loader';

let navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'Topics', href: '/topics', current: false },
  { name: 'Leaderboard', href: '/leaderboard', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const navigate = useNavigate();
  const path = useLocation();
  const { setCurrentUser, currentUser, setToken, logOut, isLoggedIn, isModalOpen, setIsModalOpen, loading, setLoading } = useContext(userDataContext);
  const [mode, setMode] = useState('login'); 
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const tokenId = await result.user.getIdToken();
      setToken(tokenId);

      const body = { uid: result.user.uid, email: result.user.email, name: result.user.displayName };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/google-login`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Authorization': tokenId },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data);
        setIsModalOpen(false); 
        
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error('Internal server error');
      }
    } catch (err) {
      console.error(err);
      toast.error('Login failed!');
    }
  };

  useEffect(() => {
    navigation.forEach(nav => nav.href === path.pathname ? nav.current = true : nav.current = false);
  }, [path.pathname]);
 

  const nameFirstLetter = currentUser?.name?.[0]?.toUpperCase() || "";

  // Glassy modal
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
        <div className={`bg-gray-900/70 backdrop-blur-xl p-6 ${mode === 'signup' ? 'h-[90%]' : 'h-[80%]'} 
          rounded-3xl shadow-2xl min-w-[90%] md:min-w-[450px] relative border border-purple-500 text-white overflow-y-auto`}
        >
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-3 right-4 text-gray-300 hover:text-yellow-400 text-2xl font-bold cursor-pointer"
          >
            &times;
          </button>

          <div className="text-center text-white">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Disclosure as="nav" className="bg-gray-900/90 backdrop-blur-md shadow-md sticky top-0 z-50">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                {/* Mobile menu button */}
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white hover:bg-gradient-to-r from-purple-600 to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white">
                    {open ? <XMarkIcon className="block h-6 w-6" /> : <Bars3Icon className="block h-6 w-6" />}
                  </Disclosure.Button>
                </div>

                {/* Desktop Menu */}
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="hidden sm:flex sm:space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white'
                            : 'text-gray-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-500 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium transition duration-300'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* User/Login */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {isLoggedIn ? (
                  <>
                    <div className="text-white font-semibold bg-gradient-to-r from-purple-700 to-indigo-600 px-4 py-1 rounded-full">
                      Tokens: {currentUser.creditBalance} 💰
                   </div>

                    <Menu as="div" className="relative ml-3">
                      <Menu.Button className="flex rounded-full bg-gradient-to-r from-purple-700 to-indigo-600 text-white h-10 w-10 items-center justify-center font-bold">{nameFirstLetter}</Menu.Button>
                      <Menu.Items className="absolute right-0 mt-2 w-48 rounded-2xl bg-gray-800/90 backdrop-blur-md shadow-xl border border-purple-400 py-0.5 overflow-hidden">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={`block px-4 py-2 text-sm text-white ${active && 'bg-gradient-to-r from-purple-600 to-indigo-500'}`}
                            >
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logOut}
                              className={`w-full text-left block px-4 py-2 text-sm text-white ${active && 'bg-gradient-to-r from-purple-600 to-indigo-500'}`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                         <Menu.Item>
                          {({ active }) => (
                            <Link 
                              to={'/token-plans'}
                              className={`w-full text-left block px-4 py-2 text-sm text-white ${active && 'bg-gradient-to-r from-purple-600 to-indigo-500'}`}
                            >
                              Pricing
                            </Link>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </>) : (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-pink-500 hover:to-red-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg transition transform duration-300 cursor-pointer"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Menu Panel */}
            <Disclosure.Panel className="sm:hidden bg-gray-900/95 backdrop-blur-md p-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white'
                      : 'text-gray-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-500 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium transition'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setMode('login'); }}
      >
        <h2 className="text-xl font-bold mb-4 text-center">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        {mode === 'login' ? (
          <LoginPage setMode={setMode} setIsModalOpen={setIsModalOpen} />
        ) : (
          <SignUp setMode={setMode} setIsModalOpen={setIsModalOpen} />
        )}
        <div className="flex justify-center mt-4 gap-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:bg-gray-100 transition cursor-pointer"
          >
            <FcGoogle className="text-xl" />
            <span className="font-medium text-gray-800">Sign in with Google</span>
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
