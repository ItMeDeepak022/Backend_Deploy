let mongoose=require('mongoose')
let authSchema=mongoose.Schema({
    name:String,
    email:{
        type:String,
        require:[true,"Email is requireds...."],
        unique:true
    },  
     password:String
  
})

let  authModel=mongoose.model('authdata', authSchema)

module.exports={ authModel}