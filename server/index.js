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

function createUnitsTable(){
    db.serialize(() => {
        // db.run('CREATE TABLE units (id INTEGER PRIMARY KEY, name TEXT)');

        const insert = db.prepare('INSERT INTO units VALUES (?, ?)');
        insert.run(0, 'John Doe');
        insert.run(0, 'Jane Smith');
        insert.finalize(); // Finalize the statement after executing it
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

seeTables();
createUnitsTable();

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed the database connection.');
});
