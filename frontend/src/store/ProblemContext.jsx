import React, { createContext, useContext, useEffect, useState } from 'react'
import { userDataContext } from './UserContext';

export const problemDataContext = createContext();

const ProblemContext = ({children}) => {
  const [leaderBoardData, setLeaderBoardData] = useState([])
  const [currentUserRank, setCurrentUserRank] = useState(0);
  const {token, currentUser} = useContext(userDataContext)
  
  useEffect(()=> {
     const fetchLeaderBoardData = async()=> {
         try{
           const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/problem/leaderboard`, {
             method: "GET",
             headers: {
               'Authorization': token,
             }
           })

           const data = await response.json();
           setLeaderBoardData(data);
 

           for(let user of leaderBoardData) { 
             if(user.email === currentUser.email) {
                setCurrentUserRank(user.rank)
                
                console.log('match found ', user)
                break;
             }
            }
 
           console.log(data)
         } catch(error) {
           console.log(error)
         }
     }

     fetchLeaderBoardData();
  },[currentUser])

  return (
     <problemDataContext.Provider value={{ currentUserRank, leaderBoardData }}>
        {children}
     </problemDataContext.Provider>
  )
}

export default ProblemContext