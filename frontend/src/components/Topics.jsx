import React, { useContext, useEffect } from 'react';
import Topic from './Topic';
import { userDataContext } from '../store/UserContext';
import Loader from '../common/Loader';

const topics = ["DP on Index", "DP on Subsequences", "Bitmask DP", "Range DP", "Digit DP", "Game DP", "DP on Grids", "Re-rooting Tree DP", "DP on Trie", "DP Optimization (Binary Search & Heaps)", "Backtrack & Print"];

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

  let totalSolved = EasySolvedProblemCount + MediumSolvedProblemCount + HardSolvedProblemCount;
  let total = EasyProblemCount + MediumProblemCount + HardProblemCount;
  let percentage = Math.ceil((totalSolved / total) * 100);

  if (!isLoggedIn) setIsModalOpen(true);
  if (currentUser.length) setIsModalOpen(false);
  if (allProblems.length === 0) return <Loader />;

  const dpMap = new Map();
  allProblems.forEach(p => {
    if (!dpMap.get(p.problem?.form)) dpMap.set(p.problem?.form, []);
    dpMap.get(p.problem?.form).push(p);
  });

  return (
    <div className='flex flex-col min-h-screen bg-gray-900 text-gray-100 pt-6 md:pt-10'>

      {/* Progress Cards */}
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-[95%] sm:w-[90%] mx-auto mt-4 sm:mt-6'>
        
        {/* Total Progress */}
        <div className='flex justify-between items-center sm:justify-around h-28 sm:h-36 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 text-white shadow-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6'>
          <div>
            <h3 className='font-bold text-[5px] sm:text-lg'>Total Progress</h3>
            <h3 className='mt-1 sm:mt-2 text-xl sm:text-3xl font-extrabold'>{totalSolved}/{total}</h3>
          </div>
          <div className='h-16 w-16 sm:h-28 sm:w-28 rounded-full flex items-center justify-center relative'>
            <div className="absolute h-full w-full rounded-full border-4 border-gray-800" />
            <div
              className='absolute h-full w-full rounded-full'
              style={{
                background: `conic-gradient(#facc15 ${percentage * 3.6}deg, #4b5563 0deg)`,
                WebkitMask: 'radial-gradient(transparent 65%, black 60%)'
              }}
            />
            <div className='text-xs sm:text-xl font-bold'>{percentage}%</div>
          </div>
        </div>

        {/* Easy / Medium / Hard Cards */}
        {[
          { label: "Easy", count: EasySolvedProblemCount, total: EasyProblemCount, color: "from-green-400 to-green-500", bar: "bg-green-600" },
          { label: "Medium", count: MediumSolvedProblemCount, total: MediumProblemCount, color: "from-yellow-400 to-yellow-500", bar: "bg-yellow-600", textColor: "text-black" },
          { label: "Hard", count: HardSolvedProblemCount, total: HardProblemCount, color: "from-red-500 to-pink-500", bar: "bg-red-600" }
        ].map((item, idx) => (
          <div key={idx} className={`w-[95%] flex flex-col justify-center h-28 sm:h-36 items-start bg-gradient-to-r ${item.color} ${item.textColor || 'text-white'} shadow-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6`}>
            <h3 className='font-bold text-sm sm:text-base'>{item.label}</h3>
            <h3 className='mt-1 sm:mt-2 text-base sm:text-lg'>{item.count}/{item.total} Completed</h3>
            <div className='h-2 w-full rounded-full bg-gray-700 mt-1'>
              <div className={`h-2 rounded-full ${item.bar}`} style={{ width: `${(item.count / item.total) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Topics List */}
      <div className='flex flex-col gap-3 sm:gap-4 w-[95%] sm:w-[92%] p-2 sm:p-4 mt-6 sm:mt-10 mx-auto mb-6'>
        {topics.map((topic, idx) => (
          <div
            key={idx}
            className='bg-gray-800 rounded-xl sm:rounded-2xl hover:bg-gradient-to-r hover:from-purple-700 hover:to-indigo-600 hover:text-white shadow-md transition duration-300 p-3 sm:p-4'
          >
            <Topic topic={topic} topicRelatedProblems={dpMap.get(topic)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Topics;
