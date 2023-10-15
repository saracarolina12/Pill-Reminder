const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('pillReminder.db'); // Replace 'mydatabase.db' with your desired database file name

function seeTables(){
    db.serialize(() => {
        db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, tables) => {
            if (err) {
              return console.error(err.message);
            }
        
            tables.forEach(table => {
              console.log('Table Name: ' + table.name);
            });
        });
    });
}

function selectTable(table){
    db.serialize(() => {
        db.all(`SELECT * from ${table};`, (err, entries) => {
            if (err) {
                return console.error(err.message);
            }
          
            entries.forEach(entry => {
                console.log('Entry: ' + entry.id + '\t ' + entry.name);
            });
        })
    });
}

function createUnitsTable(){
    db.serialize(() => {
        db.run('DROP TABLE units;');
        db.run('CREATE TABLE units (unit_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');

        const measurementUnits = ['mg', 'oz', 'ml'];

        const insert = db.prepare('INSERT INTO units (name) VALUES (?)');
        measurementUnits.forEach(unit => {
            insert.run(unit);
        });
        insert.finalize(); // Finalize the statement after executing it
    });
}

function createUsersTable(){
    db.serialize(() => {
        db.run('CREATE TABLE users (user_id INTEGER, name VARCHAR(50), email VARCHAR(50), password VARCHAR(300));');
    });
}

function createPillsTable(){
    db.serialize(() => {
        db.run(`
        CREATE TABLE IF NOT EXISTS pills (
            pill_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(50),
            user_id INTEGER,
            start DATETIME,
            end DATETIME,
            frequency INTEGER,
            dose INTEGER,
            dose_unit INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(user_id),
            FOREIGN KEY (dose_unit) REFERENCES units(unit_id)
            );
        `);
    });
}

seeTables();

/* Units
selectTable('units');
createUnitsTable();
selectTable('units');
*/

/* Users
createUsersTable();
*/

/* Pills
createPillsTable();
*/

seeTables();

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed the database connection.');
});
