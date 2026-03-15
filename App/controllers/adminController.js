const { usersModel } = require("../models/users.model")
let bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const { authModel } = require("../models/admin.model");

let loginData = async (req, res) => {

   let { email, password } = req.body



   let checkdbEmail = await authModel.findOne({ email })

   // console.log(checkdbEmail.name);

   if (checkdbEmail) {

      let dbpassword = checkdbEmail.password
      let Fletter = checkdbEmail.name
      var token = jwt.sign({ userId: checkdbEmail._id }, process.env.TokenKey);


      if (bcrypt.compareSync(password, dbpassword)) {

         res.send({
            status: true,
            message: "login successfully",
            token,
            Fletter
         })
      }
      else {
         res.send({
            status: false,
            message: "Invaild password.."
         })
      }

   }

   else {
      res.send({
         status: false,
         message: "user email does not exits.."
      })
   }


}



let RegData = async (req, res) => {

   let { name, email, password } = req.body

   const hash = bcrypt.hashSync(password, 10);

   let obj = {
      name,
      email,
      password: hash
   }


   let ResObj = await authModel.create(obj)

   res.send({
      status: true,
      message: "resigtration successfully",
      //   ResObj

   })
}


let userDelete = async (req, res) => {

const token = req.headers.authorization.split(' ')[1]

 

let decode=jwt.verify(token,process.env.TokenKey)

let {userId}=decode



let data = await authModel.deleteOne({_id:userId})

   res.send({
      status: true,
      message: "Account Deleted Successfully",
      data
       

   })
}

module.exports = { loginData, RegData ,userDelete }