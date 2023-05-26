const express = require("express")
const { createConversation, findConversation, createMessage, getUserConversations, createFriend, discoverUsers } = require("../controllers/conversation");
const router = express.Router()


router.post("/newConversation", createConversation)
router.post("/newfriend", createFriend)
router.get("/discover/:id", discoverUsers)
router.get("/conversation/:id", findConversation);
router.post("/newmessage", createMessage)
router.get("/user/:userId", getUserConversations)



module.exports = router ;
