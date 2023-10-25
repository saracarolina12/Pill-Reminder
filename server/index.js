const bodyParser = require('body-parser');
const express = require('express');
const sqlite3 = require('sqlite3');
const session = require('express-session');
const nodemailer = require('nodemailer');

// TODO: Make sure that the codes that i'm returning are right: 400, 500, 200, etc

const app = express();
app.use(
  session({
    secret: 'your-secret-key', // TODO: Change this to a strong and secure secret
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

app.post('/sendCode', (req, res) => {
    const {email} = req.body;
    if(!email)
        return res.status(400).json({error: 'Invalid JSON data'});
    var db = handler.openConnection();

    db.serialize(() => {
        db.all(`SELECT * FROM users WHERE email = ?;`, [email], (err, entries) => {
            if (err) {
                console.log("Couldn't find email: " + err); // TODO: ADD A PROPER LOGGER
                return res.status(500).json({ error: "Couldn't find email: " + err });
            }
            if(entries.length) {
                console.log("Found email."); // TODO: ADD A PROPER LOGGER
                // req.session.userId = entries[0].user_id; 

                const Longitud = 4;
                let codigoV  = [];
                for(let i = 1; i <= Longitud; i++)
                    codigoV.push(Math.floor(Math.random()*10));

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth:{
                        user:'mindsparkpillreminder01@gmail.com',
                        pass:'omof cacf vcvm yyqo'
                    }
                });
                const mailOptions = {
                    from:'mindsparkpillreminder01@gmail.com',
                    to: email,
                    subject : 'Recuperacion de cuenta',
                    text : 'Tu codigo de verifiación es: ' + codigoV.join(""),
                };

                transporter.sendMail(mailOptions,
                    function(err,info){
                        if(err){
                            console.log("Couldn't find email: " + err); // TODO: ADD A PROPER LOGGER
                            return res.status(500).json({ error: "Couldn't find email: " + err });
                        }
                        else return res.status(200).json({ message: info.response });
                    });
            }
            else {
                console.log("Couldn't find email"); // TODO: Logger
                return res.status(500).json({ error: "Couldn't find email" });
            }
        })
    });

    handler.closeConnection();
});

app.post('/signup', (req, res) => { // TODO: Handle not repeated users
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
                console.log("Sign in successful."); // TODO: ADD A PROPER LOGGER
                req.session.userId = entries[0].user_id;
                return res.status(200).json({ message: 'Sign in successful' });
            }
            else {
                console.log("Couldn't find user"); // TODO: Logger
                return res.status(500).json({ error: "Couldn't find user: " + err });
            }
        })
    });

    handler.closeConnection();
});

app.get('/getPills', requireAuth, (req, res) => {
    var db = handler.openConnection();

    db.serialize(() => {
        db.all(`SELECT p.pill_id, p.name, p.start, p.end, p.frequency, p.dose, u.name as dose_unit
            FROM pills p
            JOIN units u ON u.unit_id = p.dose_unit
            WHERE user_id = ${req.session.userId};`, 
            (err, entries) => {
                if (err) {
                    console.log("Couldn't find pills: " + err); // TODO: ADD A PROPER LOGGER
                    return res.status(500).json({ error: "Couldn't find pills: " + err });
                }
                console.log(entries, entries.length);
                if(entries.length) {
                    console.log("Displaying " + entries.length +  " pills: " + entries); // TODO: ADD A PROPER LOGGER
                    return res.status(200).json(entries);
                }
                else {
                    console.log("No pills to show"); // TODO: Logger
                    return res.status(500).json({ error: "No pills to display: " });
                }
        })
    });

    handler.closeConnection();
});

app.post('/newPill', requireAuth, (req, res) => {
    const data = req.body;
    if (!data)
        return res.status(400).json({ error: 'Invalid JSON data' });

    var db = handler.openConnection();

    db.run(
      'INSERT INTO pills (name, user_id, start, end, frequency, dose, dose_unit) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.name, req.session.userId, data.start, data.end, data.frequency, data.dose, data.dose_unit],
      (err) => {
        if (err) {
            console.log("Couldn't insert Pill: " + err); // TODO: ADD A PROPER LOGGER
            return res.status(500).json({ error: 'Database insertion failed' + err });
        }
        res.json({ message: 'Data inserted successfully' });
        console.log("Pill created successfully"); // TODO: ADD A PROPER LOGGER
      }
    );

    handler.closeConnection();
});

app.listen(port, () => {
    console.log(`Holahola. My app listening on port ${port}`);
})
