const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport(
    {
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use true for port 465, false for port 587
        auth: {
            user:"deepakkushwaha5945@gmail.com",
            pass:"ehtfqvcfpcrizrhq" 
        }
    }
)

module.exports={transporter}














