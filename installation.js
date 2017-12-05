const { spawn, exec, execSync } = require('child_process')
const { join } = require('path')
const { exists, mkdir, readFileSync } = require('fs')

const CWD = process.cwd()
const DOWNLOADS = join(process.env.HOME, 'Downloads')
const NVM_DIR = join(process.env.HOME, '.nvm')
const NVM_SCRIPT = join(NVM_DIR, 'nvm.sh')
const NVM_VERSION = parseFloat(readFileSync(join(CWD, '.nvmrc')).toString().trim())
// TODO: find resolved node version number -- Remove hardcoded .0
const NODE_MODULES = join(NVM_DIR, 'versions/node', `v${NVM_VERSION}.0`, 'lib/node_modules')
const GRUNT_CLI = join(NODE_MODULES, 'grunt-cli/bin/grunt')

const BREW_PACKAGES = [
    'ansible',
    'wget',
    'nvm'
]

const DIRECTORIES = [
    'secrets',
    'secrets/.generated'
]

installHomebrew()
    .then(() => installBrewPackages())
    .then(() => installPip())
    .then(() => pipInstall('cryptography'))
    .then(() => executeWithSourcedNvm('npm i'))
    .then(() => executeWithSourcedNvm('npm i --global grunt-cli'))
    .then(() => makeDirectories())
    .then(() => {
        console.log(`\n`)
    })
    .catch((err) => {
        if (err instanceof Error) {
            console.error(err.message)
            console.error(err.stack)
        } else {
            console.error(err)
        }

        process.exit(1)
    })

function installHomebrew() {
    return execute('which', ['brew'])
        .catch(() => {
            return new Promise((resolve, reject) => {
                console.log("Installing homebrew...")
                exec('ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"', { stdio: 'inherit' }, (err, stdout, stderr) => {
                    if (err) return reject(stderr)

                    console.log(stdout)

                    resolve()
                })
            })
        })
}

function installBrewPackages() {
    return BREW_PACKAGES.reduce(
        (promise, packageName) => promise.then(() => brewInstall(packageName)),
        Promise.resolve()
    )
}

function brewInstall(packageName) {
    return execute('brew', ['install', packageName])
}

function installPip() {
    return execute('which', 'pip')
        .catch(() => {
            return execute('wget', ['https://bootstrap.pypa.io/get-pip.py'], DOWNLOADS)
                .then(() => execute('sudo', ['python', './get-pip.py'], DOWNLOADS))
                .then(() => execute('rm', ['-f', './get-pip.py'], DOWNLOADS))
                .then(() => execute('pip', ['install', '--user', '--upgrade', 'pip']))
        })
}

function pipInstall(packageName) {
    return execute(`pip`, ['install', '--user', packageName])
}

function makeDirectories() {
    return DIRECTORIES.reduce(
        (promise, dir) => promise.then(() => makeDirectory(dir)),
        Promise.resolve()
    )
}

function makeDirectory(dir) {
    return new Promise((resolve, reject) => {
        exists(dir, (directoryExists) => {
            if (directoryExists) return resolve()

            mkdir(dir, (err) => {
                if (dir) return reject(err)

                resolve()
            })
        })
    })
}

function ensureExists(path, message) {
    return new Promise((resolve, reject) => {
        exists(path, (pathExists) => {
            if (pathExists) resolve()

            reject(message)
        })
    })
}

function execute(cmd, args, cwd = CWD) {
    return new Promise((resolve, reject) => {
        console.log(cmd, ...args)
        const cp = spawn(cmd, args, { stdio: 'inherit', cwd, env: Object.assign({}, process.env, NVM_DIR) })

        cp.on('error', reject)
        cp.on('exit', (code) => code === 0 ? resolve() : reject('Failed'))
    })
}

function executeWithSourcedNvm(cmd) {
    return ensureExists(NVM_SCRIPT, 'NVM was not correctly installed')
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log(cmd)
                exec(`source ${NVM_SCRIPT} && nvm install ${NVM_VERSION} && nvm use ${NVM_VERSION} && ${cmd}`, { stdio: 'inherit' }, (err, stdout, stderr) => {
                    if (err) return reject(stderr)
                    console.log(stdout)
                    resolve()
                })
            })
        })
}
