const mysql = require('mysql2')
//setup db connection to mysql container
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'workertest',
    port:3366
})
// make connection to database
connection.connect()
// define start time
const startTime = performance.now()
// looping for insert 10.000 data on table
for(let i=1; i<=10000; i++){
    const sql = `INSERT INTO workerdata (data) VALUES ('data-non-worker-${i}')`;
    connection.query(sql, function(err, result) {
        if (err) throw err;
        //print execution time
        console.log(`Proses ke ${i} ${performance.now() - startTime} milliseconds`)
    });
}
//close connection to database
connection.end()
