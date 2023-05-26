const ConversationModel = require("../models/ConversationModel");
const UserModel = require("../models/UserModel");
const MessageModel = require("../models/MessageModel");
///////
exports.discoverUsers = async (req, res) => {
  try {
    const userId = req.params.id; 
    console.log(userId);
    const currentUser = await UserModel.findById(userId);
    if(!userId) return

    // Get an array of friend IDs or an empty array if user has no friends
    const friendIds = currentUser?.friends?.map((friendId) => friendId.toString()) || [];
    console.log(friendIds);

    // Fetch all users except the current user and their friends
    const users = await UserModel.find({
      _id: { $ne: userId },
      _id: { $nin: friendIds } 
     
        }).select("_id name email photoUrl isActive updatedAt")

    return res.status(200).json( users );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.createFriend = async (req, res) => {
  try {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;

    // Update sender's friend list with receiver's ID
    const updatedSender = await UserModel.findByIdAndUpdate(
      senderId,
      { $addToSet: { friends: receiverId } },
      { new: true }
    );

    // Update receiver's friend list with sender's ID
    const updatedReceiver = await UserModel.findByIdAndUpdate(
      receiverId,
      { $addToSet: { friends: senderId } },
      { new: true }
    );

    // Check if both users were successfully updated
    if (!updatedSender || !updatedReceiver) {
      throw new Error("Failed to update users");
    }

    // Return updated friend lists in the response
    const response = {
      friends: [updatedSender.friends || [], updatedReceiver.friends || []],
    };
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/////
exports.findConversation = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.page || 1);
    const skip = (pageNumber - 1) * 100;

    // Check if conversation exists
    const conversation = await ConversationModel.findById(req.params.id)
      .populate({
        path: "members",
        select: "_id name email photoUrl isActive updatedAt",
      })
      .exec();
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    const messages = await MessageModel.find({ conversationId: req.params.id })
      .sort({ createdAt: -1 }) // sort messages in descending order of creation date
      .skip(skip) // skip the first (pageNumber - 1) * 100 messages
      .limit(100) // limit the result to 100 messages
      .exec();
    conversation.messages = messages;
    // console.log(messages);
    // Get messages for the requested page

    return res.status(200).json(conversation);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
//////

//////

exports.createMessage = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.conversationId || !req.body.text || !req.body.senderId) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Check if message sender exists
    const sender = await UserModel.findById(req.body.senderId);
    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    // Create new message object
    const newMessage = new MessageModel({
      conversationId: req.body.conversationId,
      senderId: req.body.senderId,
      text: req.body.text,
      messageType: req.body.messageType || "text",
    });
    const savedMessage = await newMessage.save();

    const conversation = await ConversationModel.findByIdAndUpdate(
      req.body.conversationId,
      { lastMessage: savedMessage._id },
      { new: true }
    );
    // Save message in the database

    // Return success response
    return res.status(200).json({ conversation, newMessage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    console.log(req.params.userId);
    const user = await UserModel.findById(req.params.userId)
      .select("-password")
      .populate([
        {
          path: "conversations",
          populate: [
            {
              path: "members",
              model: "User",
              select: "_id name email photoUrl isActive updatedAt",
            },
            {
              path: "lastMessage",
              model: "Message",
            },
          ],
        },
        {
          path: "friends",
          select: "_id name email photoUrl isActive updatedAt",
        },
      ])
      .exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.createConversation = async (req, res) => {
  try {
    const Sender = req.body.Sender;
    const Receiver = req.body.Receiver;

    // Check if a conversation already exists between the two members
    const conversation = await ConversationModel.findOne({
      $and: [{ members: Sender }, { members: Receiver }],
    });
    if (conversation) {
      return res.status(200).json({
        message: "Conversation already exists",
        conversation,
      });
    }

    // Create a new conversation
    const newConversation = new ConversationModel({
      members: [Sender, Receiver],
    });

    const savedConversation = await newConversation.save();

    // Push the conversation id to both members
    await UserModel.updateMany(
      { _id: { $in: [Sender, Receiver] } },
      { $push: { conversations: savedConversation._id } }
    );

    // Return only the conversation id in the response
    const response = { conversations: { _id: savedConversation._id } };
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get messages for a conversation based on page number

// Create a new message for a conversation

// Get messages for a conversation based on page number

// Create a new conversation between two users
