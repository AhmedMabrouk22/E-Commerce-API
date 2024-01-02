const fs = require("fs");

const pathHandler = require("./paths");

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
