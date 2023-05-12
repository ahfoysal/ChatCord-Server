const express = require("express")
const { conversation, findConversation, allConversation, createMsz } = require("../controllers/conversation");
const { getMessage, newMessage, createMessage } = require("../controllers/message");
const router = express.Router()


router.post("/newConversation", conversation)
router.get("/conversation/:userId", findConversation);
router.get("/conversations/:firstUserId/:secondUserId", allConversation );
router.post("/createMsz", createMsz)
// router.post("/messages", newMessage)
// router.get("/message/:conversationId",()=> getMessage);

module.exports = router ;
