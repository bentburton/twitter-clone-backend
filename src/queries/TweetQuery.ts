import { getAllTweets } from '../controllers/TweetController';

/**
 * @description holds tweet queries
 */

export const TweetQuery = {
  tweets: {
    resolve: async (_parent: any, _args: any, context: { dbConn: any }, _info: any) => {
      return getAllTweets(context.dbConn);
    },
  },
};
