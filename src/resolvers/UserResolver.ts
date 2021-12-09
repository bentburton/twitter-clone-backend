import { IResolvers } from 'apollo-server';
import { UserQuery } from '../queries/UserQuery';
import { UserMutation } from '../mutations/UserMutation';

/**
 * @description holds user resolver
 */

export const UserResolver: IResolvers = {
  Query: UserQuery,
  Mutation: UserMutation,
};
