const { Details } = require("../models/Users");
const { message } = require("../models/Messages");

const resolvers = {
  Query: {
    users: async () => await Details.find(),
    user: async (_, { id, username }) => {
      if (id) return await Details.findById(id);
      if (username) return await Details.findOne({ username });
      throw new Error("Please provide either id or username");
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
  },
};

module.exports = resolvers;
