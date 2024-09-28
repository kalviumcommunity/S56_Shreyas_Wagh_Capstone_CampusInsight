const { Details } = require("../models/Users");
const { message } = require("../models/Messages");

const resolvers = {
  Query: {
    users: async () => await Details.find(),
    user: async (_, { id, username }) => {
      if (id) return await Details.findById(id);
      if (username) return await Details.findOne({ username });
      throw new Error("Error fetching users");
    },
    messages: async () => await message.find(),
    message: async (_, { id }) => await message.findById(id),
  },
  Mutation: {
    createUser: async (
      _,
      { firstName, lastName, email, password, username }
    ) => {
      const newUser = new Details({
        firstName,
        lastName,
        email,
        password,
        username,
      });
      return await newUser.save();
    },
    createMessage: async (_, { message: msg, username }) => {
      const newMessage = new message({ message: msg, username });
      return await newMessage.save();
    },
    updateUser: async (_, { id, firstName, lastName, email, username }) => {
      const updatedUser = await Details.findByIdAndUpdate(
        id,
        { firstName, lastName, email, username },
        { new: true }
      );
      return updatedUser;
    },
    deleteUser: async (_, { id }) => {
      const deletedUser = await Details.findByIdAndDelete(id);
      return deletedUser;
    },
    updateMessage: async (_, { id, message: msg }) => {
      const updatedMessage = await message.findByIdAndUpdate(
        id,
        { message: msg },
        { new: true }
      );
      return updatedMessage;
    },
    deleteMessage: async (_, { id }) => {
      const deletedMessage = await message.findByIdAndDelete(id);
      return deletedMessage;
    },
  },
};

module.exports = resolvers;