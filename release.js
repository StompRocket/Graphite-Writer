const currentVersion = require('./package').version;
let packageData = require('./package');
let Enquirer = require('enquirer');
let fs = require('fs');
let enquirer = new Enquirer();
const question = [
  {
    type: 'input',
    name: 'newVersion',
    message: `new version? current ${currentVersion}`
  }
];

enquirer.prompt(question)
.then(function (answers) {
  if (!answers.newVersion) {
    answers.newVersion = currentVersion
  }


  packageData.version = answers.newVersion
  fs.writeFile("./package.json", JSON.stringify(packageData), (e) => {
      if (e) {
        return console.log(e)
      }
      console.log("package updated with version", answers.newVersion)
      console.log('building...')
      const {exec} = require('child_process');
      exec('npm run build', (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          return;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        console.log('deploying...')
        exec('firebase deploy --only hosting', (err, stdout, stderr) => {
          if (err) {
            // node couldn't execute the command
            process.exit(1)
          }

          // the *entire* stdout and stderr (buffered)
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
          process.exit(0)
        });
      });
    }
  )
})

