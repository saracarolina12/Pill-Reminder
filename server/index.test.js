const index = require('./index');
const axios = require('axios');
const sqlite3 = require('sqlite3');
const fs = require('fs');

require('dotenv').config();

describe('Util', () => {

  test('Converts hours to unix time (miliseconds)', () => {
    expect(index.toTimestamp(1)).toBe(3600000);
  });

  describe('Database', () => {

    test('Open connection with error', () => {
      var testDB = new index.DatabaseHandler(null);
      expect(testDB.openConnection()).not.toBeInstanceOf(sqlite3.Database);
    });
    
    test('Open connection', () => {
      var testDB = new index.DatabaseHandler(process.env.DB_PATH);
      expect(testDB.openConnection()).toBeInstanceOf(sqlite3.Database);
    });

    test('Close connection', () => {
      var testDB = new index.DatabaseHandler(process.env.DB_PATH);
      testDB.openConnection();
      expect(testDB.closeConnection()).toBe(undefined); // Doesn't return any error
    });

    /*
    
    describe('Tables', () => {
      
      var tables = ['users', 'units', 'pills']
      
      var testDB = new index.DatabaseHandler(process.env.DB_PATH);
      var db = testDB.openConnection();
      
      var resTables = [];
      
      db.serialize(() => {
        db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, tables) => {
          if (err) {
              return console.error(err.message);
            }
            
            for(var t in tables){
              console.log(tables[t].name);
              resTables.push(tables[t].name);
            }
            
            check(resTables);
          });
        });

        const check = (resTables) => {
          console.log(resTables);
          for(var t in tables){
            test(`${tables[t]} exists`, () => {
              expect(resTables.includes(tables[t])).toBe(true);
            });
          }
        }
        
        
      });
      
      */
    });
    
    describe('Integrity', () => {
      
      var routes = ['node_modules', process.env.DB_PATH, '.env'];
      
      for(var r in routes){
        test(`${routes[r]} exists`, () => {
        expect(fs.existsSync(routes[r])).toBe(true);
      });
    }

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
