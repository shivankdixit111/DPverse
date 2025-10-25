import React from 'react'
import {BrowserRouter, Router, Route, Routes} from 'react-router-dom'
import Home from './components/Home'
import Topics from './components/Topics'
import Leaderboard from './components/Leaderboard'
import WhyChoseUs from './components/WhyChoseUs'
import Navbar from './common/Navbar' 
import Profile from './components/Profile'
import NewProblem from './components/NewProblem'
import LoginPage from './common/LoginPage'
import { Toaster } from 'react-hot-toast'
import Payment from './components/Payment'
import TokenPlan from './components/TokenPlan'

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
          <Route element={<Payment/>} path='/payment'/> 
          <Route element={<TokenPlan/>} path='/token-plans'/> 
       </Routes>
      </>
  )
}

export default App