const Problem = require('../models/problem.mode');
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signup = async(req, res)=> {
  try{
    const {name, email, password, graduationYear} = req.body;
    console.log(name, email, password, graduationYear)
    const userExist = await User.findOne({email}) 
    if(userExist) { 
      return res.status(400).json({message: "User already exist with this eamil!"});
    }
    const hashed_password = await bcrypt.hash(password, 10); //salt round = 10

    const newUser = await User.create({ name, email, password: hashed_password, graduationYear})

    return res.status(200).json(newUser); 
  } catch(error) {
    return res.status(400).json({message: "Internal server error in signup !!!"})
  }
}

const login = async(req, res)=> {
  try{
    const {email, password} = req.body;
    const userExist = await User.findOne({email})
    if(!userExist) { 
      return res.status(400).json({message: "Invalid credentials!"});
    }
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if(!isPasswordValid) {
      return res.status(400).json({message: "Invalid credentials!"})
    }

    const token = jwt.sign(
      {id: userExist._id},
      process.env.SECRET_KEY,
      {
        expiresIn: '7d'
      }
    )

    return res.status(200).json({user: userExist, token});
  } catch(error) {
    return res.status(400).json({message: "Internal server error in login !!!"})
  }
}

const googleLogin = async(req, res)=> {
    try{
      const {uid, name, email} = req.body;
      const userExist = await User.findOne({uid})
      if(!userExist) {
         const newUser = await User.create({uid, name, email})
         return res.status(200).json(newUser);
      }
      return res.status(200).json(userExist);
    } catch(error) {
      return res.status(400).json({message: "Internal server error in login !!!"})
    }
}

const getProfile = async(req, res)=> {
    try{
      let user;
      if(req.authType === 'firebase') {  //firebase token verified
        const firebaseUser = req.user;   
         user = await User.findOne({uid: firebaseUser.uid}) 

      } else { //jwt token verified
        user = req.user;  
      }

      const allProblems = await Problem.find(); 
      allProblems.map(async(problem)=> {
        const p = problem;

        const problemExist =  user.problemsSolved.find((p)=> p.problem.toString() === problem._id.toString());
        if(!problemExist) {
            user.problemsSolved.push({problem: problem._id, status: false, solvedAt: null, points: 0})
        }
      })  
      await user.save(); 

      return res.status(200).json(user);
     
    } catch(error) {
      return res.status(400).json({message: "Internal server error in fetching profile !!!"})
    }
}
 

module.exports = {googleLogin, getProfile, login, signup}