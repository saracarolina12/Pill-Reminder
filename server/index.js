const bodyParser = require('body-parser');
const express = require('express');
const sqlite3 = require('sqlite3');
const session = require('express-session');
const nodemailer = require('nodemailer');
require('dotenv').config();

// TODO: CHANGE ALL if(debug) console.LOG FOR LOGGER

const debug = false;

const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
const port = process.env.PORT || 8532;
// var cors = require('cors');
app.use(bodyParser.json());

const toTimestamp = (hours) => 1000*60*60*hours;

class DatabaseHandler {
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.db = null;
    }

    openConnection(){
        try {
            this.db = new sqlite3.Database(this.dbPath);
            return this.db;
        }
        catch(e) {
            return e;
        }
    }

    closeConnection(){
        this.db.close((err) => {
            if (err) {
                if(debug) console.error(err.message);
                return err;
            }
            if(debug) console.log('Closed the database connection.');
        });
    }
}

var handler = new DatabaseHandler(process.env.DB_PATH);

app.get('/', (req, res) => {
    res.send('Hola');
});

const requireAuth = (req, res, next) => { // TODO: test
    if (req.session.userId) {
        next();
    }
    else {
        if(debug) console.log("Called an endpoint that requires authentication");
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
                if(debug) console.log("Couldn't find email: " + err); 
                return res.status(500).json({ error: "Couldn't find email: " + err });
            }
            if(entries.length) {
                if(debug) console.log("Found email."); 
                // req.session.userId = entries[0].user_id; 

                const Longitud = 4;
                let codigoV  = [];
                for(let i = 1; i <= Longitud; i++)
                    codigoV.push(Math.floor(Math.random()*10));
                let code = codigoV.join("");

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth:{
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                });
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject : 'Recuperacion de cuenta',
                    text : 'Tu codigo de verifiación es: ' + code,
                };

                req.session.code = parseInt(code);
                req.session.email = email;

                transporter.sendMail(mailOptions,
                    function(err,info){
                        if(err){
                            if(debug) console.log("Couldn't find email: " + err);
                            return res.status(500).json({ error: "Couldn't find email: " + err });
                        }
                        else return res.status(200).json({ message: info.response });
                    });
            }
            else {
                if(debug) console.log("Couldn't find email");
                return res.status(500).json({ error: "Couldn't find email" });
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
        if(debug) console.log("Codes match");
        req.session.code = 0;
        return res.status(200).json({message: 'Codes match'});
    }
    else {
        if(debug) console.log("Codes don't match");
        return res.status(500).json({error: "Codes don't match"});
    }
});

