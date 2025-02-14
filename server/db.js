import mysql from 'mysql';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'node',
    password: 'Node@2025',
    database: 'birthday_party'
  })
  
  db.connect((err) => {
    if(!err) {
      console.log("Connected to database successfully");
    } else {
      console.log("Failed to connect database");
    }
  })
  
  export default db;
  