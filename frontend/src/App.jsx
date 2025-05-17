import React from 'react'
import {BrowserRouter, Router, Route, Routes} from 'react-router-dom'
import Home from './components/Home'
import Topics from './components/topics'
import Leaderboard from './components/Leaderboard'
import WhyChoseUs from './components/WhyChoseUs'
import Navbar from './common/Navbar' 
import Profile from './components/Profile'
import NewProblem from './components/NewProblem'
import LoginPage from './common/loginPage'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
      <>
       <Toaster />
       <Navbar/>
       <Routes>
          <Route element={<Home/>} path='/'/>
          <Route element={<Topics/>} path='/topics'/>
          <Route element={<Leaderboard/>} path='/leaderboard'/> 
          <Route element={<WhyChoseUs/>} path='/whychooseus'/> 
          <Route element={<Profile/>} path='/profile'/> 
          <Route element={<NewProblem/>} path='/add'/> 
          <Route element={<LoginPage/>} path='/login'/> 
       </Routes>
      </>
  )
}

export default App