app.post('/signup', (req, res) => {
    const {name, email, password} = req.body;
    if (!name || !email || password)
        return res.status(400).json({ error: 'Invalid JSON data' });

    var db = handler.openConnection();
    var failed = false;

    db.serialize(() => {
        db.all(`SELECT * FROM users WHERE name = '${name}' or email = '${email}'`, (err, entries) => {
            if (err) {
                if(debug) console.log("Failed while signing up: " + err);
                failed = true;
                return res.status(500).json({ error: "Failed signing up: " + err });
            }
            else if(entries.length) {
                if(debug) console.log("User already exists.");
                failed = true;
                return res.status(400).json({ message: 'User already exists' });
            }
            else {
                db.run(
                    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                    [name, email, password],
                    (err) => {
                        if (err) {
                            if(debug) console.log("Couldn't insert user: " + err);
                            return res.status(500).json({ error: 'Database insertion failed' + err });
                        }
                        else {
                            if(debug) console.log("User created successfully");
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
    const {name, password} = req.body;
    if (!name || !password)
        return res.status(400).json({ error: 'Invalid JSON data' });

    var db = handler.openConnection();
    
    db.serialize(() => {
        db.all(`SELECT * FROM users WHERE name = '${name}' and password = '${password}'`, (err, entries) => {
            if (err) {
                if(debug) console.log("Couldn't find user: " + err);
                return res.status(500).json({ error: "Couldn't find user: " + err });
            }
            if(debug) console.log(entries, entries.length);
            if(entries.length) {
                if(debug) console.log("Sign in successful.");
                req.session.userId = entries[0].user_id;
                return res.status(200).json({ message: 'Sign in successful' });
            }
            else {
                if(debug) console.log("Couldn't find user");
                return res.status(400).json({ error: "Couldn't find user: " + err });
            }
        })
    });
    
    handler.closeConnection();
});

app.get('/signout', requireAuth, (req, res) => {
    try {
        req.session.userId = null;
        if(debug) console.log('Signed out');
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
                if(debug) console.log("Couldn't update password: " + err);
                return res.status(500).json({ error: 'Database update failed' + err });
            }
            req.session.email = "";
            if(debug) console.log("Password updated successfully");
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
                    if(debug) console.log("Couldn't find pills: " + err);
                    return res.status(500).json({ error: "Couldn't find pills: " + err });
                }
                if(debug) console.log(entries, entries.length);
                req.session.nextAlarm = [];

                if(entries.length) {
                    entries.forEach(alarm => {
                        if(alarm.start && alarm.frequency && alarm.end) {
                            let curr = Date.parse(new Date()) - toTimestamp(6); // Mexico is in UTC-6
                            let start = Date.parse(new Date(alarm.start));
                            let end = Date.parse(new Date(alarm.end));
                            for(
                                ; 
                                start < curr && start < end;
                                start += toTimestamp(alarm.frequency)
                            );
                            if(start < end) {
                                alarm.next = start;
                                req.session.nextAlarm.push(alarm);

                                const days = {1: 'Lunes', 2: 'Martes', 3: 'Miercoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sabado', 7: 'Domingo'}
                                const today = new Date(curr).getDate();
                                const alarmDate = new Date(start);
                                const day = alarmDate.getDate();
                                let msg = "";
                                if(today != day) msg = days[alarmDate.getDay()];
                                else msg = 
                                    String(alarmDate.getHours()).padStart(2, '0') + 
                                    ":" + 
                                    String(alarmDate.getMinutes()).padStart(2, '0');
                                alarm.nextText = msg;
                            }
                        }
                    });
                    req.session.nextAlarm.sort((a, b) => a.next - b.next);
                    entries.sort((a, b) => a.next - b.next);
                    if(debug) console.log(req.session.nextAlarm);
                    return res.status(200).json(entries);
                }
                else {
                    if(debug) console.log("No pills to show");
                    return res.status(200).json({ message: "No pills to display: " });
                }
        })
    });

    handler.closeConnection();
});

app.get('/nextAlarm', requireAuth, (req, res) => {
    let curr = Date.parse(new Date()) - toTimestamp(6); // Mexico is in UTC-6
    if (req.session.nextAlarm)
        for(let i = 0; i < req.session.nextAlarm.length; i++) {
            const alarm = req.session.nextAlarm[i];
            if(alarm.next > curr){
                return res.status(200).json({ nextAlarm: alarm });
                break;
            }
        }
    else return res.status(500).json({ error: 'Information not available'});
});

app.get('/getUnits', (req, res) => {
    var db = handler.openConnection();

    db.serialize(() => {
        db.all('SELECT unit_id, name FROM units;', 
            (err, entries) => {
                if (err) {
                    if(debug) console.log("Couldn't find units: " + err);
                    return res.status(500).json({ error: "Couldn't find units: " + err });
                }
                if(entries.length) {
                    if(debug) console.log("Displaying " + entries.length +  " units: " + entries);
                    return res.status(200).json(entries);
                }
                else {
                    if(debug) console.log("No units to show");
                    return res.status(500).json({ error: "No units to display" });
                }
        })
    });

    handler.closeConnection();
});

app.post('/newPill', requireAuth, (req, res) => {
    const {name, start, end, frequency, dose, dose_unit} = req.body; 
    if (!name || !start || !end || !frequency || !dose || !dose_unit)
        return res.status(400).json({ error: 'Invalid JSON data' });

    var db = handler.openConnection();

    db.run(
      'INSERT INTO pills (name, user_id, start, end, frequency, dose, dose_unit) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, req.session.userId, start, end, frequency, dose, dose_unit],
      (err) => {
        if (err) {
            if(debug) console.log("Couldn't insert Pill: " + err);
            return res.status(500).json({ error: 'Database insertion failed' + err });
        }
        res.json({ message: 'Data inserted successfully' });
        if(debug) console.log("Pill created successfully");
      }
    );

    handler.closeConnection();
});

var server = app.listen(port, () => {
    if(debug) console.log(`Holahola. My app listening on port ${port}`);
})

module.exports = { toTimestamp, server, DatabaseHandler };