import { EntitySchema } from 'typeorm';

/**
 * TypeORM UserSchema
 * Defines the database table structure for users
 * Separated from domain entity to maintain persistence ignorance
 */
export interface UserModel {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new EntitySchema<UserModel>({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
    },
    email: {
      type: 'varchar',
      length: 255,
      unique: true,
    },
    name: {
      type: 'varchar',
      length: 100,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp',
      updateDate: true,
    },
  },
});
