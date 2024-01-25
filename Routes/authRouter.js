const express=require('express')
const Router=express.Router();
const {signUpUser,loginUser,getUser,forgotPassword,resetPassword,verifyEmail}=require('../Controllers/AuthController')
const {signUpRules,LoginRules,validation}=require('../Middelware/validation')
const isAuth=require('../Middelware/Auth')

Router.post('/SignUp',signUpRules(),validation,signUpUser)
Router.post('/verify-Email/:token',verifyEmail)
Router.post('/Login',LoginRules(),validation,loginUser)
Router.post('/F-password',validation,forgotPassword)
Router.post('/reset-password/:token',resetPassword)
// Router.get()
Router.get('/',isAuth,getUser)
module.exports=Router