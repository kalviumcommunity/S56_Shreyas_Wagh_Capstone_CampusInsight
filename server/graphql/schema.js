const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    users: [User]
    user(id: ID, username: String): User
    messages: [Message]
    message(id: ID!): Message
  }

  type User {
    id: ID!
    firstName: String
    lastName: String
    email: String
    username: String
    likedMessages: [ID]
    bookmarkedMessages: [ID]
  }

  type Message {
    id: ID!
    message: String
    timestamp: String
    likes: Int
    username: String
    bookmarks: [String]
    imageUrl: String
    imagePublicId: String
  }

  type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      username: String!
    ): User
    createMessage(message: String!, username: String!): Message
    updateUser(
      id: ID!
      firstName: String
      lastName: String
      email: String
      username: String
    ): User
    deleteUser(id: ID!): User
    updateMessage(id: ID!, message: String!): Message
    deleteMessage(id: ID!): Message
  }
`;

module.exports = typeDefs;