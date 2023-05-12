const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");


  exports.requireSignIn = (req, res, next) => {
    let token = req.headers["token"]
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).json({
                message:"Unauthorized"
            })
        } else {
            let email = decoded
            ["data"]
            req.headers.email = email
            next()
        }
    })
}

 exports.isAdmin = async (req, res, next) => {
     try {
         const email = req.headers.email;
         const user = await UserModel.findOne({email:email});
        if (user.role !== 1) {
            return res.status(401).json({
                message:"Unauthorized"
            })
        } else {
            next()
        }

    } catch (err) {
        console.log(err);
    }
 }


