import React, { useContext } from 'react';
import { userDataContext } from '../store/UserContext';
import { problemDataContext } from '../store/ProblemContext';

const Profile = () => {
  const { currentUser, logOut, totalSolvedProblemsCount } = useContext(userDataContext);
  const { currentUserRank } = useContext(problemDataContext);
  const nameFirstLetter = currentUser?.name?.[0]?.toUpperCase();

  return (
    <div className="mt-24 px-10">
       {/* Header section  */}
       <div className='flex gap-4 items-center mb-10'>
          <div className='h-16 w-16 bg-red-400 rounded-full text-black text-2xl flex items-center justify-center'>
             {nameFirstLetter}
          </div>
          <div>
              <h2 className='font-bold text-2xl'>{currentUser?.name}</h2>
              <h2 className='text-gray-700'>{currentUser?.email}</h2>
          </div>
       </div>

       {/* stats section  */}
       <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            <div className='bg-yellow-100 p-6 text-center hover:scale-105 rounded-xl shadow-md'>
                <h2 className='text-3xl font-bold mb-2'>{totalSolvedProblemsCount}</h2>
                <h2 className='text-gray-700'>Problems Solved </h2>
            </div>
            <div className='bg-yellow-100 p-6 text-center hover:scale-105 rounded-xl shadow-md'>
                <h2 className='text-3xl font-bold mb-2'>{currentUserRank}</h2>
                <h2 className='text-gray-700'>Leaderboard Rank</h2>
            </div>
            <div className='bg-yellow-100 p-6 text-center hover:scale-105 rounded-xl shadow-md'>
                <h2 className='text-3xl font-bold mb-2'>Beginner</h2>
                <h2 className='text-gray-700'>Level</h2>
            </div>
       </div>
 


      {/* Logout */}
      <button
        className='py-2 px-6 bg-red-600 hover:bg-red-500 text-white rounded'
        onClick={logOut}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
