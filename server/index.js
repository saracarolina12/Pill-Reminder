const bodyParser = require('body-parser');
const express = require('express');
const sqlite3 = require('sqlite3');
const session = require('express-session');
const nodemailer = require('nodemailer');
var Heap = require("collections/heap");

// TODO: CHANGE ALL CONSOLE.LOG FOR LOGGER
// TODO: Add next alarm endpoint

const app = express();
app.use(
  session({
    secret: '7B#Kp&2M$5n@9T8Q',
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
    console.log(req.session, '\n-------------------------------------------------------------------------------------');
    //console.log(req);

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
                console.log("Couldn't find email: " + err); 
                return res.status(500).json({ error: "Couldn't find email: " + err });
            }
            if(entries.length) {
                console.log("Found email."); 
                // req.session.userId = entries[0].user_id; 

                const Longitud = 4;
                let codigoV  = [];
                for(let i = 1; i <= Longitud; i++)
                    codigoV.push(Math.floor(Math.random()*10));
                let code = codigoV.join("");

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
                    text : 'Tu codigo de verifiación es: ' + code,
                };

                req.session.code = parseInt(code);
                req.session.email = email;

                transporter.sendMail(mailOptions,
                    function(err,info){
                        if(err){
                            console.log("Couldn't find email: " + err);
                            return res.status(500).json({ error: "Couldn't find email: " + err });
                        }
                        else return res.status(200).json({ message: info.response });
                    });
            }
            else {
                console.log("Couldn't find email");
                return res.status(400).json({ error: "Couldn't find email" });
            }
        })
    });

    handler.closeConnection();
});

app.post('/verify', (req, res) => {
    const {code} = req.body;
    if(!code) 
        return res.status(400).json({error: 'Invalid JSON data'});

    if(code === req.session.code) {
        console.log("Codes match");
        req.session.code = 0;
        return res.status(200).json({message: 'Codes match'});
    }
    else {
        console.log("Codes don't match");
        return res.status(400).json({error: "Codes don't match"});
    }
});

app.post('/signup', (req, res) => {
    const data = req.body;
    if (!data)
    return res.status(400).json({ error: 'Invalid JSON data' });

    var db = handler.openConnection();
    var failed = false;

    db.serialize(() => {
        db.all(`SELECT * FROM users WHERE name = '${data.name}' or email = '${data.email}'`, (err, entries) => {
            if (err) {
                console.log("Failed while signing up: " + err);
                failed = true;
                return res.status(500).json({ error: "Failed signing up: " + err });
            }
            else if(entries.length) {
                console.log("User already exists.");
                failed = true;
                return res.status(400).json({ message: 'User already exists' });
            }
            else {
                db.run(
                    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                    [data.name, data.email, data.password],
                    (err) => {
                        if (err) {
                            console.log("Couldn't insert user: " + err);
                            return res.status(500).json({ error: 'Database insertion failed' + err });
                        }
                        else {
                            console.log("User created successfully");
                            return res.status(200).json({ message: 'Data inserted successfully' });
                        }
                    }
                );
            }
        })
        //handler.closeConnection();
    });
});

app.post('/signin', (req, res) => {
    const data = req.body;
    if (!data)
        return res.status(400).json({ error: 'Invalid JSON data' });

    var db = handler.openConnection();
    
    db.serialize(() => {
        db.all(`SELECT * FROM users WHERE name = '${data.name}' and password = '${data.password}'`, (err, entries) => {
            if (err) {
                console.log("Couldn't find user: " + err);
                return res.status(500).json({ error: "Couldn't find user: " + err });
            }
            console.log(entries, entries.length);
            if(entries.length) {
                console.log("Sign in successful.");
                req.session.userId = entries[0].user_id;
                return res.status(200).json({ message: 'Sign in successful' });
            }
            else {
                console.log("Couldn't find user");
                return res.status(400).json({ error: "Couldn't find user: " + err });
            }
        })
    });
    
    handler.closeConnection();
});

app.get('/signout', requireAuth, (req, res) => {
    try {
        req.session.userId = null;
        return res.status(200).json({ message: 'Sign out successful' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Sign out failed: ' + error });
    }
});

app.post('/newPassword', (req, res) => {
    const {password} = req.body;
    if(!password) return res.status(400).json({error: 'Invalid JSON data'});
    
    var db = handler.openConnection();

    db.run(
        'UPDATE users SET password = ? WHERE email = ?',
        [password, req.session.email],
        (err) => {
            if (err || !req.session.email) {
                console.log("Couldn't update password: " + err);
                return res.status(500).json({ error: 'Database update failed' + err });
            }
            req.session.email = "";
            console.log("Password updated successfully");
            res.json({ message: 'Data inserted successfully' });
        }
        );

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
                    console.log("Couldn't find pills: " + err);
                    return res.status(500).json({ error: "Couldn't find pills: " + err });
                }
                console.log(entries, entries.length);

                //req.session.nextAlarm = new Heap();

                const toTimestamp = (hours) => 1000*60*60*hours;
                if(entries.length) {
                    entries.forEach(alarm => {
                        if(alarm.start) {
                            let curr = Date.parse(new Date()) - toTimestamp(6); // Mexico is in UTC-6
                            let start = Date.parse(new Date(alarm.start));
                            let end = Date.parse(new Date(alarm.end));
                            for(
                                ; 
                                start < curr && start < end;
                                start += toTimestamp(alarm.frequency)
                            );
                            if(start < end) {
                                let next = new Date(start);
                                alarm.next = next;
                                /*
                                req.session.nextAlarm.push({'pill_id': alarm.pill_id, 'date': next}, null, (a, b) => {
                                    a['date'] - b['date'];
                                });
                                */
                            }
                        }
                    });
                    //console.log(req.session.nextAlarm);
                    return res.status(200).json(entries);
                }
                else {
                    console.log("No pills to show");
                    return res.status(200).json({ message: "No pills to display: " });
                }
        })
    });

    handler.closeConnection();
});

app.get('/nextAlarm', requireAuth, (req, res) => {
    //console.log(
});

app.get('/getUnits', (req, res) => {
    var db = handler.openConnection();

    db.serialize(() => {
        db.all('SELECT unit_id, name FROM units;', 
            (err, entries) => {
                if (err) {
                    console.log("Couldn't find units: " + err);
                    return res.status(500).json({ error: "Couldn't find units: " + err });
                }
                if(entries.length) {
                    console.log("Displaying " + entries.length +  " units: " + entries);
                    return res.status(200).json(entries);
                }
                else {
                    console.log("No units to show");
                    return res.status(500).json({ error: "No units to display" });
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
            console.log("Couldn't insert Pill: " + err);
            return res.status(500).json({ error: 'Database insertion failed' + err });
        }
        res.json({ message: 'Data inserted successfully' });
        console.log("Pill created successfully");
      }
    );

    handler.closeConnection();
});

app.listen(port, () => {
    console.log(`Holahola. My app listening on port ${port}`);
})