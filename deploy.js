var sys = require('sys')
var exec = require('child_process').exec;
const version = require("./package.json").version
console.log("deploying Graphite-Writer-App@v" + version)
dir = exec(`sentry-cli releases -o stomp-rocket new "Graphite-Writer-App@${version}" -p graphite-writer && npm run build && firebase deploy &&  sentry-cli releases -o stomp-rocket finalize "Graphite-Writer-App@${version}"`, function(err, stdout, stderr) {
  if (err) {
    // should have err.code here?
    console.log(err)
  }
  console.log(stdout);
});

dir.on('exit', function (code) {
  console.log(code)
  // exit code is code
});