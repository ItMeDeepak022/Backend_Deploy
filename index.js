const { config } = require("dotenv")
let express = require("express")
let mongoose=require('mongoose')
let App=express()
App.use(express.json())

// To manages the ports of frontend and backend....
let cors=require('cors')
const { adminRouter } = require("./App/routers/adminRouter")
App.use(cors())

// To allow to acces variable in Port....
 require('dotenv').config()
 

 // http://localhost:8000/admin

App.use('/admin',adminRouter)
 
// DB + Connections 

//  for local server to connet mongodb
//  mongodb://127.0.0.1:27017/${process.env.DBName}

 mongoose.connect(process.env.DbUrl)
 .then(()=>{
    // http://localhost:5000
    App.listen(process.env.PORT,()=>{
      console.log('DB connected to ATLAS..',process.env.PORT,);
    })
     
   
 })
.catch((err)=>{
    console.log(err);
})
 

