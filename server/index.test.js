const index = require('./index');
const axios = require('axios');
const exp = require('constants');
const sqlite3 = require('sqlite3');

require('dotenv').config();

// Helper function to create a session in the server
async function signin() {
  try {
    const response = await axios.post(process.env.TEST_URL + 'signin',
    {
        "name": process.env.TEST_USER,
        "password": process.env.TEST_PASS
    });
    return response.status;
  } catch (error) {
    console.error(error);
  }
}

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
    expect(await signin()).toBe(200);
  });

  describe('Empty requests', () => {

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

// TODO: test and add to defectos encontrados: not all scenarios were handled
// TODO: test

// ENDPOINTS



// TODO: test

// TODO: test w empty 
// TODO: test w empty 
// TODO: test w empty 
// TODO: test w empty 
// TODO: test w empty 


// DEFECTOS
/*
  Revealed secrets
  Not all scenarios were handled in functions (db open connection) - null path
  if (!data) doesn't check if empty - 3 endpoints
*/

afterAll(async () => {
  if (index.server) {
    index.server.close();
  }
});
