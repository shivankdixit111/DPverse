import React, { useContext } from "react";
import { GiAchievement } from "react-icons/gi";
import { FaChevronRight, FaAngleLeft, FaRegCircleUser } from "react-icons/fa6";
import { SiThunderstore } from "react-icons/si";
import { problemDataContext } from "../store/ProblemContext";

const Leaderboard = () => {
  const {
    leaderBoardData,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchLeaderBoardData,
  } = useContext(problemDataContext);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchLeaderBoardData(page);
  };

  const getButtonDisplayed = () => {
    let buttons = [];
    if (totalPages <= 5) for (let i = 1; i <= totalPages; i++) buttons.push(i);
    else if (currentPage <= 3) buttons = [1, 2, 3, "...", totalPages];
    else if (currentPage > totalPages - 3)
      buttons = [1, "...", totalPages - 2, totalPages - 1, totalPages];
    else buttons = [1, "...", currentPage, currentPage + 1, "...", totalPages];
    return buttons;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <span className="text-yellow-400 text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-gray-300 text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-amber-600 text-2xl">🥉</span>;
    return <span className="text-purple-400 font-semibold">{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black p-6 pt-24 text-white">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        ⚡ CodeArena Leaderboard
      </h1>

      <div className="w-[95%] md:w-[80%] mx-auto bg-gray-900/80 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-lg overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-4 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 text-white font-semibold text-center py-4 text-lg">
          <div className="flex items-center justify-center gap-2">
            <GiAchievement /> Rank
          </div>
          <div className="flex items-center justify-center gap-2">
            <FaRegCircleUser /> User
          </div>
          <div className="flex items-center justify-center gap-2">
            <SiThunderstore /> Solved
          </div>
          <div className="flex items-center justify-center gap-2">⚔️ Level</div>
        </div>

        {/* Data Rows */}
        <div>
          {leaderBoardData.map((user, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-4 py-5 px-4 md:px-6 text-center text-white ${
                idx % 2 === 0 ? "bg-gray-800/60" : "bg-gray-800/40"
              } hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02]`}
            >
              <div className="flex justify-center items-center">
                {getRankIcon(user.rank)}
              </div>
              <div className="flex justify-center items-center font-semibold tracking-wide">
                {user.name}
              </div>
              <div className="flex justify-center items-center text-gray-200">
                {user.problemsSolvedCount}
              </div>
              <div
                className={`flex justify-center items-center font-semibold ${
                  user.level === "GrandMaster"
                    ? "text-red-400"
                    : user.level === "Master"
                    ? "text-yellow-400"
                    : user.level === "Candidate Master"
                    ? "text-purple-400"
                    : user.level === "Expert"
                    ? "text-cyan-400"
                    : user.level === "Specialist"
                    ? "text-green-400"
                    : "text-gray-400"
                }`}
              >
                {user.level}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-10">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white disabled:opacity-50 hover:scale-110 transition"
        >
          <FaAngleLeft />
        </button>

        {getButtonDisplayed().map((btn, idx) =>
          btn === "..." ? (
            <span key={idx} className="px-2 text-gray-400 font-bold">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => handlePageChange(btn)}
              className={`h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                currentPage === btn
                  ? "bg-black border-2 border-purple-500 text-purple-400 font-bold"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {btn}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white disabled:opacity-50 hover:scale-110 transition"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
