const { text } = require("express");
const Problem = require("../models/problem.mode");
const User = require("../models/user.model");
const { getLLMAnswer } = require("../services/langchain");
const { getScrappedData } = require('../services/scraper')
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

        const problemIds = await user.problemsSolved.map((p)=> p.problem._id)
 
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
        let score = (difficulty === "Easy" ? 2 : (difficulty === "Medium") ? 4 : 6)
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

 const displayLeaderBoard = async(req, res)=>{
    try{
      const leaderboard = await User.aggregate([
         { $unwind : '$problemsSolved'}, //unwind each problem seperately
         { $match: {'problemsSolved.status': true}},
         {
           $group: {
              _id: '$_id',  //group documents by User (_id)
              name: {$first: '$name'}, // Retrieves the namefield from the first document in each group. Since all documents in a group represent the same user, this effectively captures the user's name.
              email: {$first: '$email'},
              totalPoints: {$sum: '$problemsSolved.points'},
              problemsSolvedCount: {$sum: 1}  // Counting the number of solved problems
           }
         },
         { $sort: {problemsSolvedCount: -1} },

         //asigning rank
         {
            $setWindowFields : {
               sortBy: { problemsSolvedCount : -1},
               output: {
                  rank: { $denseRank: {} }
               }
            }
         }
      ])

      return res.status(200).json(leaderboard)
    } catch(error) {
      console.log(error)
    }
}

let storedProblem = "";
const getAIAnswer = async(req, res)=>{
   try {
      const {url, query} = req.body;
      const slug = url.split("/")[4];
      storedProblem = slug;
      console.log('url is ', url)
      // console.log("slug is ", slug)
      let aiResponse = "";
     
      // if(storedProblem == "") {
         const problemStatement = await getScrappedData(slug);
         const title = problemStatement.data.question.title;
         const html = problemStatement.data.question.content;
         const d = cheerio.load(html)
         // console.log('d is ', d)
         const textContent = d.text().trim();
         //   console.log('title is ', title, 'problem statement is - ', textContent)
         // aiResponse   = await getLLMAnswer(problemStatement); 
      // }  

      // console.log('problem name is ', textContent)

      aiResponse  = await getLLMAnswer({question : textContent, query}); 

      console.log('AI Response is ------------- ', aiResponse)

      return res.status(200).json(aiResponse)
      
   } catch(error) {
      console.log(error)
      return res.status(400).json({message: "Error in AI Response of the question"})
   }
}

module.exports = { createProblem, getAllProblems, getAllProblems2, updateProblem, displayLeaderBoard, getAIAnswer };