
const requireLogin = require('../middlewares/requireLogin');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');

// Set global directory
global.__basedir = __dirname;

// Multer Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

// Filter for CSV file
const csvFilter = (req, file, cb) => {
    if (file.mimetype.includes("csv")) {
        cb(null, true);
    } else {
        cb("Please upload only csv file.", false);
    }
};
//const upload = multer({ storage: storage, fileFilter: csvFilter });
const upload = multer({ dest: 'uploads/' })

module.exports = (app) => {
    app.post('/api/uploadCsv', requireLogin, upload.single("csv"), async (req, res) => {
        console.log('req.file', req.file);
        res.send();
    });
}
