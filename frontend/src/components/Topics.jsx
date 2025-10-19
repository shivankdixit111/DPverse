import React, { useContext, useEffect } from 'react';
import Topic from './Topic';
import { userDataContext } from '../store/UserContext';
import Loader from '../common/Loader';

const topics = ["DP on Index", "DP on Subsequences", "Bitmask DP", "Range DP", "Digit DP", "DP on Grids", "DP on Tree/Graph", "DP on Trie", "Backtrack & Print"];

const Topics = () => {
  const {
    allProblems,
    EasyProblemCount,
    MediumProblemCount,
    HardProblemCount,
    EasySolvedProblemCount,
    MediumSolvedProblemCount,
    HardSolvedProblemCount,
    isModalOpen,
    setIsModalOpen,
    isLoggedIn,
    currentUser
  } = useContext(userDataContext);

  let totalSolvedProblems = EasySolvedProblemCount + MediumSolvedProblemCount + HardSolvedProblemCount;
  let totalProblems = EasyProblemCount + MediumProblemCount + HardProblemCount;
  let percentage = Math.ceil((totalSolvedProblems / totalProblems) * 100);

  if(!isLoggedIn) setIsModalOpen(true);
  if(currentUser.length) setIsModalOpen(false);

  if(allProblems.length === 0) return <Loader />;

  const dpMap = new Map();
  allProblems.forEach((p) => {
    if(!dpMap.get(p.problem?.form)) dpMap.set(p.problem?.form, []);
    dpMap.get(p.problem?.form).push(p);
  });

  return (
    <div className='flex flex-col min-h-screen bg-gray-900 text-gray-100 pt-10'>
      {/* Progress Cards */}
      <div className='grid md:grid-cols-4 grid-cols-1 gap-6 w-[90%] mx-auto mt-6'>
        {/* Total Progress */}
        <div className='flex justify-around h-36 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 text-white shadow-lg rounded-3xl hover:scale-105 transition duration-300 p-6'>
          <div className='my-auto'>
            <h3 className='font-bold text-lg'>Total Progress</h3>
            <h3 className='mt-2 mb-2 text-3xl font-extrabold'>{totalSolvedProblems}/{totalProblems}</h3>
          </div>
          <div className='h-28 w-28 rounded-full flex items-center justify-center relative my-auto'>
            <div className="absolute h-full w-full rounded-full border-4 border-gray-800" />
            <div
              className='absolute h-full w-full rounded-full'
              style={{
                background: `conic-gradient(#facc15 ${percentage * 3.6}deg, #4b5563 0deg)`,
                WebkitMask: 'radial-gradient(transparent 65%, black 60%)'
              }}
            />
            <div className='text-xl font-bold'>{percentage}%</div>
          </div>
        </div>

        {/* Easy */}
        <div className='flex flex-col justify-center h-36 items-start bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg rounded-3xl hover:scale-105 transition duration-300 p-6'>
          <h3 className='font-bold'>Easy</h3>
          <h3 className='mt-2 mb-2 text-lg'>{EasySolvedProblemCount}/{EasyProblemCount} Completed</h3>
          <div className='h-2 w-full rounded-full bg-gray-700'>
            <div className='h-2 rounded-full bg-green-600' style={{ width: `${(EasySolvedProblemCount / EasyProblemCount) * 100}%` }}></div>
          </div>
        </div>

        {/* Medium */}
        <div className='flex flex-col justify-center h-36 items-start bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg rounded-3xl hover:scale-105 transition duration-300 p-6'>
          <h3 className='font-bold'>Medium</h3>
          <h3 className='mt-2 mb-2 text-lg'>{MediumSolvedProblemCount}/{MediumProblemCount} Completed</h3>
          <div className='h-2 w-full rounded-full bg-gray-700'>
            <div className='h-2 rounded-full bg-yellow-600' style={{ width: `${(MediumSolvedProblemCount / MediumProblemCount) * 100}%` }}></div>
          </div>
        </div>

        {/* Hard */}
        <div className='flex flex-col justify-center h-36 items-start bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg rounded-3xl hover:scale-105 transition duration-300 p-6'>
          <h3 className='font-bold'>Hard</h3>
          <h3 className='mt-2 mb-2 text-lg'>{HardSolvedProblemCount}/{HardProblemCount} Completed</h3>
          <div className='h-2 w-full rounded-full bg-gray-700'>
            <div className='h-2 rounded-full bg-red-600' style={{ width: `${(HardSolvedProblemCount / HardProblemCount) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className='flex flex-col gap-4 w-[92%] p-4 mt-10 mx-auto'>
        {topics.map((topic, idx) => (
          <div
            key={idx}
            className='bg-gray-800 rounded-2xl hover:bg-gradient-to-r hover:from-purple-700 hover:to-indigo-600 hover:text-white shadow-md transition duration-300 p-4'
          >
            <Topic topic={topic} topicRelatedProblems={dpMap.get(topic)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Topics;
