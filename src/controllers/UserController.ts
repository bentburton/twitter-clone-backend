import { ApolloError } from 'apollo-server';
import { Connection } from 'mongoose';
import bcrypt from 'bcryptjs';
import UserModel, { IUser } from '../models/UserModel';
import { generateToken } from '../util/auth';

/**
 *
 * @description holds crud operations for the user entity
 */

/**
 * gets all users
 * @param connection database connection
 * @returns {IUser[]} user list
 */
export const getAllUsers = async (connection: Connection) => {
  let list: IUser[];

  try {
    list = await UserModel(connection).find();
    if (list != null && list.length > 0) {
      list = list.map(u => {
        return u.transform();
      });
    }
  } catch (error) {
    console.error('> getAllUsers error: ', error);
    throw new ApolloError('Error retrieving all users');
  }

  return list;
};

/**
 * gets all users
 * @param connection database connection
 * @returns {IUser[]} user list
 */
export const getUser = async (connection: Connection, id: String) => {
  let user: IUser | null;

  try {
    user = await UserModel(connection).findById(id);
    if (user != null) {
      user = user.transform();
    }
  } catch {
    throw new ApolloError(`Error retrieving user with id: ${id}`);
  }

  return user;
};

/**
 * gets user by id
 * @param connection database connection
 * @param id user id
 * @returns {IUser | null} user or null
 */
interface LoginUserArgs {
  username: string;
  password: string;
}
export const loginUser = async (connection: Connection, args: LoginUserArgs) => {
  let user: IUser | null;

  try {
    user = await UserModel(connection).findOne({ username: args.username });

    if (user != null) {
      user = user.transform();
    }
  } catch (error) {
    console.error('> loginUser error: ', error);
    throw new ApolloError(`Error retrieving user with username: ${args.username}`);
  }

  if (!user) {
    throw new Error(`User: ${args.username} does not exist`);
  }

  const passwordCorrect = await bcrypt.compare(args.password, user.password);
  if (!passwordCorrect) throw new ApolloError('Password is incorrect');

  user.token = generateToken({ id: user.id, username: user.username });

  return user;
};

/**
 * creates user
 * @param connection database connection
 * @param args user
 * @returns {IUser} created user
 */
export const registerUser = async (connection: Connection, args: IUser) => {
  let createdUser: IUser;

  let existingUser;

  try {
    existingUser = await UserModel(connection).findOne({ username: args.username });
  } catch (error) {
    console.error('> createUser error checking if user already exists', error);
  }

  if (existingUser) throw new ApolloError('Username is already taken');

  try {
    const newUser = args;
    newUser.password = await bcrypt.hash(args.password, 10);
    createdUser = (await UserModel(connection).create(newUser)).transform();

    createdUser.token = generateToken({ id: createdUser.id, username: createdUser.username });
  } catch (error) {
    console.error('> createUser error: ', error);
    throw new ApolloError(`Error saving user with username: ${args.username}`);
  }

  return createdUser;
};
