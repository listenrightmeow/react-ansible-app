const cwd = process.cwd();
const path = require('path');
const fs = require('fs');

module.exports = (root = `${cwd}`, src = 'application/src') => {
  const projectRoot = root;
  const projectScriptDirs = {};
  const getDirectories = (srcpath) => {
    return fs.readdirSync(srcpath).filter((file) => {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  };

  [src].map((type) => {
    getDirectories(path.join(projectRoot, type)).map((directory) => {
      const key = type === 'stylesheets' ? `stylesheets/${directory}` : directory;
      projectScriptDirs[key] = path.join(projectRoot, type, directory);
      return null;
    });
  });

  return {
    resolveAlias: Object.assign({
      src: projectRoot
    }, projectScriptDirs)
  };
};
