const { parentPort,workerData } = require('worker_threads')
const mysql = require('mysql2')

//setup db connection to mysql container
const connection = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'workertest', port:3366,})
// worker threads to insert db
function insert(data) {
    // get index on index 0
    let i = data[0]
    // get start time on index 1
    let startTime = data[1]
    // sql query
    const sql = `INSERT INTO workerdata (data) VALUES ('data-${i}')`;
    connection.query(sql, function(err, result) {
        if (err) throw err;
        //print execution time
        console.log(`Proses ke ${i} ${performance.now() - startTime} milliseconds`)
    });
}

// make connection to database
connection.connect()
// call worker threads to insert db
let value = insert(workerData);
//close connection to database
connection.end()
// send result to main value
parentPort.postMessage(value);
