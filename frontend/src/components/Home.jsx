import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">

      {/* Hero Section */}
      <section className='relative text-center py-32 px-4 overflow-hidden'>
        <div className='absolute -top-20 -left-20 w-72 h-72 bg-purple-700 rounded-full opacity-50 animate-pulse'></div>
        <div className='absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-600 rounded-full opacity-50 animate-pulse delay-500'></div>

        <h1 className='text-5xl md:text-6xl font-extrabold mb-6 relative z-10 leading-tight'>
          ⚡ Master <span className='text-orange-400'>Advanced DSA Patterns</span> ⚡
        </h1>

        <p className='text-base md:text-lg text-gray-400 max-w-2xl mx-auto relative z-10 leading-relaxed'>
          ⚡ Build strong problem-solving skills with a structured, pattern-based approach to DSA — covering Graphs, Trees, Dynamic Programming, Strings, and advanced data structures like Segment Trees and Binary Lifting — designed to help you excel in interviews and competitive programming 🚀
        </p>

        <div className='mt-10 relative z-10'>
          <Link
            to="/topics"
            className='py-3 px-8 bg-yellow-400 text-gray-900 rounded-full font-semibold shadow-xl hover:scale-105 hover:shadow-2xl transition'
          >
            Start Practicing
          </Link>
        </div> 
      </section>

      {/* Features Section */}
      <section id='features' className='py-24 relative'>
        <div className='w-[90%] md:w-[85%] mx-auto'>

          <h2 className='font-bold text-3xl md:text-4xl text-center mb-16 relative z-10'>
            Why DSAPatternLab?
          </h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10'>

            {/* Card 1 */}
            <Link to={'/topics'}>
              <div className='bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-xl hover:scale-105 transition transform duration-300 border border-purple-400 flex flex-col h-full group'>
                <h3 className='text-2xl font-semibold mb-4 group-hover:text-orange-400'>
                  🧠 Master DSA Patterns
                </h3>

                <p className='flex-grow text-gray-300'>
                  Learn through a pattern-based approach with focused problem sets to build strong problem-solving skills and think efficiently in contests and interviews.
                </p>
              </div>
            </Link>

            {/* Card 2 */}
            <Link to={'/topics'}>
              <div className='bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-xl hover:scale-105 transition transform duration-300 border border-blue-400 flex flex-col h-full group'>
                <h3 className='text-2xl font-semibold mb-4 group-hover:text-orange-400'>
                  📊 Topic-wise Learning
                </h3>

                <p className='flex-grow text-gray-300'>
                  Explore DSA topics in a structured way — Graphs (DFS, BFS, Dijkstra, DSU), Trees (Binary Lifting, Rerooting, LCA), DP patterns, Strings, and more.
                </p>
              </div>
            </Link>

            {/* Card 3 */}
            <Link to={'/ai'}>
              <div className='bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-xl hover:scale-105 transition transform duration-300 border border-pink-400 flex flex-col h-full group'>
                <h3 className='text-2xl font-semibold mb-4 group-hover:text-yellow-400'>
                  🤖 AI Doubt Solver
                </h3>
                <p className='flex-grow'>
                  Get instant hints, explanations, and optimized solutions for complex problems using AI-powered assistance.
                </p>
              </div>
            </Link>

            {/* Card 4 */}
            <Link to={'/leaderboard'}>
              <div className='bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-xl hover:scale-105 transition transform duration-300 border border-green-400 flex flex-col h-full group'>
                <h3 className='text-2xl font-semibold mb-4 group-hover:text-yellow-400'>
                  🏆 Competitive Leaderboard
                </h3>
                <p className='flex-grow'>
                  Compete globally, track your rank, and push yourself to achieve top rankings in coding contests and interviews.
                </p>
              </div>
            </Link>

            {/* Card 5 */}
            <Link to={'/progress'}>
              <div className='bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-xl hover:scale-105 transition transform duration-300 border border-yellow-400 flex flex-col h-full group'>
                <h3 className='text-2xl font-semibold mb-4 group-hover:text-yellow-400'>
                  📈 Progress Tracking
                </h3>
                <p className='flex-grow'>
                  Track your solved problems, identify weak topics, and monitor your growth towards mastering DSA.
                </p>
              </div>
            </Link>

            {/* Card 6 */}
            <Link to={'/premium'}>
              <div className='bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-xl hover:scale-105 transition transform duration-300 border border-red-400 flex flex-col h-full group'>
                <h3 className='text-2xl font-semibold mb-4 group-hover:text-yellow-400'>
                  💎 Premium Access
                </h3>
                <p className='flex-grow'>
                  Unlock advanced problem sets, AI guidance, and exclusive content to accelerate your journey.
                </p>
              </div>
            </Link>

          </div>
        </div>

        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 opacity-20 blur-3xl animate-pulse'></div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-800 text-gray-200 py-8 mt-auto border-t border-gray-700 relative z-10'>
        <p className='font-medium text-center'>
          Made with ❤️ by Shivank | DSAPatternLab © 2026
        </p>
      </footer>

    </div>
  )
}

export default Home;