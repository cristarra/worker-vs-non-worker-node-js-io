const { Worker } = require('worker_threads')
//worker function
function insertWithWorker(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker-threads', { workerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(
                    `Stopped the Worker Thread with the exit code: ${code}`));
        })
    })
}

// define start time
const startTime = performance.now()
// trying to create 10.000 threads
for (let i = 1; i <= 10000; i++) {
    //insert table with worker
    insertWithWorker({i,startTime}).then();
}
