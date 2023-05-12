const express = require("express")
const { registration, updateProfile, login, selectProfile, getUser } = require("../controllers/users")
const {requireSignIn} = require("../middlewares/AuthVerify")
const router = express.Router()


router.post("/registration", registration)
router.post("/login", login)
router.post("/updateProfile",requireSignIn, updateProfile)
router.get("/selectProfile",requireSignIn, selectProfile)
router.get("/user/:id", getUser)
module.exports = router ;
