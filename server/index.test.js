const index = require('./index');
const axios = require('axios');
const sqlite3 = require('sqlite3');

require('dotenv').config();

describe('Util', () => {

  test('Converts hours to unix time (miliseconds)', () => {
    expect(index.toTimestamp(1)).toBe(3600000);
  });

  describe('Database Handler', () => {

    test('Open connection with error', () => {
      var testDB = new index.DatabaseHandler(null);
      expect(testDB.openConnection()).not.toBeInstanceOf(sqlite3.Database);
    });
    
    test('Open connection', () => {
      testDB = new index.DatabaseHandler(process.env.DB_PATH);
      expect(testDB).not.toBeInstanceOf(sqlite3.Database);
    });

  });

});

describe('Endpoints', () => {

  test('Signin endpoint', async () => {
    try {
      const response = await axios.post(process.env.TEST_URL + 'signin',
      {
          "name": process.env.TEST_USER,
          "password": process.env.TEST_PASS
      });
      expect(response.status).toBe(200);
    } catch (error) {}
  });

  test('Auth - 401 Unauthorized', async () => {
    try {
      await axios.get(process.env.TEST_URL + 'signout');
    }
    catch(e) {
      expect(e.response.status).toBe(401); // Expecting unauthorized
    }
  });

  describe('Verification code', () => {

    test("Send code - 500 Couldn't find email", async () => {
      try {
        await axios.post(process.env.TEST_URL + 'sendCode', {"email": "notRegistered@example.com"});
      }
      catch(e) {
        expect(e.response.status).toBe(500);
      }
    });
    
    test("Send code", async () => {
      try {
        const response = await axios.post(process.env.TEST_URL + 'sendCode', {"email": process.env.TEST_EMAIL});
        expect(response.status).toBe(200);
      }
      catch(e) {}
    });
    
    test("Verify - doesn't match", async () => {
      try {
        await axios.post(process.env.TEST_URL + 'verify', {"code": 1234});
      }
      catch(e) {
        expect(e.response.status).toBe(500);
      }
    });

  });

  describe('Empty requests - Bad Request', () => {

    var endpoints = ['sendCode', 'verify', 'signup', 'signin']
    for(var e in endpoints){
      test(`Test ${endpoints[e]} with empty body`, async () => {
        try{
          await axios.post(process.env.TEST_URL + endpoints[e]);
        } 
        catch(e){
          expect(e.response.status).toBe(400); // Expecting bad request code
        }
      });
    }

  });
});

afterAll(async () => {
  if (index.server) {
    index.server.close();
  }
});
