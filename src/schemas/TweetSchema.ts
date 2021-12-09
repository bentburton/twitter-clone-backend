import { gql } from 'apollo-server';

/**
 * @description holds tweet schema
 */

export const TweetSchema = gql`
  type Comment {
    body: String!
    user: User!
    createdAt: String!
  }

  union Tweet = NormalTweet | Retweet

  type NormalTweet {
    id: ID!
    body: String!
    createdAt: String!
    user: User!
    comments: [Comment]!
  }

  type Retweet {
    id: ID!
    createdAt: String!
    user: User!
    retweet: NormalTweet!
  }

  input CreateTweetInput {
    body: String!
  }

  input CommentOnTweetInput {
    id: String!
    body: String!
  }

  extend type Query {
    tweets: [Tweet]
    tweet(id: String!): Tweet
  }

  extend type Mutation {
    createTweet(input: CreateTweetInput!): NormalTweet
    retweet(id: String): Retweet
    commentOnTweet(input: CommentOnTweetInput!): NormalTweet
  }
`;
