import React, { useContext, useState } from 'react';
import { GiAchievement } from "react-icons/gi";
import { FaChevronRight, FaRegCircleUser } from "react-icons/fa6";
import { SiThunderstore } from "react-icons/si";
import { FaAngleLeft } from "react-icons/fa6";
import { problemDataContext } from '../store/ProblemContext'; 

const Leaderboard = () => {
  const { leaderBoardData } = useContext(problemDataContext);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const totalPages = Math.ceil(leaderBoardData.length / usersPerPage);
  const indexOfLastUser = usersPerPage * currentPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = leaderBoardData.slice(indexOfFirstUser, indexOfLastUser);

  const getButtonDisplayed = () => {
    let buttons = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
      return buttons;
    }
    if (currentPage <= 3) {
      for (let i = 1; i <= 3; i++) buttons.push(i);
      buttons.push("...");
      buttons.push(totalPages);
      return buttons;
    }
    if (currentPage > totalPages - 3) {
      buttons.push(1);
      buttons.push("...");
      for (let i = totalPages - 2; i <= totalPages; i++) buttons.push(i);
      return buttons;
    }
    buttons.push(1);
    buttons.push("...");
    for (let i = currentPage; i <= currentPage + 2; i++) buttons.push(i);
    buttons.push("...");
    buttons.push(totalPages);
    return buttons;
  }

  return (
    <div className='min-h-screen bg-gray-900 p-4 pt-20'>
      <h1 className='text-3xl md:text-4xl font-extrabold text-center text-white mb-8'>
        🏆 Leaderboard
      </h1>

      <div className='w-[95%] md:w-[80%] mx-auto bg-gray-800 rounded-2xl shadow-xl overflow-hidden'>
        <div className='grid grid-cols-3 gap-0 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 text-white text-lg font-semibold text-center py-3'>
          <div className='flex justify-center items-center gap-2'><GiAchievement /> Rank</div>
          <div className='flex justify-center items-center gap-2'><FaRegCircleUser /> Username</div>
          <div className='flex justify-center items-center gap-2'><SiThunderstore /> Problems Solved</div>
        </div>

        <div>
          {currentUsers.map((user, idx) => (
            <div 
              key={idx} 
              className={`grid grid-cols-3 text-center py-4 md:py-5 px-4 md:px-6 text-white transition-all rounded-lg mx-2 my-2 
                ${idx % 2 === 0 ? 'bg-gray-700/80' : 'bg-gray-700/60'} 
                hover:bg-gradient-to-r hover:from-purple-600 hover:via-indigo-500 hover:to-blue-500 hover:scale-105 shadow-md cursor-pointer`}
            >
              <div className='font-semibold flex justify-center items-center'>{user.rank}</div>
              <div className='flex justify-center items-center'>{user.name}</div>
              <div className='flex justify-center items-center'>{user.problemsSolvedCount}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-center gap-2 mt-8'>
        <button 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 text-white flex items-center justify-center hover:scale-105 disabled:opacity-50 transition'
        >
          <FaAngleLeft />
        </button>

        {getButtonDisplayed().map((btn, idx) => (
          btn === "..." ? (
            <span key={idx} className='text-white font-bold px-2'>...</span>
          ) : (
            <button
              key={idx}
              onClick={() => setCurrentPage(btn)}
              className={`h-10 w-10 rounded-full flex items-center justify-center transition 
                ${currentPage === btn 
                  ? 'bg-black border-2 border-purple-400 text-purple-400' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'}`
              }
            >
              {btn}
            </button>
          )
        ))}

        <button 
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 text-white flex items-center justify-center hover:scale-105 disabled:opacity-50 transition'
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  )
}

export default Leaderboard;
