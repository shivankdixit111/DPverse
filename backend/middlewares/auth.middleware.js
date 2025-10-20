const admin = require('../firebase')
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const combinedAuthMiddleware = async(req, res, next)=> {
      const token = req.headers.authorization; 
      if(!token) {
        return res.status(400).json({message: "Unauthorized! Please try again later."})
      }

      try{
        // first try to verify as firebase token 
        const decodedUser = await admin.auth().verifyIdToken(token);
        console.log('decoded user is -- ', decodedUser)
        req.user = decodedUser;
        req.authType = 'firebase'
        return next();
      } catch(error) {
        //if firebase token fails then verify it as a JWT token
          try{
            const decodedUser = await jwt.verify(token, process.env.SECRET_KEY);
            const user = await User.findById(decodedUser.id)
         
            req.user = user;
            req.authType = 'jwt'
            return next();
          } catch(error) {
              console.log(error)
              return res.status(400).json({message: "Internal server error in verification"})
          } 
      } 
} 

module.exports =  combinedAuthMiddleware 