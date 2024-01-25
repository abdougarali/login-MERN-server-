const express=require('express')
require('dotenv').config()
const PORT=process.env.PORT || 5001
const app=express()
const ConnectDB=require('./Config/ConnectBD')
const Router=require('./Routes/authRouter')
ConnectDB()

app.use(express.json())
app.use('/Api/Auth',Router)



app.listen(PORT, (err)=>
err?console.log(err):
console.log(`server running with success on ${PORT}`)
)