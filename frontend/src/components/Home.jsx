import React, { useContext, useState } from 'react'  
import { Link } from 'react-router-dom';

const Home = () => {
  

  return (
    <div className="h-screen bg-black"> 

      <section className='text-center bg-yellow-400 pt-26 pb-10'>
          <h1 className='text-5xl font-bold'>Welcome to <span className='text-black underline'>DPverse</span> 🚀</h1>
          <p className='text-xl mt-4'>Master Dynamic Programming with tracking, challenges, and leaderboards!</p>
          <a className='mt-6 inline-block py-3 px-6 bg-black text-yellow-400 rounded-lg hover:bg-gray-900 transition font-bold' href='#why-us'>Explore Features</a>
      </section>

      <section id='why-us' className='bg-black text-yellow-400 py-20'>
        <div className='w-[80%] mx-auto'>
            <h2 className='font-bold text-3xl text-center'>Why Choose DPverse?</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-10'>
                <Link to={'/topics'}>
                  <div className='bg-yellow-400 p-6 rounded-lg border-2 border-black text-black  hover:scale-105 transition duration-300'>
                      <h3 className='text-xl font-semibold mb-3'>🔥 Solve Curated Problems</h3>
                      <p>Handpicked DP questions categorized by difficulty and type.</p>
                  </div>
                </Link>
                <Link to={'/leaderboard'}>
                  <div className='bg-yellow-400 p-6 rounded-lg border-2 border-black text-black  hover:scale-105 transition duration-300'>
                      <h3 className='text-xl font-semibold mb-3'> 🏆 Compete on Leaderboard </h3>
                      <p> See where you stand among all users by climbing ranks! </p>
                  </div>
                </Link>
                <Link to={'/topics'}>
                  <div className='bg-yellow-400 p-6 rounded-lg border-2 border-black text-black  hover:scale-105 transition duration-300'>
                      <h3 className='text-xl font-semibold mb-3'> 🚀 Track Your Progress </h3>
                      <p> Visualize your solving journey with detailed statistics. </p>
                  </div>
                </Link>
            </div>
        </div>
      </section>
  

      <footer className='bg-black text-yellow-400 py-8 border-yellow-500 border-t-2'>
          <p className='font-medium text-center'>Made with ❤️ by Shivank | DPverse © 2025</p>
      </footer>
    </div>
  )
}
 
export default Home;