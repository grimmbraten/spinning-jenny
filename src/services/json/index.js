const path = require('path');
const json = require('json-file-plus');

const read = (dir, file, property) =>
  new Promise((resolve, reject) => {
    json(path.join(dir, file), async (err, json) => {
      if (err) reject(err);
      resolve(property ? await json.get(property) : await json.get());
    });
  }).catch(error => console.error(error));

const write = (dir, file, property) =>
  new Promise((resolve, reject) => {
    json(path.join(dir, file), async (err, json) => {
      if (err) reject(err);
      await json.set(property);
      await json.save();
      resolve(true);
    });
  }).catch(err => console.error(err));

const remove = (dir, file, property) =>
  new Promise((resolve, reject) => {
    json(path.join(dir, file), async (err, json) => {
      if (err) reject(err);
      await json.remove(property);
      await json.save();
      resolve(true);
    });
  }).catch(error => {
    console.error(error);
    return false;
  });

module.exports = {
  read,
  write,
  remove
};
