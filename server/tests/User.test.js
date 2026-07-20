import test from 'node:test';
import assert from 'node:assert/strict';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

test('User Model - password should not be rehashed if not modified', async (t) => {
  let hashCalled = false;
  
  // Mock bcrypt.hash to track if it gets called
  const originalHash = bcrypt.hash;
  bcrypt.hash = async (data, salt) => {
    hashCalled = true;
    return 'hashed_password';
  };

  // Mock document context
  const mockDoc = {
    password: 'existing_hashed_password',
    isModified: (field) => {
      if (field === 'password') return false; // simulate password not modified
      return true;
    }
  };

  // Extract the pre-save hook function
  const preSaveHooks = User.schema.s.hooks._pres.get('save');
  const myHook = preSaveHooks.find(h => h.fn.toString().includes('isModified'));
  const preSaveHook = myHook.fn;

  // Run the hook
  await preSaveHook.call(mockDoc, () => {
    // next() called
  });

  // Restore bcrypt
  bcrypt.hash = originalHash;

  // Verify hash was NOT called
  assert.equal(hashCalled, false, 'Password should not be hashed when isModified("password") is false');
});

test('User Model - password should be hashed if modified', async (t) => {
  let hashCalled = false;
  
  const originalHash = bcrypt.hash;
  bcrypt.hash = async (data, salt) => {
    hashCalled = true;
    return 'new_hashed_password';
  };

  const originalGenSalt = bcrypt.genSalt;
  bcrypt.genSalt = async () => 'salt';

  const mockDoc = {
    password: 'plain_password',
    isModified: (field) => {
      if (field === 'password') return true; // simulate password modified
      return false;
    }
  };

  const preSaveHooks = User.schema.s.hooks._pres.get('save');
  const myHook = preSaveHooks.find(h => h.fn.toString().includes('isModified'));
  const preSaveHook = myHook.fn;

  await preSaveHook.call(mockDoc, () => {
    // next() called
  });

  bcrypt.hash = originalHash;
  bcrypt.genSalt = originalGenSalt;

  assert.equal(hashCalled, true, 'Password should be hashed when isModified("password") is true');
  assert.equal(mockDoc.password, 'new_hashed_password', 'Document password should be updated with the hash');
});
