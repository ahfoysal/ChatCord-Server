const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    photoUrl: {
      type: String,
      default:
        "https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Part_I.png/revision/latest/scale-to-width-down/1200?cb=20210223094656",
    },
    conversations: [conversationSchema],
    lastActiveTime: { type: Date },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

const UserModel = mongoose.model("Users", UserSchema);

module.exports = UserModel;
