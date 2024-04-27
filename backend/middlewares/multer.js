const multer = require('multer');

const fileStorageEngine = multer.memoryStorage();

const upload = multer({ storage: fileStorageEngine });

module.exports = upload;
