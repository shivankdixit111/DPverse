import React, { useContext, useEffect, useState } from 'react'
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { Link } from 'react-router-dom';
import { userDataContext } from '../store/UserContext'; 
import leetcodeIcon  from '../images/leetcodeIcon.png'
import gfgIcon  from '../images/gfgIcon.png'
import ytIcon  from '../images/ytIcon.png'
import documentIcon  from '../images/documentIcon.png'

const platforms = {
      'Leetcode': leetcodeIcon,
      'GeeksForGeeks': gfgIcon, 
}

const Topic = (props) => {
  const {currentUser, token,  setUpdationOccur} = useContext(userDataContext);
  const [showProblems, setShowProblems] = useState(false) 
  const [statusCount, setStatusCount] = useState(0);

  
  useEffect(()=> {
    if(props.topicRelatedProblems) {
        setStatusCount(0);
        for(let p of props.topicRelatedProblems) {
            if(p.status===true) setStatusCount((prev)=> prev+1);
        }
    }
  }, [props.topicRelatedProblems])

  const updateProblem = async(userId, problemId, status, difficulty)=> {
    console.log(userId, problemId, status)
    const body = {
       user_id: userId,
       problem_id: problemId,
       status: status,
       difficulty: difficulty,
    }
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/problem/update`, {
        method: "POST",
        headers: {
          'Content-Type': 'Application/json',
          'Authorization': token
        },
        body: JSON.stringify(body)
    })
     const data = await response.json();

     setUpdationOccur((prev)=> !prev);
  }
 

  return (
    <> 
        <div  onClick={()=> setShowProblems((prev)=> !prev)} className='relative w-[95%] bg-yellow-300 hover:bg-yellow-400 transition duration-300 rounded-tl rounded-tr text-lg font-semibold tracking-wide flex justify-between items-center p-4 mx-auto cursor-pointer'>
            <div className='flex items-center gap-2'>
                <p>{showProblems ? <IoIosArrowDown /> : <IoIosArrowForward />}</p>  {props.topic}
            </div>
            <div className='flex gap-4 items-center'>
                <div className='w-30 h-2 bg-white rounded-4xl'>
                    <div className={`h-2 rounded-full bg-pink-500 transition-all duration-300 `} style={{ width: `${props.topicRelatedProblems ? ((statusCount / props.topicRelatedProblems?.length) * 100) : 0}%` }}></div>
                </div>
                <p className='text-sm'> {statusCount} / {props.topicRelatedProblems ? props.topicRelatedProblems.length : 0} </p>
            </div>
        </div>
        {
            showProblems
            ? 
            <table className='bg-yellow-200 rounded w-[95%] p-8 mx-auto'>
               {
                 props.topicRelatedProblems ? 
                 <tr className='text-center border-1 border-black'>
                 <th className='border-1 border-black h-10'>Status</th>
                 <th className='border-1 border-black'>Problem name</th>
                 <th className='border-1 border-black'>Practice</th>
                 <th className='border-1 border-black'>Resources</th>
                 <th className='border-1 border-black'>Difficulty</th>
                 </tr>
                 : <></>
               }
                {props.topicRelatedProblems?.map((p)=> (
                    <tr className='text-center border-1 border-black rounded'>
                        <td className='border-1 border-black h-10 rounded'> 
                            <input className='cursor-pointer' type="checkbox" name='status' checked={p.status} onClick={()=> updateProblem(currentUser._id, p.problem._id, !p.status, p.problem.difficulty) }/> 
                        </td> 
                        <td className='border-1 border-black'> {p.problem.name}</td>
                        <td className='border-1 border-black'> <Link className='flex items-center justify-center' to={p.problem.practiceLink}> <img className='h-5 w-5' src={platforms[p.problem.platform]} alt="" /> </Link></td>
                        <td className='flex justify-center gap-1 items-center mt-1'> 
                            <div>
                                 <Link to={p.problem.resourceLink}>  <img className='h-5 w-5' src={documentIcon} alt="" /> </Link> 
                            </div>
                            { p.problem?.videoLink?.length ? 
                                <div>
                                    <Link to={p.problem.videoLink}> <img className='h-5 w-5' src={ytIcon} alt="" /> </Link> 
                                </div>
                            : <></> }
                        </td>
                        <td className='border-1 border-black'> {p.problem.difficulty}</td> 
                    </tr>
                ))} 
            </table> 
            : <></>
        }
    </>
  )
}

export default Topic