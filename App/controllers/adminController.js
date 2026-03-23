const { usersModel } = require("../models/users.model")
let bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const { authModel } = require("../models/admin.model");
const { transporter } = require("../config/config");

let myOtp = new Map()

let loginData = async (req, res) => {

   try {
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
   } catch (error) {
      console.log("❌ Login Error:", error.message);
      res.send({
         status: false,
         message: "Login failed: " + error.message
      })
   }

}



// let RegData = async (req, res) => {

//    try {
//       let { name, email, password } = req.body
//       let existingUser = await authModel.findOne({email })
//       console.log(existingUser);
//       if (existingUser) {
//          return  res.send({
//             status: false,
//             message: "Email already exists"
//          });
//       }

//       const hash = bcrypt.hashSync(password, 10);

//       let obj = {
//          name,
//          email,
//          password: hash
//       }


//       let ResObj = await authModel.create(obj)

//       res.send({
//          status: true,
//          message: "resigtration successfully",
//          //   ResObj

//       })
//    } catch (error) {
//       console.log("❌ Registration Error:", error.message);
//       res.send({
//          status: false,
//          message: "Registration failed: " + error.message
//       })
//    }
// }
let RegData = async (req, res) => {
   try {
      let { name, email, password } = req.body;

      // 👉 check email exists
      let existingUser = await authModel.findOne({ email });

      if (existingUser) {
         return res.status(400).send({
            status: false,
            message: " Email already exists, please login"
         });
      }

      // 👉 hash password
      const hash = bcrypt.hashSync(password, 10);

      // 👉 create user
      let user = await authModel.create({
         name,
         email,
         password: hash
      });

      return res.status(201).send({
         status: true,
         message: "Registration successfully",
         user
      });

   } catch (error) {

      // 👉 handle duplicate key error (IMPORTANT)
      if (error.code === 11000) {
         return res.status(400).send({
            status: false,
            message: " Email already exists"
         });
      }

      console.log("Registration Error:", error.message);

      return res.status(500).send({
         status: false,
         message: "Registration failed: " + error.message
      });
   }
};


let userDelete = async (req, res) => {

   try {
      const token = req.headers.authorization.split(' ')[1]

      let decode = jwt.verify(token, process.env.TokenKey)

      let { userId } = decode

      let data = await authModel.deleteOne({ _id: userId })

      res.send({
         status: true,
         message: "Account Deleted Successfully",
         data
      })
   } catch (error) {
      console.log("❌ Delete Error:", error.message);
      res.send({
         status: false,
         message: "Delete failed: " + error.message
      })
   }
}

let sendOtp = async (req, res) => {

   try {
      let { email } = req.body




      let user = await authModel.findOne({ email })

      if (user) {
         let otp = Math.floor(Math.random() * 9999999).toString().slice(0, 6);
         myOtp.set('backendOtp', otp)
         myOtp.set('email', email)



         try {
            await transporter.sendMail({
               from: `"Enquiry Management System" <deepakkushwaha5945@gmail.com>`,
               to: email,
               subject: "Enquiry Management System - OTP",
               html: `
  <div style="background-color:#f3f4f6; padding:40px 0; font-family:Arial, sans-serif;">
    
    <div style="max-width:500px; margin:auto; background:#ffffff; border-radius:12px; padding:30px; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      
      <h1 style="color:#4f46e5; margin-bottom:5px;">
        Enquiry Management System
      </h1>

      <p style="color:#6b7280; font-size:14px;">
        Password Reset Request
      </p>

      <h2 style="color:#111827; margin:20px 0;">
        🔐 Your OTP Code
      </h2>

      <div style="margin:25px 0;">
        <span style="display:inline-block; background:#4f46e5; color:#ffffff; padding:15px 40px; font-size:28px; letter-spacing:6px; border-radius:10px; font-weight:bold;">
          ${otp}
        </span>
      </div>

      <p style="color:#6b7280; font-size:14px;">
        This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone.
      </p>

      <p style="color:#9ca3af; font-size:12px; margin-top:20px;">
        If you did not request this, you can safely ignore this email.
      </p>

      <hr style="margin:25px 0; border:none; border-top:1px solid #e5e7eb;" />

      <p style="font-size:12px; color:#9ca3af;">
        © ${new Date().getFullYear()} Enquiry Management System
      </p>

    </div>
  </div>
  `
            });



            res.send({
               status: true,
               message: "Otp sent successfully..",
               // otp
            })
         } catch (emailError) {
            console.log("❌ Email send error:", emailError.message);
            res.send({
               status: false,
               message: "Failed to send OTP: " + emailError.message
            })
         }
      }
      else {
         res.send({
            status: false,
            message: "User Email doesn't exist "
         })
      }
   } catch (error) {
      console.log("❌ OTP Request Error:", error.message);
      res.send({
         status: false,
         message: "OTP request failed: " + error.message
      })
   }
}

let varifyOtp = async (req, res) => {

   try {
      let { myOTP } = req.body

      // console.log(myOTP, "otp hai ye");

      let backendOtp = myOtp.get('backendOtp')
      if (myOTP.length !== 6) {
         return res.send({
            status: false,
            message: "Please fill all 6 digits of OTP"
         })
      }
      if (backendOtp === myOTP) {
         res.send({
            status: true,
            message: "OTP varified successfully..."
         })
      }
      else {
         res.send({
            status: false,
            message: "Invalid OTP"
         })
      }
   } catch (error) {
      console.log("❌ OTP Verification Error:", error.message);
      res.send({
         status: false,
         message: "Error verifying OTP: " + error.message
      })
   }

}

let changePass = async (req, res) => {

   let { newpas, confirmpas } = req.body

   try {
      let email = myOtp.get('email')
      let user = await authModel.findOne({ email })

      // console.log(user);


      if (user) {

         if (newpas == confirmpas) {

            // 👉 hash password
            const hash = bcrypt.hashSync(newpas, 10)

            // 👉 update password
            await authModel.updateOne({ email },
               { $set: { password: hash } }
            )

            // 👉 cleanup
            myOtp.delete(email)

            res.send({
               status: true,
               message: "Password changed successfully"
            })
         }
         else {
            res.send({
               status: false,
               message: "password doesn't matched..",
            })
         }

      }
      else {
         res.send({
            status: false,
            message: "Account doesn't Exist.."
         })
      }

   } catch (error) {
      console.log("❌ Change Password Error:", error.message);
      res.send({
         status: false,
         message: "Password change failed: " + error.message
      })
   }
}









module.exports = {
   loginData, RegData,
   userDelete, sendOtp, changePass, varifyOtp
}