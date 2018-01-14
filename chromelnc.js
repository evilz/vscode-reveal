const chromeLauncher = require('chrome-launcher')

chromeLauncher
  .launch({
    startingUrl: 'http://localhost:54585/?print-pdf#/',
    chromeFlags: ['--headless', '--disable-gpu', `--print-to-pdf="d:\\tessssst.pdf"`],
    logLevel: 'verbose'
  })
  .then(instance => {
    console.log(`Chrome debugging port running on ${instance.port}`)
  })
