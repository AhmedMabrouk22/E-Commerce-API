const fs = require("fs");

const pathHandler = require("./paths");

const unlinkFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      throw err;
    }
  });
};

exports.deleteFile = (filename) => {
  if (filename) {
    const filepath = pathHandler.generatePath(filename);
    fs.unlink(`./${filepath}`, (err) => {
      if (err) {
        console.error(err);
        throw err;
      }
    });
  }
};

exports.deleteFiles = (filesNames) => {
  if (filesNames) {
    for (const filename of filesNames) {
      const filepath = pathHandler.generatePath(filename);
      unlinkFile(`./${filepath}`);
    }
  }
};
