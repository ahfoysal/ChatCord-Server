const mongoose = require("mongoose");

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
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
    },
    deviceId: { type: String },
    conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Conversation" }],
    isPage: {
      type: Boolean,
      default: false,
    },
    lastActiveTime: { type: Date },
    isActive: { type: Boolean, default: false },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true }]
  },
  { timestamps: true, versionKey: false }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
