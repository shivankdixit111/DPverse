const { razorpayInstance } = require('../lib/razorpay');
const Problem = require('../models/problem.mode');
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const dotenv = require('dotenv')
dotenv.config();

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


const updateToken = async(req, res)=> {
  try{
    const {email, creditBalance} = req.body;
    const userExist = await User.findOne({email})
    if(!userExist) { 
      return res.status(400).json({message: "Invalid credentials!"});
    }
    
    await User.updateOne({email}, {creditBalance: Math.max(0,creditBalance)});
    return res.status(200).json({message: "Token updated successfully!"});
  } catch(error) {
    return res.status(400).json({message: "Internal server error in updating token !!!"})
  }
}

const makePayment = async(req, res)=> {
    try {
      const {amount, tokens} = req.body;

      console.log('tokens is ', tokens)

      const options = {
        amount: amount*100, //convert to paise
        currency: "INR",  
      }
      
      const order = await razorpayInstance.orders.create(options)
      console.log(order)
      return res.status(200).json(order)
    } catch(error) {
      console.log('error from payment =====  ', error)
        return res.status(400).json({message: "Server Error! Try again later"})
    }
};

const verifyPayment = async(req, res)=> {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, tokens } = req.body; 

      const sign = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex')

      console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature, email, tokens, "expected---- ", expectedSign)

      if(expectedSign == razorpay_signature) {
        const user = await User.updateOne({email}, {$inc: {creditBalance: tokens}}, {new: true});
        console.log('user is ', user)
        return res.status(200).json("Payment is successful !")
      } 
      
      return res.status(400).json("Payment is unsuccessful! Try again later"); 

    } catch(error) {
      console.log('error from payment verification =====  ', error)
      return res.status(400).json({message: "Server Error! Try again later"})
    }
};


module.exports = {googleLogin, getProfile, login, signup, makePayment, verifyPayment, updateToken}