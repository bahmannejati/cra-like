const webpack = require('webpack');
const fs = require("fs");
const path = require("path");
const detect = require("detect-port");
const webpackDevServer = require('webpack-dev-server');
const inquirer = require("inquirer");
const chalk = require("chalk");
const webpackDevConfig = require('../config/webpack.dev');



const defaultPort = 4000;

function clearConsole() {
    process.stdout.write(
        process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
    );
}
  





// expand dot envs
var dotEnvsWithPriority = [
    '.env.development.local',
    '.env.development',

    // Don't include .env.local for
    // `test` environment
    '.env.local',

    '.env',
].map(filePath => path.resolve(__dirname,'../env/' + filePath))

dotEnvsWithPriority.forEach((filePath) => {
    if(!fs.existsSync(filePath)) {
        // console.log("NOT FOUND: ", filePath)
        return
    }
    require("dotenv-expand")(
        require("dotenv").config({
            path: filePath
        })
    )
})




// console.log("ENV PATH: ", process.env.TEST_VAR)





// --- compiler
const compiler = webpack(webpackDevConfig)





// --- extract stats
let statCounter = 0

compiler.hooks.done.tap('extractStats', (stats) => {
    let statsJSON = stats.toJson()

    if(statCounter > 0 || (statsJSON.errors && statsJSON.errors.length)){
        return
    }
    statCounter ++
    
    fs.writeFile(path.resolve(__dirname, "../dev/stats.json"), JSON.stringify(), 'utf8', (error) => {
        if (error) throw error;
        console.log()
        console.log('[stats.json file has been saved]')
        console.log()
    })
    return true
})


compiler.hooks.invalid.tap('onInvalid', (stats) => {
    clearConsole()
    console.log("Now is compiling...")
})

compiler.hooks.done.tap('printAfterCompile', (stats) => {
    clearConsole()

    let statsJSON = stats.toJson()

    if(statsJSON.errors && statsJSON.errors.length) {
        console.log(chalk.red(`xxx Compile error xxx`))
        console.log()
        console.log(chalk.red(statsJSON.errors[0]))
        console.log()
        return false
    }
    if(statsJSON.warnings && statsJSON.warnings.length) {
        console.log(chalk.yellow(`Compiled with Warning`))
        console.log()
        statsJSON.warnings.forEach(warningString => {
            console.log(chalk.yellow(warningString))
            console.log()
        })
    }
    else {
        console.log(chalk.green(`Compiled successfully`))
        console.log()
    }


    return true
})






const devServer = new webpackDevServer(compiler, {
    open: false,
    stats: {
        colors: true,
    },
    writeToDisk: true,
    quiet: true,
    progress: true,
    stats: 'normal',


    // contentBase is used for correct serving
    // static files during dev server, because we dont
    // copy static files in public folder during dev
    contentBase: 'public/',

    // public path is just like output.publicPath
    // we leave them same
    publicPath: '/',
})







var lastChoosedCustomPort = false

const enterCustomPort = (resolve, reject) => {
    inquirer.prompt({
        type: 'input',
        name: 'acceptPort',
        message: chalk.yellow(`Enter custom port (${defaultPort}) :`),
        default: defaultPort,
    }).then(answer => {
        let customPort = +answer.acceptPort
        if(customPort === defaultPort) {
            lastChoosedCustomPort = false
        }
        checkPort(customPort, resolve, reject)
    })
}
const chooseOne = (nextPort, resolve, reject) => {
    inquirer.prompt({
        type: 'input',
        name: 'acceptPort',
        message: chalk.yellow(`Port not found, checking for ${nextPort} [y,n] ?`),
        default: 'y',
    }).then(answer => {
        if (answer.acceptPort === 'n') {
            lastChoosedCustomPort = true
            enterCustomPort(resolve, reject)
        }
        else if (answer.acceptPort === 'y'){
            checkPort(nextPort, resolve, reject)
        }
        else {
            console.log("Invalid answer");
            chooseOne(nextPort, resolve, reject)
        }
    })
}

const checkPort = (portToCheck, resolve, reject) => {
    detect(portToCheck).then(port => {
        let nextPort = (portToCheck || defaultPort) + 1

        if(portToCheck === port) {
            resolve(port, true)
        }
        else {
            console.log(`PORT ${portToCheck} is not available`)

            if(!lastChoosedCustomPort) {
                chooseOne(nextPort, resolve, reject)
            }
            else {
                enterCustomPort(resolve, reject)
            }
        }
    }).catch(error => {
        console.log("Error finding empty port", error)
        reject()
    });
}

const choosePort = (portToCheck) => {
    return new Promise((resolve, reject) => {
        checkPort(portToCheck, resolve, reject)
    })
}

choosePort(defaultPort).then((availablePort) => {
    devServer.listen(availablePort, '0.0.0.0', () => {
        console.log(`Starting server on http://0.0.0.0:${availablePort}`);
    });
}).catch(() => {
    process.exit(0)
})