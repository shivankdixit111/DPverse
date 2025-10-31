import React, { useContext } from "react";
import { userDataContext } from "../store/UserContext";
import { problemDataContext } from "../store/ProblemContext";

const Profile = () => {
  const { currentUser, logOut } = useContext(userDataContext);
  const { currentUserRank } = useContext(problemDataContext);

  const nameFirstLetter = currentUser?.name?.[0]?.toUpperCase();
  const totalPoints = Number(currentUserRank?.totalPoints) || 0;
  const levelName = currentUserRank?.level || "Newbie";

  const levels = [
    { name: "Newbie", min: 0, max: 40, color: "text-gray-300" },
    { name: "Specialist", min: 41, max: 100, color: "text-green-400" },
    { name: "Expert", min: 101, max: 200, color: "text-cyan-400" },
    { name: "Candidate Master", min: 201, max: 300, color: "text-purple-400" },
    { name: "Master", min: 301, max: 400, color: "text-yellow-400" },
    { name: "GrandMaster", min: 401, max: Infinity, color: "text-red-400" },
  ];

  // find current level object by name (from leaderboard) or by points fallback
  let currentLevel = levels.find((l) => l.name === levelName);
  if (!currentLevel) {
    currentLevel = levels.find((l) => totalPoints >= l.min && totalPoints <= l.max) || levels[0];
  }

  const currentIndex = Math.max(0, levels.indexOf(currentLevel));
  const nextLevel = levels[currentIndex + 1] || null;

  // points needed to reach next level: use nextLevel.min - totalPoints
  const pointsToNext =
    nextLevel === null
      ? null
      : Math.max(0, (nextLevel.min || 0) - totalPoints);

  // progress percent: how far inside current level toward next level
  // denominator = nextLevel.min - currentLevel.min (if next exists), else use 1 to avoid div by zero
  const progressPercent = (() => {
    if (!nextLevel) return 100;
    const denom = Math.max(1, (nextLevel.min - currentLevel.min));
    const val = ((totalPoints - currentLevel.min) / denom) * 100;
    return Math.max(0, Math.min(100, val));
  })();

  return (
    <div className="min-h-screen bg-gray-900 px-6 md:px-20 pt-24 text-white">
      {/* Header */}
      <div className="flex gap-4 items-center mb-12">
        <div className="h-20 w-20 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg shadow-purple-800/40">
          {nameFirstLetter}
        </div>
        <div>
          <h2 className="font-extrabold text-3xl">{currentUser?.name}</h2>
          <h3 className="text-gray-300 text-md">{currentUser?.email}</h3>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-xl shadow-xl transform hover:scale-105 transition flex flex-col items-center justify-center text-center bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500">
          <h2 className="text-3xl font-bold mb-2">{currentUserRank?.problemsSolvedCount ?? 0}</h2>
          <h3 className="text-gray-200">Problems Solved</h3>
        </div>

        <div className="p-6 rounded-xl shadow-xl transform hover:scale-105 transition flex flex-col items-center justify-center text-center bg-gradient-to-r from-pink-600 via-red-500 to-yellow-500">
          <h2 className="text-3xl font-bold mb-2">{currentUserRank?.rank ?? "-"}</h2>
          <h3 className="text-gray-200">Leaderboard Rank</h3>
        </div>

        <div className="bg-gray-800 p-6 text-center rounded-xl shadow-xl transform hover:scale-105 transition">
          <h2 className={`text-3xl font-bold mb-2 ${currentLevel.color}`}>{currentLevel.name}</h2>
          <h3 className="text-gray-200">Level</h3>

          <div className="w-full bg-gray-700 h-3 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {pointsToNext !== null ? (
            <p className="text-sm text-gray-400 mt-2">
              {pointsToNext} point{pointsToNext === 1 ? "" : "s"} to reach{" "}
              <span className="font-semibold">{nextLevel.name}</span>
            </p>
          ) : (
            <p className="text-sm text-gray-400 mt-2">Top tier — keep going!</p>
          )}
        </div>
      </div>

     

{/* Rank Table */}
<div className="bg-gray-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-800 mt-10">
  <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
    🏆 Level Progression
  </h3>

  <div className="overflow-hidden rounded-2xl">
    <table className="min-w-full text-base text-gray-200">
      <thead className="bg-gradient-to-r from-indigo-800/40 to-purple-800/40 backdrop-blur-md">
        <tr>
          <th className="py-4 px-6 text-left text-lg font-semibold tracking-wide text-indigo-300">
            Level
          </th>
          <th className="py-4 px-6 text-left text-lg font-semibold tracking-wide text-indigo-300">
            Points Range
          </th>
          <th className="py-4 px-6 text-left text-lg font-semibold tracking-wide text-indigo-300">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800">
        {levels.map((l, i) => {
          const isCurrent = i === currentIndex;
          const isAchieved = i < currentIndex;

          const statusText = isCurrent
            ? `🚀 You — ${totalPoints} pts`
            : isAchieved
            ? "✅ Achieved"
            : "⏳ Upcoming";

          const statusColor = isCurrent
            ? "bg-indigo-600/20 text-indigo-300 border border-indigo-600"
            : isAchieved
            ? "bg-red-700/30 text-red-400 border border-red-600"
            : "bg-gray-700/40 text-gray-300 border border-gray-600";

          return (
            <tr
              key={l.name}
              className={`transition-all duration-300 ${
                isCurrent
                  ? "bg-gradient-to-r from-indigo-800/40 to-purple-800/40 shadow-lg shadow-indigo-900/40"
                  : "hover:bg-gray-800/40"
              }`}
            >
              <td className={`py-4 px-6 font-semibold text-xl ${l.color}`}>
                {l.name}
              </td>
              <td className="py-4 px-6 text-lg">
                {l.max === Infinity ? `${l.min}+` : `${l.min} - ${l.max}`}
              </td>
              <td className="py-4 px-6">
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${statusColor}`}
                >
                  {statusText}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>


      {/* Problem Difficulty to Points */}
      <div className="bg-gray-800 p-6 mt-8 rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-center bg-gradient-to-r from-green-400 to-blue-400 text-transparent bg-clip-text">
          🎯 Points by Problem Difficulty
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 text-center gap-4">
          <div className="p-4 bg-gray-900/60 rounded-lg hover:bg-gray-700/60 transition">
            <h4 className="text-lg font-semibold text-green-400">Easy</h4>
            <p className="text-gray-300">2 Points</p>
          </div>
          <div className="p-4 bg-gray-900/60 rounded-lg hover:bg-gray-700/60 transition">
            <h4 className="text-lg font-semibold text-yellow-400">Medium</h4>
            <p className="text-gray-300">4 Points</p>
          </div>
          <div className="p-4 bg-gray-900/60 rounded-lg hover:bg-gray-700/60 transition">
            <h4 className="text-lg font-semibold text-red-400">Hard</h4>
            <p className="text-gray-300">8 Points</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-12 text-center">
        <button
          className="py-2 px-6 bg-red-600 hover:bg-red-500 text-white rounded shadow-lg transition mb-4"
          onClick={logOut}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
