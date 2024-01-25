const User=require('../model/UserModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const nodemailer=require('nodemailer')
const crypto=require('crypto')
require('dotenv').config({path:"../.env"})


exports.signUpUser=async(req,res)=>{
    try {
        const {name,email,password}=req.body
       const isExist=await User.findOne({email:email})
    //    console.log('isExist',isExist)
        // if(!name || !password){
        //     return res.status(400).send({msg:"please enter all fields"})
        // }
       if(isExist){
        return res.status(400).send({msg:'email already used!!!'})
       }


  

    const verifyToken=crypto.randomBytes(20).toString('hex')
   
// isExist.emailToken=verifyToken



  const newUser=new User({...req.body,emailToken:verifyToken})
//   console.log('newUser',newUser)

   const saltRound=10
   const hashedPassword= await bcrypt.hash(password,saltRound)
   newUser.password=hashedPassword
   await newUser.save()
   const payload={
    id:newUser._id
   }
const token=jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'3h'})
     


let transporter=nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:process.env.SECRET_EMAIL,
            pass:process.env.SECRET_PASS
        }
    }) ;


    const serverAdress=`http://localhost:3000`

const verfyEmailLink=`${serverAdress}/verify-email/${verifyToken}`
const mailOptions=({
    from:process.env.SECRET_EMAIL,
    to:email,
    subject:'verify Email',
    text:`click on the following Link to verify your Email:${verfyEmailLink}`
    })

    transporter.sendMail(mailOptions)
    .then(info=>console.log('Email Sent',info.response))
    .catch(err=>console.log('Error Is:', err))
    
    if(!newUser.verified){
        return res.status(400).send({msg:"should you confirm the token in your email !!! "})
      }
   
   
 return res.status(200).send({msg:"signUp with success...",user:newUser,token}) 
    } catch (error) {
        console.log(error)
        res.status(500).send({msg:"can not Add user!!!"})
    }
}


exports.verifyEmail=async(req,res)=>{
    try {
        const{token}=req.params
    const user=await User.findOne({
        emailToken:token
    })

    if(!user){
        return res.status(400).send({msg:'invalid emailToken!!!'})
    }
    user.verified=true
    user.save()
    return res.status(200).send({msg:'email activated successfully...',user})
    } catch (error) {
        console.log(error)
        res.status(500).send({msg:"can not verify this Email!!!"})
    }
}

exports.getVerif=async(req,res)=>{
    try {
                   
    } catch (error) {
        console.log(error)
        res.status(500).send({msg:"can not get verification email"})
    }
}

exports.loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body
        // if(!email || !password){
        //     return res.status(400).send({msg:"email && password was obligated "})
        // }
 const user=await User.findOne({email:email})
 if(!user){
    return res.status(400).send({msg:"Email Not valid"})
 } 


if(!user.verified){
 return res.status(400).send({msg:"check your email for verfy the confirmation Link"})   
}

 const isEqual=await bcrypt.compare(password,user.password)
 if(!isEqual){
   return res.status(400).send({msg:"Invalid password"})
 }
 const payload={
    id:user._id
 }
 const token=await jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'3h'})
 return res.status(200).send({msg:"login with success...",user:user,token})
    } catch (error) {
        console.log(error)
         res.status(500).send({msg:"can not login!!!"})
    }
}

exports.getUser=(req,res)=>{
    return res.status(200).send({user:req.user})
}



exports.forgotPassword=async(req,res)=>{
    try {
        const {email}=req.body
        if(!email){
            return res.status(400).send({msg:"Missing email!!"})
        }
        isExist=await User.findOne({email:email})
     if(!isExist){
     return  res.status(400).send({msg:"email not found!!!"})
     }

let transporter=nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.SECRET_EMAIL,
        pass:process.env.SECRET_PASS
    }
}) ;

const resetToken=crypto.randomBytes(20).toString('hex')
// console.log('resetToken',resetToken)


isExist.resetToken=resetToken
isExist.tokenExpiry=Date.now()+3600000 


  await isExist.save()
//   console.log('isExist',isExist)
  const serverAdress=`http://localhost:3000`

  const resetLink=`${serverAdress}/reset-password/${resetToken}`

const mailOptions=({
from:process.env.SECRET_EMAIL,
to:email,
subject:'reset Password',
text:`click on the following Link to reset your password:${resetLink}`
})

// console.log('mailOptions',mailOptions)

transporter.sendMail(mailOptions).then(info => console.log('Email sent :',info.response))
.catch(err => console.log('Error is :',err))

res.status(200).send({msg:'send mail success',resetLink,resetToken})

    } catch (error) {
          console.log(error)     
          res.status(500).send({msg:'can not solve your problem'})  
    }
}


exports.resetPassword=async(req,res)=>{
    try {
        const {token}=req.params
        const{newPassword}=req.body
        //   console.log('token',token)
        // console.log('newPassword',newPassword)
        if(!newPassword){return res.status(400).send({msg:'please enter your new password'})}


      const SearchbyToken=await User.findOne({
        resetToken:token,
        tokenExpiry:{$gt:Date.now()}
        
        })

        // console.log('SearchbyToken',SearchbyToken)

            if(!SearchbyToken){
               return res.status(400).send({msg:'invalid or expired token'})
             }

                //    SearchbyToken.password=newPassword;
                   const saltRound=10
                   const newhash=await bcrypt.hash(newPassword,saltRound)
                   SearchbyToken.password=newhash
                   SearchbyToken.resetToken=undefined;
                   SearchbyToken.tokenExpiry=undefined;

                 
              await SearchbyToken.save()
            //   console.log('SearchbyToken',SearchbyToken.resetToken)
   
 return res.status(200).send({msg:'password reset successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).send({msg:'can Not reset password'})
    }
}