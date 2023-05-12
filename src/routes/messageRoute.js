const express = require("express")
const { getMessage, newMessage, createMessage } = require("../controllers/message");
const MessageModel = require("../models/MessageModel");
const router = express.Router()


router.post("/message", async (req, res) => {
    // console.log("req.body", req.body);
    const newMessage = new MessageModel(req.body)
    try {
      const savedMessage = await newMessage.save()
     return res.status(200).json(savedMessage)
    } catch (err) {
      res.status(500).json(err);
    }
    });
router.get("/all", async (req, res) => {
       
            try {
              const messages = await MessageModel.find({})
             return res.status(200).json(messages)
            } catch (err) {
              res.status(500).json(err);
            }
            });
        
        

router.get("/messages/:conversationId", async (req, res) => {
    // console.log(req.params);
    try {
      const messages = await MessageModel.find({
        conversationId: req.params.conversationId,
      });
      return  res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router ;
