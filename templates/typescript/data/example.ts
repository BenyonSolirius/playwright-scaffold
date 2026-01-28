import type { UserSchema } from './types';

// Ensure your test data is typed, for safety.
// Export each test data object individually and avoid default exports.
// The key is consistency, choose an approach and stick to it.

export const basic: UserSchema = {
  username: 'john_user',
  password: 'hunter12',
};

export const admin: UserSchema = {
  username: 'sarah_admin',
  password: 'p4ssw0rd!',
};
