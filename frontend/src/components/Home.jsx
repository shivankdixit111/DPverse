import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">

      {/* Hero Section */}
      <section className='relative text-center py-32 px-4 overflow-hidden'>
        <div className='absolute -top-20 -left-20 w-72 h-72 bg-purple-700 rounded-full opacity-50 animate-pulse'></div>
        <div className='absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-600 rounded-full opacity-50 animate-pulse delay-500'></div>
        <h1 className='text-5xl md:text-6xl font-extrabold mb-4 relative z-10'>
          Welcome to <span className='underline decoration-yellow-400'>DPverse</span> 🚀
        </h1>
        <p className='text-lg md:text-2xl mt-4 max-w-2xl mx-auto relative z-10'>Master Dynamic Programming with tracking, challenges, and leaderboards!</p>
        <a
          className='mt-8 inline-block py-3 px-8 bg-yellow-400 text-gray-900 rounded-full font-semibold shadow-xl hover:scale-105 hover:shadow-2xl transition transform duration-300 relative z-10'
          href='#features'
        >
          Explore Features
        </a>
      </section>

      {/* Features Section */}
      <section id='features' className='py-24 relative'>
        <div className='w-[90%] md:w-[85%] mx-auto'>
          <h2 className='font-bold text-3xl md:text-4xl text-center mb-16 relative z-10'>Why Choose DPverse?</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10'>
            
            {/* Card 1 */}
            <Link to={'/topics'}>
              <div className='bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-xl hover:scale-105 hover:shadow-2xl transition transform duration-300 border border-purple-400 flex flex-col justify-between h-full group'>
                <h3 className='text-2xl font-semibold mb-4 group-hover:text-yellow-400 transition duration-300'>🔥 Solve Curated Problems</h3>
                <p className='flex-grow'>Handpicked DP questions categorized by difficulty and type, helping you level up efficiently.</p>
                <div className='mt-4 text-purple-400 group-hover:text-yellow-400 transition duration-300 text-3xl'>➤</div>
              </div>
            </Link>

            {/* Card 2 */}
            <Link to={'/leaderboard'}>
              <div className='bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-xl hover:scale-105 hover:shadow-2xl transition transform duration-300 border border-blue-400 flex flex-col justify-between h-full group'>
                <h3 className='text-2xl font-semibold mb-4 group-hover:text-yellow-400 transition duration-300'>🏆 Compete on Leaderboard</h3>
                <p className='flex-grow'>Track your rank and see how you perform against other users globally.</p>
                <div className='mt-4 text-blue-400 group-hover:text-yellow-400 transition duration-300 text-3xl'>➤</div>
              </div>
            </Link>

            {/* Card 3 */}
            <Link to={'/'}>
              <div className='bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-xl hover:scale-105 hover:shadow-2xl transition transform duration-300 border border-pink-400 flex flex-col justify-between h-full group'>
                <h3 className='text-2xl font-semibold mb-4 group-hover:text-yellow-400 transition duration-300'>🤖 AI Assistance</h3>
                <p className='flex-grow'>Get instant hints, solutions, and explanations for any DP problem at your fingertips.</p>
                <div className='mt-4 text-pink-400 group-hover:text-yellow-400 transition duration-300 text-3xl'>➤</div>
              </div>
            </Link>

          </div>
        </div>
        {/* Floating Gradient Circles */}
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 opacity-20 blur-3xl animate-pulse'></div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-800 text-gray-200 py-8 mt-auto border-t border-gray-700 relative z-10'>
        <p className='font-medium text-center'>Made with ❤️ by Shivank | DPverse © 2025</p>
      </footer>

    </div>
  )
}

export default Home;
