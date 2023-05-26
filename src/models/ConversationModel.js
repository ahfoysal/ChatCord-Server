const mongoose = require("mongoose");


const conversationSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);


const ConversationModel = mongoose.model("Conversation", conversationSchema);

module.exports = ConversationModel;
