// Necessary imports
const { createUser, loginUser, renewToken, getAllUsers } = require('../controllers/auth');
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const Family = require("../models/family");
const mockingoose = require('mockingoose');

// Setting up mock for bcryptjs and jwt
bcryptjs.genSaltSync = jest.fn().mockReturnValue('test_salt');
bcryptjs.hashSync = jest.fn().mockReturnValue('hashed_password');
bcryptjs.compareSync = jest.fn().mockReturnValue(true);
jwt.sign = jest.fn().mockReturnValue('test_token');

// Mocking Express's response
const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

describe('UserController Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Manually reset mocks for each model
    mockingoose(User).reset();
    mockingoose(Family).reset();
  });

  describe('createUser', () => {
    it('should return error if email already exists', async () => {
      mockingoose(User).toReturn({ email: 'test@test.com' }, 'findOne');
      const req = { body: { email: 'test@test.com', password: '123', name: 'Test', familyId: '', familyName: 'Test Family', roleInFamily: 'Child' } };
      
      await createUser(req, resMock);

      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({ ok: false, msg: "User email already exists." });
    });


    it('should return error if trying to add user to non-existent family', async () => {
      mockingoose(User).toReturn(null, 'findOne');
      mockingoose(Family).toReturn(null, 'findOne');
      const req = { body: { email: 'newuser@test.com', password: '123', name: 'New User', familyId: 'nonexistent_family_id', familyName: '', roleInFamily: 'Parent' } };

      await createUser(req, resMock);

      expect(resMock.status).toHaveBeenCalledWith(404);
      expect(resMock.json).toHaveBeenCalledWith({ ok: false, msg: "Family not found" });
    });
  });

  describe('loginUser', () => {
    it('should return error if email does not exist', async () => {
      mockingoose(User).toReturn(null, 'findOne');
      const req = { body: { email: 'nonexistent@test.com', password: '123' } };

      await loginUser(req, resMock);

      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({ ok: false, msg: "User email does not exist" });
    });

    it('should return error if password is invalid', async () => {
      mockingoose(User).toReturn({ email: 'test@test.com', password: 'hashed_password' }, 'findOne');
      bcryptjs.compareSync.mockReturnValueOnce(false);
      const req = { body: { email: 'test@test.com', password: 'wrong_password' } };

      await loginUser(req, resMock);

      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.json).toHaveBeenCalledWith({ ok: false, msg: "Invalid password." });
    });

    


  describe('getAllUsers', () => {
    it('should return error if no users are found', async () => {
      const req = {};
      mockingoose(User).toReturn([], 'find');

      await getAllUsers(req, resMock);

      expect(resMock.status).toHaveBeenCalledWith(404);
      expect(resMock.json).toHaveBeenCalledWith({ ok: false, msg: "No users found." });
    });

    it('should return all users successfully', async () => {
      const req = {};
      mockingoose(User).toReturn([{name: 'User One'}, {name: 'User Two'}], 'find');

      await getAllUsers(req, resMock);

      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining({ users: expect.any(Array) }));
    });
  });
});
});
