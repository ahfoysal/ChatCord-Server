const mongoose = require("mongoose");

 const messageSchema = new mongoose.Schema(
  {
    text: { type: String },
    createdAt: { type: Date, default: Date.now },
    senderId: {
      type: String,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "emoji"],
      default: "text"
    }
  },
  { _id: false }
);

const memberSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    members: [memberSchema],
    isGroupChat: { 
      type: Boolean,
      default: false
    },
    messages: [messageSchema],
    
    lastMessage: { type: messageSchema  }
  },
  { timestamps: true }
);

const ConversationModel = mongoose.model('Conversation', conversationSchema);

module.exports = ConversationModel;
