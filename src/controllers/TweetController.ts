import { ApolloError } from 'apollo-server';
import { Connection } from 'mongoose';
import TweetModel, { ITweet } from '../models/TweetModel';
import { getUserFromToken, AuthenticatedEndpointContext } from '../util/auth';

/**
 *
 * @description holds crud operations for the tweet entity
 */

/**
 * gets all tweets
 * @param connection database connection
 * @returns {ITweet[]} tweet list
 */
export const getAllTweets = async (connection: Connection) => {
  let list: ITweet[];

  try {
    list = await TweetModel(connection).find().sort({ createdAt: -1 });
    if (list != null && list.length > 0) {
      list = list.map(u => {
        return u.transform();
      });
    }
  } catch (error) {
    console.error('> getAllTweets error: ', error);
    throw new ApolloError('Error retrieving all tweets');
  }

  return list;
};

/**
 * gets tweet by id
 * @param connection database connection
 * @param id tweet id
 * @returns {ITweet | null} tweet or null
 */
export const getTweet = async (connection: Connection, id: string) => {
  let tweet: ITweet | null;

  try {
    tweet = await TweetModel(connection).findById(id);
    if (tweet != null) {
      tweet = tweet.transform();
    }
  } catch (error) {
    console.error('> getTweet error: ', error);
    throw new ApolloError(`Error retrieving tweet with id: ${id}`);
  }

  return tweet;
};

/**
 * creates tweet
 * @param connection database connection
 * @param args tweet
 * @returns {ITweet} created tweet
 */

export const createTweet = async (
  { connection, auth }: AuthenticatedEndpointContext,
  args: ITweet,
) => {
  let createdTweet: ITweet;

  const user = await getUserFromToken({ auth });

  try {
    const newTweet = args;
    newTweet.createdAt = new Date().toISOString();
    newTweet.user = user.id;

    createdTweet = (await TweetModel(connection).create(newTweet)).transform();
  } catch (error) {
    console.error('> createTweet error: ', error);
    throw new ApolloError(`Error saving tweet with body: ${args.body}`);
  }

  return createdTweet;
};

/**
 * updates tweet
 * @param connection database connection
 * @param args tweet
 * @returns {ITweet | null} updated tweet or null
 */

interface CommentOnTweetArgs {
  id: string;
  body: string;
}

export const commentOnTweet = async (
  { connection, auth }: AuthenticatedEndpointContext,
  { id, body }: CommentOnTweetArgs,
) => {
  let updatedTweet: any;

  const user = await getUserFromToken({ auth });

  try {
    updatedTweet = await TweetModel(connection).findByIdAndUpdate(
      id,
      {
        $push: { comments: { body, user: user.id, createdAt: new Date().toISOString() } },
      },
      { new: true },
    );

    if (updatedTweet != null) {
      updatedTweet = updatedTweet.transform();
    }
  } catch (error) {
    console.error('> Comment on tweet error: ', error);
    throw new ApolloError(`Error updating tweet with id: ${id}`);
  }

  return updatedTweet;
};

/**
 * creates retweet
 * @param connection database connection
 * @param args tweet
 * @returns {ITweet} created tweet
 */

export const retweet = async ({ connection, auth }: AuthenticatedEndpointContext, id: string) => {
  let createdTweet: ITweet;

  const user = await getUserFromToken({ auth });

  let tweet;
  try {
    tweet = await TweetModel(connection).findById(id);
  } catch (error) {
    console.error('> createTweet error: ', error);
    throw new ApolloError(`Error looking up tweet id: ${id}`);
  }

  if (!tweet) throw new ApolloError(`Tweet does not exist id: ${id}`);

  let previousRetweet;
  try {
    previousRetweet = await TweetModel(connection).find({ retweet: id, user: user.id });
  } catch (error) {
    console.error('> createTweet error: ', error);
    throw new ApolloError(`Error looking up retweet w/ id: ${id}`);
  }
  console.log(previousRetweet);
  if (previousRetweet && previousRetweet.length > 0)
    throw new ApolloError(`You have already retweeted this tweet`);

  try {
    const newTweet = {
      retweet: id,
      createdAt: new Date().toISOString(),
      user: user.id,
    };

    createdTweet = (await TweetModel(connection).create(newTweet)).transform();
  } catch (error) {
    console.error('> retweet error: ', error);
    throw new ApolloError(`Error retweeting tweet id:${id}`);
  }

  return createdTweet;
};
