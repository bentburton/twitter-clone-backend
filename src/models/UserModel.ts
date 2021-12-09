import { Schema, Document, SchemaTypes, Connection } from 'mongoose';

/**
 * @description holds user model
 */

/**
 * User interface
 */
export interface IUser extends Document {
  id: string;
  username: string;
  password: string;
  transform: () => IUser;
  token: string;
}

/**
 * user schema
 */
const schema = new Schema<IUser>({
  username: { type: SchemaTypes.String, required: true, unique: true },
  password: { type: SchemaTypes.String, required: true },
});

// user collection name
const collectionName: string = 'user';

/**
 * transforms user object, removes password and
 * changes _id to id
 */
schema.methods.transform = function () {
  const obj = this.toObject();

  const id = obj._id;
  delete obj._id;
  obj.id = id;

  return obj;
};

/**
 * creates user model
 * @param conn database connection
 * @returns user model
 */
const UserModel = (conn: Connection) => conn.model(collectionName, schema);

export default UserModel;
