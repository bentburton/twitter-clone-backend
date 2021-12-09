import mongoose from 'mongoose';
import { ApolloError } from 'apollo-server';
import dotenv from 'dotenv';

/**
 * @description holds database connection provider
 */

dotenv.config();

// connection uri
const uri: string = process.env.MONGO_DB_PATH as string;
if (!uri) throw new ApolloError('Missing Mongo URI');

// mongoose connection
let conn: mongoose.Connection | null = null;

/**
 * creates database connection
 * @returns mongodb connection
 */
export const getConnection = async (): Promise<mongoose.Connection> => {
  if (conn == null) {
    conn = await mongoose.createConnection(uri, {
      bufferCommands: false,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }
  return conn;
};
