const router = require("express").Router();
const ConversationModel = require("../models/ConversationModel");
const MessageModel = require("../models/MessageModel");

//add
// exports.createMessage = 

//get
exports.getMessage = async (req, res) => {
       
    try {
      const messages = await MessageModel.find({})
     return res.status(200).json(messages)
    } catch (err) {
      res.status(500).json(err);
    }
    }

module.exports = router;