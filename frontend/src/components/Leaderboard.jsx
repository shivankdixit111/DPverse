import React, { useContext, useState } from 'react' 
import { GiAchievement } from "react-icons/gi";
import { FaChevronRight, FaRegCircleUser } from "react-icons/fa6";
import { SiThunderstore } from "react-icons/si";
import { FaAngleLeft } from "react-icons/fa6";
import { problemDataContext } from '../store/ProblemContext'; 

const Leaderboard = () => {
  const { leaderBoardData } = useContext(problemDataContext)
  //state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const totalPages = Math.ceil(leaderBoardData.length / usersPerPage);

  const indexOfLastUser = usersPerPage * currentPage; //10 * 3
  const indexOfFirstUser = indexOfLastUser - usersPerPage; //0 based indexing
  const currentUsers = leaderBoardData.slice(indexOfFirstUser, indexOfLastUser);

  const getButtonDisplayed = ()=> {
      let buttons = [] 

      if(totalPages<=5) {
        for(let i=1;i<=Math.min(totalPages, 5);i++) buttons.push(i);
        return buttons;
      }
      //1 2 3 ..... n    user click on first three buttons
      if(currentPage <= 3) {
        for(let i=1;i<=3;i++) buttons.push(i);
        buttons.push("...");
        buttons.push(totalPages);
        return buttons;
      }
      //1 ..... n-2 n-1 n    user click on last three buttons
      if(currentPage > totalPages-3) {
        buttons.push(1);
        buttons.push("...");
        for(let i=totalPages-2;i<=totalPages;i++) buttons.push(i); 
        return buttons;
      }

      //1....c c+1 c+2 ... n    c-> current page
      buttons.push(1);
      buttons.push("...");
      for(let i=currentPage;i<=currentPage+2;i++) buttons.push(i); 
      buttons.push("...");
      buttons.push(totalPages);

      return buttons;
  }

  let arr = getButtonDisplayed(); 


  return (
    <div className='min-h-screen bg-black p-4 pt-20'>
    <table className='bg-yellow-300 w-[90%] mx-auto border-separate border-spacing-y-4 mt-4 rounded-lg shadow-lg'>
      <tr className=' h-10 bg-black text-yellow-400'>
        <th className='border-2 rounded-l-lg'><div className='flex items-center justify-center space-x-1'><GiAchievement className='h-5 w-5  '/> <span>Rank</span> </div> </th>
        <th className='border-2'><div className='flex items-center justify-center space-x-1'><FaRegCircleUser className='h-5 w-5 '/> <span>Username</span>  </div></th>
        <th className='border-2 rounded-r-lg'><div className='flex items-center justify-center space-x-1'><SiThunderstore className='h-5 w-5 '/> <span>Problems Solved</span> </div></th>  
      </tr> 
      {
         leaderBoardData.map((user)=> (
          <tr className=' border-2 h-10 border-black text-center bg-yellow-300 hover:bg-yellow-200 transition-colors cursor-pointer rounded-2xl '>
           <td className='border border-black font-semibold'>{user?.rank}</td>
           <td className='border border-black '>{user?.name}</td> 
           <td className='border border-black '>{user?.problemsSolvedCount}</td>
          </tr>
         ))
      }
    </table>

    
    
    {/* [...Array(3)]  dense array: [undefined, undefined, undefined], map works fine */}

    {/* pagination logic  */}
     <div className='flex items-center justify-center gap-2 mt-2 mb-6'>
          <button onClick={()=> setCurrentPage((prev)=> Math.max(1,prev-1))} disabled = {currentPage === 1}
              className='h-12 w-12 cursor-pointer bg-yellow-500 hover:bg-yellow-300  transition-colors disabled:opacity-50 rounded-full flex items-center justify-center '><FaAngleLeft />
          </button>

          {
            getButtonDisplayed().map((buttonText,idx)=>{
              if(buttonText=="...") return <span key={idx} className='font-bold text-yellow-400 px-2'>...</span>
              else 
                return (
                  <button key={idx} onClick={()=> setCurrentPage(buttonText)} 
                      className={`h-10 w-10 cursor-pointer transition-colors rounded-full
                       flex items-center justify-center ${(currentPage === buttonText) ? 'bg-black border-2 border-yellow-500 text-yellow-400' : 'bg-yellow-400 text-black hover:bg-yellow-300'}`}>{buttonText}
                  </button>
                )
              })
          }
          
         
        <button onClick={()=> setCurrentPage((prev)=> Math.min(totalPages, prev+1))} disabled = {currentPage === totalPages}
           className='h-12 w-12 cursor-pointer bg-yellow-500 hover:bg-yellow-300 disabled:opacity-50 transition-colors rounded-full items-center flex justify-center'><FaChevronRight />
        </button>
     </div>
    </div>
  )
}

export default Leaderboard