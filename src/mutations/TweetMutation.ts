import { Connection } from 'mongoose';
import { createTweet, commentOnTweet, retweet } from '../controllers/TweetController';
import { ITweet } from '../models/TweetModel';

/**
 * @description holds tweet mutations
 */

export const TweetMutation = {
  createTweet: {
    resolve: async (
      _parent: any,
      args: { input: ITweet },
      context: { dbConn: Connection; auth: string },
      _info: any,
    ) => {
      return createTweet({ connection: context.dbConn, auth: context.auth }, args.input);
    },
  },
  commentOnTweet: {
    resolve: async (
      _parent: any,
      args: { input: any },
      context: { dbConn: Connection; auth: string },
      _info: any,
    ) => {
      return commentOnTweet({ connection: context.dbConn, auth: context.auth }, args.input);
    },
  },
  retweet: {
    resolve: async (
      _parent: any,
      args: { id: string },
      context: { dbConn: Connection; auth: string },
      _info: any,
    ) => {
      return retweet({ connection: context.dbConn, auth: context.auth }, args.id);
    },
  },
};
