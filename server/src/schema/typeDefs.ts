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

  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }


  type Auth {
    token: String
    user: User
  }

  
  input BookInput {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(input: UserInput!): Auth
    saveBook(bookInfo: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

 export default typeDefs;