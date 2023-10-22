const bodyParser = require('body-parser');
const express = require('express');
const sqlite3 = require('sqlite3');
const session = require('express-session');

const app = express();
app.use(
  session({
    secret: 'your-secret-key', // Change this to a strong and secure secret
    resave: false,
    saveUninitialized: true,
  })
);
const port = 8532;
// var cors = require('cors');
app.use(bodyParser.json());

class DatabaseHandler {
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.db = null;
    }

    openConnection(){
        this.db = new sqlite3.Database(this.dbPath);
        return this.db;
    }

    closeConnection(){
        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Closed the database connection.');
        });
    }
}

var handler = new DatabaseHandler('pillReminder.db');

app.get('/', (req, res) => {
    res.send('Hola');
});

const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    }
    else {
        console.log("Called an endpoint that requires authentication");
        res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
};

app.post('/signup', (req, res) => {
    const data = req.body;
    if (!data)
        return res.status(400).json({ error: 'Invalid JSON data' });

    var db = handler.openConnection();
  
    db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [data.name, data.email, data.password],
      (err) => {
        if (err) {
            console.log("Couldn't insert user: " + err); // TODO: ADD A PROPER LOGGER
            return res.status(500).json({ error: 'Database insertion failed' + err });
        }
        res.json({ message: 'Data inserted successfully' });
        console.log("User created successfully"); // TODO: ADD A PROPER LOGGER
      }
    );

    handler.closeConnection();
});

app.post('/signin', (req, res) => {
    const data = req.body;
    if (!data)
        return res.status(400).json({ error: 'Invalid JSON data' });

    var db = handler.openConnection();
  
    db.serialize(() => {
        db.all(`SELECT * FROM users WHERE name = '${data.name}' and password = '${data.password}'`, (err, entries) => {
            if (err) {
                console.log("Couldn't find user: " + err); // TODO: ADD A PROPER LOGGER
                return res.status(500).json({ error: "Couldn't find user: " + err });
            }
            console.log(entries, entries.length);
            if(entries.length) {
                res.json({ message: 'Sign in successful' });
                console.log("Sign in successful"); // TODO: ADD A PROPER LOGGER
            }
            else {
                console.log("Couldn't find user"); // TODO: Logger
            }
        })
    });

    handler.closeConnection();
});

app.get('/getPills', requireAuth, (req, res) => {
    res.json({ message: 'This is a protected route. You are logged in as ' + req.session.userId });
});

app.listen(port, () => {
    console.log(`Holahola. My app listening on port ${port}`);
})
