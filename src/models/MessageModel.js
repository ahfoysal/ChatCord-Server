const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true
    },
    senderId: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    messageType: {
      type: String,
      enum: ["text", "image", "emoji"],
      default: "text"
    }
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", MessageSchema);

module.exports = MessageModel;
