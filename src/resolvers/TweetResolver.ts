import { IResolvers } from 'apollo-server';
import { TweetQuery } from '../queries/TweetQuery';
import { TweetMutation } from '../mutations/TweetMutation';
import { getUser } from '../controllers/UserController';
import { ITweet } from '../models/TweetModel';
import { getTweet } from '../controllers/TweetController';
/**
 * @description holds tweet resolver
 */

export const TweetResolver: IResolvers = {
  NormalTweet: {
    user: async (tweet, _args, context) => {
      return getUser(context.dbConn, tweet.user);
    },
  },
  Retweet: {
    user: async (tweet, _args, context) => {
      return getUser(context.dbConn, tweet.user);
    },
    retweet: async (tweet, _args, context) => {
      return getTweet(context.dbConn, tweet.retweet);
    },
  },
  Comment: {
    user: async (tweet, _args, context) => {
      return getUser(context.dbConn, tweet.user);
    },
  },
  Tweet: {
    __resolveType(obj: ITweet) {
      if (obj?.retweet) {
        return 'Retweet';
      }
      return 'NormalTweet';
    },
  },
  Query: TweetQuery,
  Mutation: TweetMutation,
};
