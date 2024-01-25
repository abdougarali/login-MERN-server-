const {body,validationResult}=require('express-validator')


const signUpRules=()=>[
body('name','user Name is Required ').notEmpty(),
body('email', 'should be email').isEmail(),
body('password','password length should be between 5 & 15').isLength({
    // min:5,
    max:15
})
]

const LoginRules=()=>[
    body('email','should be accepted email').isEmail(),
    body('password','accepted password').isLength({
        // min:5,
        max:15
    })
]

const validation=async(req,res,next)=>{
    const errors=validationResult(req)
    if(errors.isEmpty()){
        return next()
    }
    return res.status(400).send({errors:errors.array()})
}
module.exports={signUpRules,LoginRules,validation}