let mongoose=require('mongoose')
let usersSchema=mongoose.Schema({
    username:String,
    userEmail:{
        type:String,
        require:[true,"Email is requireds...."],
        maxLength:30,
        minLength:10,
        unique:true
    },  
    mobileNumber:{
        type:String,
        maxLength:10,
        minLength:10,
        require:[true,"Mobile num.. is required..."],
         unique:true

    }
  
})

let usersModel=mongoose.model('userdata',usersSchema)

module.exports={usersModel}