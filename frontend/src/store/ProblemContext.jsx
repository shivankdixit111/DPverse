import React, { createContext, useContext, useEffect, useState } from 'react';
import { userDataContext } from './UserContext';

export const problemDataContext = createContext();

const ProblemContext = ({ children }) => {
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { token, currentUser } = useContext(userDataContext);

  const fetchLeaderBoardData = async (page = 1) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/problem/leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ page }),
      });

      const data = await response.json();

      console.log('request to leaderboard ', data)

      if (data.success) {
        setLeaderBoardData(data.users || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);

        // find current user’s rank
        const found = data.users.find(user => user.email === currentUser.email);
        if (found) setCurrentUserRank(found);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  useEffect(() => {
    if (currentUser) fetchLeaderBoardData(1);
  }, [currentUser]);

  return (
    <problemDataContext.Provider
      value={{
        currentUserRank,
        leaderBoardData,
        currentPage,
        totalPages,
        setCurrentPage,
        fetchLeaderBoardData,
      }}
    >
      {children}
    </problemDataContext.Provider>
  );
};

export default ProblemContext;
