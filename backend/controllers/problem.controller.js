const { text } = require("express");
const Problem = require("../models/problem.mode");
const User = require("../models/user.model");
const { getLLMAnswer } = require("../services/langchain");
const { getPr, getProblemDataoblemData } = require('../services/leetcodeAPI')
const cheerio = require('cheerio')

const createProblem = async(req, res)=>{
   try{
      const {form, name, practiceLink, platform, resourceLink, videoLink, difficulty} = req.body;
      const problemExist = await Problem.findOne({practiceLink : practiceLink})

      console.log('existed problem ', problemExist)

      if(problemExist) {
        return res.status(400).json({message: "Problem already exists.. Please try with different problem"})
      }

      console.log(form, name, practiceLink, resourceLink, difficulty)

      const newProblem = await Problem.create({form, name, practiceLink, platform, resourceLink, videoLink, difficulty})
      return res.status(200).json(newProblem)
   } catch(error) {
      console.log(error)
      return res.status(400).json({message: "Internal server error"})
   }
}


const getAllProblems = async(req, res)=>{
    try{
        // console.log('req body is ---->>>>>>>> ', req.body)
        const {userId} = req.body;

        // console.log(userId) 
        const user = await User.findById(userId).populate('problemsSolved.problem'); //populate it to get the all details of inner problem

        user.problemsSolved = await user.problemsSolved.filter((p)=> p.problem !== null)  

        const difficultyOrder = {
          "Easy": 1,
          "Medium": 2,
          "Hard": 3,
        }
        user.problemsSolved.sort((a,b)=> {
         return difficultyOrder[a.problem.difficulty] - difficultyOrder[b.problem.difficulty];
        })
 
        await user.save();

        const allProblems = user.problemsSolved;

        // console.log(' --- ', allProblems) 
       
       return res.status(200).json(allProblems)

      return res.status(200).json({message: "ok"})
    } catch(error) {
       return res.status(400).json({message: "Internal server error in fetching all problems"})
    }
}

const getAllProblems2 = async(req, res)=>{
   try{
      const allProblems = await Problem.find();
      
      return res.status(200).json(allProblems)
 
   } catch(error) {
      return res.status(400).json({message: "Internal server error in fetching all problems"})
   }
}

 const updateProblem = async(req, res)=>{
    try{
        const {user_id, problem_id, status, difficulty} = req.body;

        console.log('-- ', user_id, problem_id, status)
        const existingUser = await User.findOne({_id: user_id})
        if(!existingUser) {
            return res.status(400).json({message: "User not found !"});
        }

        //check if for user's problemsSolved array is the problem present using find() method

        const problemExist = await existingUser.problemsSolved.find((p) => p.problem.toString() === problem_id) 
        let score = (difficulty === "Easy" ? 2 : (difficulty === "Medium") ? 4 : 8)
        if(!problemExist) {
            existingUser.problemsSolved.push({
               problem: problem_id,
               status: status,
               solvedAt: status ? Date.now() : null,
               points: status ? score : 0,
            })
        } else {
            problemExist.status = status;  //as problemExist is a refrence of the problem
            problemExist.solvedAt = status ? Date.now() : null,
            problemExist.points =  status ? score : 0;
        }

        await existingUser.save();

        return res.status(200).json({message: "successfully updated"})

    } catch(error) {
       return res.status(400).json({message: "Internal server error"})
    }
 }

const getLevelByPoints = (points) => {
  if (points < 40) return "Newbie";
  if (points < 100) return "Specialist";
  if (points < 200) return "Expert";
  if (points < 300) return "Candidate Master";
  if (points < 400) return "Master";
  return "GrandMaster";
};
const displayLeaderBoard = async (req, res) => {
  try {
    const pageSize = 5;
    const page = parseInt(req.body.page) || 1;
    const skip = (page - 1) * pageSize;

    // stage 1
    const aggregated = await User.aggregate([
      {"$unwind": "$problemsSolved"}, //seperate the problems solved array's values
      {"$match" : {"problemsSolved.status" : true}},
      {
        "$group": {
          _id: "$_id",
          email: {"$first": "$email"},
          name : {"$first": "$name"},
          problemsSolvedCount: {"$sum": 1},
          totalPoints: {"$sum": "$problemsSolved.points"}
        }
      },
      // Main sort
      {"$sort" : {problemsSolvedCount: -1, totalPoints: -1}},
      // Calculate the rank 
      {
        "$setWindowFields": {
          sortBy: {totalPoints : -1},
          output: { rank : { $denseRank : {} }}
        }
      },
      {$skip: skip},
      {$limit : pageSize}
    ])

    console.log(aggregated) 

    // Stage 2: Compute user level on server side
    const leaderboardWithLevel = aggregated.map((user) => (
      {...user, level: getLevelByPoints(user.totalPoints)}
    ))

    // Stage 3: Count total unique users who solved problems
    const totalUsers = await User.aggregate([
        { "$unwind": "$problemsSolved" },
        { "$match": { "problemsSolved.status" : true }},
        { "$group": {_id: "$_id"}},
        { "$count": "count" }
    ]) 
    
    console.log('total users are --->> ', totalUsers)

    const totalCount = totalUsers[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      users: leaderboardWithLevel,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}; 


let storedProblem = "";
const getAIAnswer = async(req, res)=>{
   try {
      const {url, query} = req.body;
      const slug = url.split("/")[4];
      storedProblem = slug;
      console.log('url is ', url) 
      let aiResponse = "";
      
         const problemStatement = await getProblemData(slug);
         const title = problemStatement.data.question.title;
         const html = problemStatement.data.question.content;
         const d = cheerio.load(html) 
         const textContent = d.text().trim(); 
 

      aiResponse  = await getLLMAnswer({question : textContent, query}); 

      console.log('AI Response is ------------- ', aiResponse)

      return res.status(200).json(aiResponse)
      
   } catch(error) {
      console.log(error)
      return res.status(400).json({message: "Error in AI Response of the question"})
   }
}

module.exports = { createProblem, getAllProblems, getAllProblems2, updateProblem, displayLeaderBoard, getAIAnswer };
