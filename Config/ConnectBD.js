const mongoose=require('mongoose')
require('dotenv').config({path:"../.env"})

const ConnectDB=async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("data base connected...")
    } catch (error) {
        console.log(error)
    }

}
module.exports = ConnectDB