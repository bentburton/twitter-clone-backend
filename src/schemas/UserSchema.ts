import { gql } from 'apollo-server';

/**
 * @description holds user schema
 */

export const UserSchema = gql`
  type User {
    id: ID!
    username: String!
    token: String!
    avatar: String!
  }

  input RegisterUserInput {
    username: String!
    password: String!
  }

  input LoginUserInput {
    username: String!
    password: String!
  }

  extend type Query {
    users: [User!]!
    currentUser: User!
  }

  extend type Mutation {
    registerUser(input: RegisterUserInput!): User!
    loginUser(input: LoginUserInput): User!
  }
`;
