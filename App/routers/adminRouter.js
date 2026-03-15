let express=require('express');
const { userRouter } = require('./userRouter');
const { loginData, RegData } = require('../controllers/adminController');
let adminRouter=express.Router();

adminRouter.use('/user',userRouter)
// http://localhost:8000/admin/user

 

adminRouter.post('/login',loginData)
// http://localhost:8000/admin/login

adminRouter.post('/registration',RegData)

module.exports={adminRouter}