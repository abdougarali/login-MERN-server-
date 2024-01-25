const mongoose=require('mongoose')
const {model,Schema}=mongoose

const userSchema=new Schema({
    name:{type:String,
    trim:true,
    required:true
    },
    slug:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    emailToken:{type:String,
    default:''
    },
    verified:{type:Boolean,
    default:false
    },
    phone:String,
    ProfileImg:String,

    password:{type:String,
    required:true
    },
    resetToken:{type:String,
    default:''
    },
    tokenExpiry:{type:Date,
    default:''
    }, 
    role:{type:String,
    enum:['Admin','user'],
    default:'user'
    },
    
},{timestamps:true})
const User=model('Users',userSchema)


module.exports=User