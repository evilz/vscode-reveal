const {
  spawn
} = require('child_process');

// chromeLauncher
//   .launch({
//     startingUrl: 'http://localhost:54585/?print-pdf#/',
//     chromeFlags: ['--headless', '--disable-gpu', `--print-to-pdf="d:\\tessssst.pdf"`],
//     logLevel: 'verbose'
//   })
//   .then(instance => {
//     console.log(`Chrome debugging port running on ${instance.port}`)
//   })


const url = "https:www.evilznet.com"
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // getBrowserPath()
const chromeFlags = ['--headless', '--disable-gpu', '--print-to-pdf="C:\Users\evilz\Documents\revealtest.pdf"', url]
const chromeProc = spawn(chromePath, chromeFlags, {})

chromeProc.on('exit', function (code, signal) {
  console.log('child process exited with ' +
    `code ${code} and signal ${signal}`);
});

chromeProc.stdout.on('data', (data) => {
  console.log(`child stdout:\n${data}`);
});

chromeProc.stderr.on('data', (data) => {
  console.error(`child stderr:\n${data}`);

});

chromeProc.on('exit', function (code, signal) {
  console.log('child process exited with ' +
    `code ${code} and signal ${signal}`);
});


//process.stdin.pipe(chromeProc.stdin)