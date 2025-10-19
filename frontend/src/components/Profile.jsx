import React, { useContext } from 'react';
import { userDataContext } from '../store/UserContext';
import { problemDataContext } from '../store/ProblemContext';

const Profile = () => {
  const { currentUser, logOut, totalSolvedProblemsCount } = useContext(userDataContext);
  const { currentUserRank } = useContext(problemDataContext);
  const nameFirstLetter = currentUser?.name?.[0]?.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-900 px-6 md:px-20 pt-24 text-white">
      {/* Header */}
      <div className='flex gap-4 items-center mb-12'>
        <div className='h-20 w-20 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold'>
          {nameFirstLetter}
        </div>
        <div>
          <h2 className='font-extrabold text-3xl'>{currentUser?.name}</h2>
          <h3 className='text-gray-300 text-md'>{currentUser?.email}</h3>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className='bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 p-6 text-center rounded-xl shadow-lg transform hover:scale-105 transition'>
          <h2 className='text-3xl font-bold mb-2'>{totalSolvedProblemsCount}</h2>
          <h3 className='text-gray-200'>Problems Solved</h3>
        </div>
        <div className='bg-gradient-to-r from-pink-600 via-red-500 to-yellow-500 p-6 text-center rounded-xl shadow-lg transform hover:scale-105 transition'>
          <h2 className='text-3xl font-bold mb-2'>{currentUserRank}</h2>
          <h3 className='text-gray-200'>Leaderboard Rank</h3>
        </div>
        <div className='bg-gradient-to-r from-green-500 via-teal-400 to-cyan-400 p-6 text-center rounded-xl shadow-lg transform hover:scale-105 transition'>
          <h2 className='text-3xl font-bold mb-2'>Beginner</h2>
          <h3 className='text-gray-200'>Level</h3>
        </div>
      </div>

      {/* Logout */}
      <button
        className='py-2 px-6 bg-red-600 hover:bg-red-500 text-white rounded shadow-lg transition'
        onClick={logOut}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
