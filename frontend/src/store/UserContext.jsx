import React, { createContext, useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';


export const userDataContext = createContext();

const UserContext = ({children}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [allProblems, setAllProblems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const[EasyProblemCount, setEasyProblemCount] = useState(0);
  const[MediumProblemCount, setMediumProblemCount] = useState(0);
  const[HardProblemCount, setHardProblemCount] = useState(0);

  const[EasySolvedProblemCount, setEasySolvedProblemCount] = useState(0);
  const[MediumSolvedProblemCount, setMediumSolvedProblemCount] = useState(0);
  const[HardSolvedProblemCount, setHardSolvedProblemCount] = useState(0);

  const[solvedProblemCount, setSolvedProblemCount] = useState(0);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [updationOccur, setUpdationOccur] = useState(0);

  const navigate = useNavigate();

  const logOut = (()=> {
     localStorage.removeItem('token');
     setCurrentUser("");
     signOut(auth)
     setIsLoggedIn(false);
     navigate('/')
  })

  //user profile
  useEffect(()=>{
     const getProfile = (async()=> {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/get-profile`, {
             method: "GET",
             headers: {
               'Authorization': token
             }
          })

          const data = await response.json();
          console.log('user profile in context ', data)

          if(response.ok) { 
            setCurrentUser(data);
            localStorage.setItem('token', token);
            setIsLoggedIn(true) 
          } else {
             setIsLoggedIn(false);
          }
        } catch(err) {
           console.log('Internal server error')
           setIsLoggedIn(false)
        }
     })

     getProfile();
  },[token, updationOccur])

  
  //-------- problem related stuff -----
  
  useEffect(()=> {
    async function fetchAllProblems() {
      const body = {
         userId: currentUser._id
      }
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/problem/get-all-problems`, {
        method: "POST",
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
  
      let data = await response.json();

      console.log('all problems are ', data)
  
      if(response.ok) {
        setAllProblems(data); 
        let easy=0,med=0,hard=0, eSolved = 0, mSolved=0, hSolved=0;


        for(let p of data) {
          if(p.problem?.difficulty === "Easy")  {
            if(p.status) eSolved++;
            easy++; 
          }
          else if(p.problem?.difficulty === "Medium") {
            if(p.status) mSolved++;
            med++;
          }
          else {
            if(p.status) hSolved++;
            hard++;
          }
        }

        setEasyProblemCount(easy);
        setMediumProblemCount(med);
        setHardProblemCount(hard);

        setEasySolvedProblemCount(eSolved);
        setMediumSolvedProblemCount(mSolved);
        setHardSolvedProblemCount(hSolved);


        console.log("diff ", EasyProblemCount, MediumProblemCount, HardProblemCount);
      }

      console.log('all problems are ', data)
      // console.log('all problems are ->->-> ', allProblems)
    }  
  
      fetchAllProblems();
  }, [currentUser, updationOccur])

  const updateTokenCredit = async(token)=>{
      const body = {
        creditBalance : token,
        email: currentUser.email
      }
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/update-token`, {
        method: "POST",
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const data = await response.json();
      console.log('token upation is ', data)
  }
  
  return (
     <userDataContext.Provider value={{isLoggedIn, setCurrentUser, currentUser, setToken, token, allProblems, logOut, 
        setUpdationOccur, updateTokenCredit, EasyProblemCount, MediumProblemCount, HardProblemCount, EasySolvedProblemCount, 
        MediumSolvedProblemCount, HardSolvedProblemCount, totalSolvedProblemsCount : EasySolvedProblemCount + MediumSolvedProblemCount
         + HardSolvedProblemCount, isModalOpen, setIsModalOpen }}>
           {children}
     </userDataContext.Provider>
  )
}

export default UserContext