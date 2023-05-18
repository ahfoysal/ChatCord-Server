const express = require("express")
const { createConversation, findConversation, createMessage, getUserConversations } = require("../controllers/conversation");
const router = express.Router()


router.post("/newConversation", createConversation)
router.get("/conversation/:id", findConversation);
router.post("/newmessage", createMessage)
router.get("/user/:userId", getUserConversations)



module.exports = router ;
