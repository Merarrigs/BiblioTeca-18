import { gql } from 'graphql-tag';

const typeDefs = gql`

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  input UserInput {
    username: String
    email: String
    password: String
  }

  input BookInput {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
    
  type Auth {
    token: ID!
    user: User
  }
    
  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(input: UserInput!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
  }

`;

export default typeDefs;