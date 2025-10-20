import React, { useContext, useEffect, useState } from 'react'
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { Link } from 'react-router-dom';
import { userDataContext } from '../store/UserContext'; 
import leetcodeIcon  from '../images/leetcodeIcon.png'
import gfgIcon  from '../images/gfgIcon.png'
import BotModal from './BotModal.jsx';
import { AiOutlineFileText } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa";

const platforms = {
  'leetcode': leetcodeIcon,
  'Leetcode': leetcodeIcon,
  'LeetCode': leetcodeIcon,
  'GeeksForGeeks': gfgIcon, 
  'GFG': gfgIcon, 
  'gfg': gfgIcon, 
}

const Topic = (props) => {
  const { currentUser, token, setUpdationOccur } = useContext(userDataContext);
  const [showProblems, setShowProblems] = useState(false);
  const [statusCount, setStatusCount] = useState(0);

  useEffect(()=> {
    if(props.topicRelatedProblems) {
      setStatusCount(0);
      props.topicRelatedProblems.forEach(p => {
        if(p.status) setStatusCount(prev => prev + 1);
      });
    }
  }, [props.topicRelatedProblems]);

  const updateProblem = async(userId, problemId, status, difficulty) => {
    const body = { user_id: userId, problem_id: problemId, status, difficulty };
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/problem/update`, {
      method: "POST",
      headers: {
        'Content-Type': 'Application/json',
        'Authorization': token
      },
      body: JSON.stringify(body)
    });
    await response.json();
    setUpdationOccur(prev => !prev);
  }

  const difficultyStyle = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500 text-white px-2 py-1 rounded-full font-semibold text-sm';
      case 'medium':
        return 'bg-yellow-500 text-black px-2 py-1 rounded-full font-semibold text-sm';
      case 'hard':
        return 'bg-red-600 text-white px-2 py-1 rounded-full font-semibold text-sm';
      default:
        return 'bg-gray-400 text-white px-2 py-1 rounded-full font-semibold text-sm';
    }
  }

  return (
    <>
      <div 
        onClick={() => setShowProblems(prev => !prev)} 
        className='relative w-[95%] bg-gray-800 hover:bg-gray-700 transition duration-300 rounded-t-xl text-lg font-semibold tracking-wide flex justify-between items-center pl-0 pr-0 pt-4 pb-4 sm:p-4 mx-auto cursor-pointer text-white'
      >
        <div className='flex items-center gap-2 text-[15px] sm:text-lg'>
          <div className='ml-[-7px] sm:ml-0'> {showProblems ? <IoIosArrowDown /> : <IoIosArrowForward />} </div>
          {props.topic}
        </div>

        {/* ✅ Progress bar + count in one line */}
        <div className='flex gap-4 items-center flex-shrink-0 whitespace-nowrap'>
          <div className='w-28 sm:w-32 h-2 bg-gray-600 rounded-full'>
            <div 
              className='h-2 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 transition-all duration-300'
              style={{ width: `${props.topicRelatedProblems ? ((statusCount / props.topicRelatedProblems.length) * 100) : 0}%` }}
            />
          </div>
          <p className='text-[12px] sm:text-sm whitespace-nowrap flex-shrink-0'>
            {statusCount} / {props.topicRelatedProblems ? props.topicRelatedProblems.length : 0}
          </p>
        </div>
      </div>

      {showProblems && (
        <div className="w-full overflow-x-auto">
          <table className='bg-gray-900 rounded-b-xl w-[95%] mx-auto mt-1 min-w-full'>
            {props.topicRelatedProblems && (
              <thead className='bg-gray-800 text-white'>
                <tr className='text-center'>
                  <th className='py-2 px-2 sm:px-0 border border-gray-700'>Status</th>
                  <th className='py-2 px-2 sm:px-0 border border-gray-700'>Problem Name</th>
                  <th className='py-2 px-2 sm:px-0 border border-gray-700'>Practice</th>
                  <th className='py-2 px-2 sm:px-0 border border-gray-700'>Resources</th>
                  <th className='py-2 px-2 sm:px-0 border border-gray-700'>Difficulty</th>
                  <th className='py-2 px-2 sm:px-0 border border-gray-700'>AI Assistance</th>
                </tr>
              </thead>
            )}

            <tbody>
              {props.topicRelatedProblems?.map(p => (
                <tr key={p.problem._id} className='text-center text-white border border-gray-700 hover:bg-gray-800 transition'>
 
                <td className='py-1 sm:py-2 border border-gray-700 flex justify-center'>
                  <div 
                    onClick={() => updateProblem(currentUser._id, p.problem._id, !p.status, p.problem.difficulty)}
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300
                      ${p.status ? 'bg-green-500 shadow-lg' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    {p.status && <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>}
                  </div>
                </td>

                <td className='py-1 sm:py-2 border border-gray-700 text-[11px] sm:text-lg'>
                  {p.problem.name}
                </td>

                <td className='py-1 sm:py-2 border border-gray-700'>
                  <Link to={p.problem.practiceLink} className='flex justify-center items-center hover:scale-110 transition-transform'>
                    <img className='h-5 w-5 sm:h-8 sm:w-8' src={platforms[p.problem.platform]} alt="Platform" />
                  </Link>
                </td>

                <td className='py-1 sm:py-2 border border-gray-700 flex justify-center gap-2 sm:gap-3 items-center'>
                  <Link to={p.problem.resourceLink} className='hover:scale-110 transition-transform'>
                    <AiOutlineFileText className='h-5 w-5 sm:h-6 sm:w-6 text-blue-400' />
                  </Link>

                  {p.problem.videoLink?.length > 0 && (
                    <Link to={p.problem.videoLink} className='hover:scale-110 transition-transform'>
                      <FaYoutube className='h-5 w-5 sm:h-6 sm:w-6 text-red-500' />
                    </Link>
                  )}
                </td>

                <td className='py-1 sm:py-2 border border-gray-700'>
                  <span className={`${difficultyStyle(p.problem.difficulty)} text-[10px] sm:text-sm px-2 py-0.5 sm:py-1`}>
                    {p.problem.difficulty}
                  </span>
                </td>

                <td className='py-2 border border-gray-700'> <BotModal url={p.problem.practiceLink}/> </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default Topic;
