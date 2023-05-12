const ConversationModel = require("../models/ConversationModel");
const MessageModel = require("../models/MessageModel");
exports.conversation = async(req,res)=>{
    // console.log(req.body.senderId, req.body.receiverId);
    const newConversation = ConversationModel({
        members:[req.body.senderId, req.body.receiverId]
    })
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation)
    try{

    }catch(err){
      console.log(err);
        res.status(500).json(err)
    }
}


  
  exports.findConversation = async (req, res) => {
    // console.log("req.param.userId",req.params.userId);
    try {
      const conversation = await ConversationModel.find({
        members: { $in: [req.params.userId] },
      });
      return res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  }
exports.createMsz = async (req, res) => {
  // console.log("req.body", req.body);
  const newMessage = new MessageModel(req.body)
  try {
    const savedMessage = await newMessage.save()
   return res.status(200).json(savedMessage)
  } catch (err) {
    res.status(500).json(err);
  }
  }
  exports.allConversation =async (req, res) => {
    try {
      const conversation = await ConversationModel.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation)
    } catch (err) {
      res.status(500).json(err);
    }
  }
  