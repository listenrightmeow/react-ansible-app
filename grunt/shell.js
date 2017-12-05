const cwd = process.cwd();
const execSync = require('child_process').execSync;
const grunt = require('grunt');
const env = (env) => {
  const environment = /^(stag)(e|ing)/.test(env) ? 'staging' : /^(prod)(uction)?/.test(env) ? 'production' : /^(dev)(evelopment)?/.test(env) ? 'development' : null;

  if (!environment) {
    grunt.fail.fatal('Grunt: Environment unknown');
  } else {
    return environment;
  }
}

module.exports = {
  decrypt: {
    command: () => {
      const environment = env(grunt.option('env'));

      return `ansible-vault view ${cwd}/vault/${environment}.yml --vault-password-file ${cwd}/secrets/vault-pass.txt > ${cwd}/secrets/${environment}.yml`;
    }
  },
  start: {
    command: () => {
      const environment = env(grunt.option('env'));
      const port = grunt.option('port');

      if (!!port) {
        return `PORT=${port} npm start`;
      } else {
        return 'npm start';
      }
    }
  }
};
