const { usersModel } = require("../models/users.model");

let createData = async (req, res) => {
    try {

        let { username, userEmail, mobileNumber } = req.body


        let obj = {
            username,
            userEmail,
            mobileNumber
        }

        //  console.log(obj.mobileNumber.length);

        if (obj.mobileNumber.length < 10) {


            return res.send({
                staus: false,
                message: "Mob number length is lesser than 10 digit"
            })
        }

        if (obj.mobileNumber.length > 10) {


            return res.send({
                staus: false,
                message: "Mob number length is greater than 10 digit"
            })
        }


        let Resobj = await usersModel.create(obj)




        res.send({
            status: true,
            message: "  added data successful",
            Resobj

        })



    }
    catch (err) {



        if (err.code === 11000) {
            let field = Object.keys(err.keyValue)[0];   // userEmail / mobileNumber


            let message = "Duplicate value";

            if (field === "userEmail") {
                message = "Email already exists";
            }

            if (field === "mobileNumber") {
                message = "mobileNumber already exists";
            }



            return res.send({
                status: false,
                message

            });

        }


        res.send({
            staus: false,
            message: err.message,
            error: err
        })






    }


}



let viewData = async (req, res) => {

    let Resobj = await usersModel.find()


    res.send({
        status: true,
        message: "view data successful",
        Resobj
    })
}

let delData = async (req, res) => {

    let { id } = req.params;

    let Resobj = await usersModel.deleteOne({ _id: id })

    res.send({
        status: true,
        message: "deleted data successful",
        // Resobj
    })
}

let multidelData = (req, res) => {

    res.send({
        status: true,
        message: "deleted data successful"
    })
}

let updateData = async (req, res) => {

    try {
        let {id}=req.body
        
         
        
        let Resobj = await usersModel.updateOne(
            {_id:id},
            {$set:req.body}
         )

        res.send({
            status: true,
            message: "updated data successful",
            Resobj
        })
    }
    catch (err) {
        res.send({
            status: false,
            err

        })
    }

}




module.exports = { createData, viewData, delData, updateData }