const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')
const mysql = require('mysql2')

//setup db connection to mysql container
const connection = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'workertest', port:3366,})
// make connection to database
connection.connect()

//worker function
function insertWithWorker(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker-single-page', {workerData});
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(
                    `Stopped the Worker Thread with the exit code: ${code}`));
        })
    })
}

// insert to db function
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

//check if main thread or background thread
if(isMainThread) {
    // define start time
    const startTime = performance.now()
    // trying to create 10.000 threads
    for (let i = 1; i <= 10000; i++) {
        //insert table with worker
        insertWithWorker({i,startTime}).then();
    }
}else{
    // call worker threads to insert db
    let value = insert(workerData);
    // send result to main value
    parentPort.postMessage(value);
}

//close connection to database
connection.end()
