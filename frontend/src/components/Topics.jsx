import React, { useContext, useEffect } from 'react'
import Topic from './Topic'
import { userDataContext } from '../store/UserContext' 
import Loader from '../common/Loader'

const topics = ["DP on Index", "DP on Subsequences", "Bitmask DP", "Range DP", "Digit DP", "DP on Grids", "DP on Tree/Graph", "DP on Trie", "Backtrack & Print"]

const Topics = () => {
    const {allProblems, EasyProblemCount, MediumProblemCount, HardProblemCount, EasySolvedProblemCount, 
      MediumSolvedProblemCount, HardSolvedProblemCount , isModalOpen, setIsModalOpen, isLoggedIn, currentUser} = useContext(userDataContext)
    let totalSolvedProblems = EasySolvedProblemCount + MediumSolvedProblemCount + HardSolvedProblemCount;
    let totalProblems = EasyProblemCount + MediumProblemCount + HardProblemCount;
    let percentage = Math.ceil((totalSolvedProblems / totalProblems) * 100)

    if(!isLoggedIn) {
       setIsModalOpen(true); 
    }

    if(currentUser.length) setIsModalOpen(false)
 
    if(allProblems.length == 0) {
      return <Loader/>
    }
    
    const dpMap = new Map();
 
        allProblems.map((p)=> {
            if(!dpMap.get(p.problem?.form)) {
              dpMap.set(p.problem?.form, [])
            }
            dpMap.get(p.problem?.form).push(p)
        }) 
 

    console.log('all problem in topics ', dpMap) 
  return (
    <>
     <div className='flex flex-col min-h-screen bg-yellow-100 pt-15'>
        <div className='grid md:grid-cols-4 grid-cols-1 gap-3  w-[90%] mx-auto mt-6'>
            <div className='flex justify-around h-30 bg-black text-yellow-300 shadow-md rounded-2xl hover:scale-105 hover:shadow-lg transition duration-300 p-4'>
                <div className='my-auto'>
                  <h3 className='font-bold'>Total Progress</h3>
                  <h3 className='mt-1 mb-2'><span className='font-extrabold text-2xl text-white'>{totalSolvedProblems}/{totalProblems}</span></h3>
                </div> 
                <div className='h-22 w-22 rounded-full flex items-center justify-center relative my-auto'>
                     <div className="absolute h-full w-full rounded-full border-4 border-black"> </div>
                         <div className='absolute h-full w-full rounded-full' 
                           style={{ 
                            background: `conic-gradient(#facc15 ${percentage * 3.6}deg, transparent 0deg)`,
                            WebkitMask: 'radial-gradient(transparent 63%, black 56%)' 
                          }}
                         >
                         </div>
                         <div className='text-lg font-medium'>{percentage}%</div>
                     
                </div>
            </div>
            <div className='flex flex-col justify-center h-30 items-start bg-yellow-300 text-black shadow-md rounded-2xl hover:scale-105 hover:shadow-lg transition duration-300 p-4'>
               <h3 className='font-bold'>Easy</h3>
               <h3 className='mt-1 mb-2 text-gray-500'><span className='font-extrabold text-2xl text-black'>{EasySolvedProblemCount}/{EasyProblemCount}</span> Completed</h3>
               <div className='h-2 w-full mx-auto rounded bg-white'>
                  <div className='h-2 bg-green-500 rounded' style={{width: `${(EasySolvedProblemCount/ EasyProblemCount) * 100}%`}}></div>
               </div>
            </div>
            <div className='flex flex-col justify-center h-30 items-start bg-yellow-300 text-black shadow-md rounded-2xl hover:scale-105 hover:shadow-lg transition duration-300 p-4'>
               <h3 className='font-bold'>Medium</h3>
               <h3 className='mt-1 mb-2 text-gray-500'><span className='font-extrabold text-2xl text-black'>{MediumSolvedProblemCount}/{MediumProblemCount}</span> Completed</h3>
               <div className='h-2 w-full mx-auto rounded bg-white'>
                  <div className='h-2 bg-yellow-500 rounded' style={{width: `${(MediumSolvedProblemCount/ MediumProblemCount) * 100}%`}}></div>
               </div>
            </div>
            <div className='flex flex-col justify-center h-30 items-start bg-yellow-300 text-black shadow-md rounded-2xl hover:scale-105 hover:shadow-lg transition duration-300 p-4'>
               <h3 className='font-bold'>Hard</h3>
               <h3 className='mt-1 mb-2 text-gray-500'><span className='font-extrabold text-2xl text-black'>{HardSolvedProblemCount}/{HardProblemCount}</span> Completed</h3>
               <div className='h-2 w-full mx-auto rounded bg-white'>
                  <div className='h-2 bg-red-600 rounded' style={{width: `${(HardSolvedProblemCount/ HardProblemCount) * 100}%`}}></div>
               </div>
            </div>
        </div>
        <div className='flex flex-col gap-4 w-[92.5%] p-4  mt-8 mx-auto'> 
              {topics.map((topic, idx)=> (
                  <div key={idx} className='bg-black rounded-xl hover:bg-yellow-400 hover:text-black transition duration-300 p-4'>
                      <Topic topic={topic} topicRelatedProblems = {dpMap.get(topic)}/> 
                  </div>
              ))}
        </div>
     </div>
    </>
  )
}

export default Topics