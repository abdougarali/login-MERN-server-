const jwt=require('jsonwebtoken')
require('dotenv').config({path:"../.env"})
const User=require('../model/UserModel')




const isAuth=async(req,res,next)=>{
    try {
     let token=req.headers['x-auth']
     if(!token){
        return res.status(400).send({msg:'token not found!!!'})
     } 
     try {
      let decoded=await jwt.verify(token,process.env.SECRET_KEY)
      const user=await User.findById(decoded.id)
   if(!user){
     return res.staus(400).send({msg:'invalid token!!!'})
   }
  req.user=user;
 //  console.log('req.user',req.user)
  return next()
      
     } catch (error) {
      console.log(error)
      res.status(400).send('jwt')
     }
      
           
    } catch (error) {
        console.log(error)
        res.status(500).send({msg:"token not work"})
    }
}

module.exports=isAuth;