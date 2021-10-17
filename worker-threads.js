const { parentPort,workerData } = require('worker_threads')
const mysql = require('mysql2')

//setup db connection to mysql container
const connection = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'workertest', port:3366,})

// make connection to database
connection.connect()

// worker threads to insert db
function insert(data) {
    // get index
    let i = data.i
    // get start time
    let startTime = data.startTime
    // sql query
    const sql = `INSERT INTO workerdata (data) VALUES ('data-${i}')`;
    connection.query(sql, function(err, result) {
        if (err) throw err;
        //print execution time
        console.log(`Proses ke ${i} ${performance.now() - startTime} milliseconds`)
    });
}

// call worker threads to insert db
let value = insert(workerData);
// send result to main value
parentPort.postMessage(value);

//close connection to database
connection.end()
