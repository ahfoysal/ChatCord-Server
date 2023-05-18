const ConversationModel = require("../models/ConversationModel");
const UserModel = require("../models/UserModel");

exports.getUserConversations = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId).populate({
      path: "conversations.id",
      select: "_id members isGroupChat createdAt updatedAt lastMessage",
      populate: {
        path: "members.id",
        model: "Users",
        select: "_id name email photoUrl"
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};



// Get messages for a conversation based on page number
const getMessagesForPage = (conversation, pageNumber) => {
  // Sort messages in descending order based on their createdAt field
  conversation.messages.sort((a, b) => b.createdAt - a.createdAt);

  // Set the number of messages per page
  const messagesPerPage = 50;

  // Calculate the starting and ending indexes for the messages to return
  const startIndex = (pageNumber - 1) * messagesPerPage;
  const endIndex = startIndex + messagesPerPage;

  // Slice the messages array to get only the messages for the current page
  const messagesForPage = conversation.messages.slice(startIndex, endIndex);

  return messagesForPage;
};

// Sort messages for a conversation
const sortConversationMessages = (conversation) => {
  conversation.messages.sort((a, b) => b.createdAt - a.createdAt);
};

// Create a new message for a conversation
exports.createMessage = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.conversationId || !req.body.text || !req.body.senderId) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Check if conversation exists
    const conversation = await ConversationModel.findById(
      req.body.conversationId
    ).populate("members.id");
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Create new message object
    const newMessage = {
      text: req.body.text,
      senderId: req.body.senderId,
      messageType: req.body.messageType || "text",
      createdAt: Date.now(), // Set createdAt field to current time
    };

    // Update conversation with new message
    const savedMessage = await ConversationModel.findByIdAndUpdate(
      req.body.conversationId,
      {
        $push: { messages: newMessage },
        $set: {
          updatedAt: Date.now(),
          lastMessage: newMessage,
        },
      },
      { new: true }
    )
      .populate("members.id")
      .exec();

    // Sort messages for the updated conversation
    sortConversationMessages(savedMessage);

    // Get messages for the first page
    const messagesForPage = getMessagesForPage(savedMessage, 1);

    // Return the updated conversation object with messages for the first page
    return res.status(200).json({
      conversation: {
        ...savedMessage.toObject(),
        messages: messagesForPage,
      },
      currentPage: 1,
      totalPages: Math.ceil(savedMessage.messages.length / 50),
    });
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
      $and: [{ "members.id": Sender }, { "members.id": Receiver }],
    });
    if (conversation) {
      return res.status(400).json({
        message: "Conversation already exists",
        conversation,
      });
    }

    // Create a new conversation
    const newConversation = new ConversationModel({
      members: [{ id: Sender }, { id: Receiver }],
    });

    const savedConversation = await newConversation.save();

    // Push the conversation id to both members
    const conversationId = savedConversation._id;

    await UserModel.updateMany(
      { _id: { $in: [Sender, Receiver] } },
      { $push: { conversations: { id: conversationId } } }
    );

    return res.status(200).json(savedConversation);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Get messages for a conversation based on page number
exports.findConversation = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.page || 1);

    // Check if conversation exists
    const conversation = await ConversationModel.findById(req.params.id)
      .populate("members.id")
      .exec();
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Get messages for the requested page
    const messagesForPage = getMessagesForPage(conversation, pageNumber);

    return res.status(200).json({
      conversation: {
        ...conversation.toObject(),
        messages: messagesForPage,
      },
      currentPage: pageNumber,
      totalPages: Math.ceil(conversation.messages.length / 50),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new conversation between two users


