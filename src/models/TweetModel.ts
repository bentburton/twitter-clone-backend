import { Schema, Document, SchemaTypes, Connection } from 'mongoose';

/**
 * @description holds tweet model
 */

/**
 * Comment interface
 */
export interface IComment extends Document {
  body: string;
  createdAt: string;
  user: string;
}

/**
 * comment schema
 */
const commentSchema = new Schema<IComment>({
  body: { type: SchemaTypes.String, required: true, unique: false },
  createdAt: { type: SchemaTypes.String, required: true, unique: false },
  user: { type: SchemaTypes.ObjectId, required: true, ref: 'user', unique: false },
});

/**
 * Tweet interface
 */
export interface ITweet extends Document {
  id: string;
  body?: string;
  createdAt: string;
  user: string;
  comments?: IComment[];
  transform: () => ITweet;
  retweet: string;
}

/**
 * tweet schema
 */
const tweetSchema = new Schema<ITweet>({
  body: { type: SchemaTypes.String, required: false, unique: false },
  createdAt: { type: SchemaTypes.String, required: false, unique: false },
  user: { type: SchemaTypes.ObjectId, required: true, ref: 'user', unique: false },
  comments: [commentSchema],
  retweet: { type: SchemaTypes.ObjectId, required: false, ref: 'tweet', unique: false },
});

// tweet collection name
const collectionName: string = 'tweet';

/**
 * transforms tweet object,
 * changes _id to id
 */
tweetSchema.methods.transform = function () {
  const obj = this.toObject();

  const id = obj._id;
  delete obj._id;
  obj.id = id;

  return obj;
};

/**
 * creates tweet model
 * @param conn database connection
 * @returns tweet model
 */
const TweetModel = (conn: Connection) => conn.model(collectionName, tweetSchema);

export default TweetModel;
