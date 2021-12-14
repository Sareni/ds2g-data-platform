
const requireLogin = require('../middlewares/requireLogin');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');

const { uid, getUserDetails } = require('../routes/utils');
const { insertCsvData } = require('../services/trackAnythingDB');

const csvDataStorage = {};

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
    } else if(file.mimetype.includes("vnd.ms-excel") && file.fieldname === 'csv') { // TODO security issue
        cb(null, true);
    } else {
        cb("Please upload only csv file.", false);
    }
};

const maxSize = 5242880; // max 5 MB
const upload = multer({storage: multer.memoryStorage(), fileFilter: csvFilter, limits: { fileSize: maxSize } });

module.exports = (app) => {
    app.post('/api/uploadCsv', requireLogin, upload.single("csv"), async (req, res) => {
        let headers = [];
        const data = [];
        try {
            if (req.file == undefined) {
                return res.status(400).send({
                    message: "Please upload a CSV file!"
                });
            }

            
            let headersAreSet = false;
            


            csv.parseString(req.file.buffer.toString('utf-8'), { headers: false }) // Setting the headers option to true will cause change each row to an object rather than an array.
                .on('error', error => console.error(error))
                .on('data', (row) => {
                    console.log('row', row);
                    if(!headersAreSet) { // TODO improve
                        headers = row;
                        headersAreSet = true;
                    } else {
                        data.push(row);
                    }
                })
                .on('end', (rowcount) => {
                    const dataKey = uid(64);
                    req.session.csvDataKey = dataKey;
                    csvDataStorage[dataKey] = data;

                    function makeClearFunction() {
                        const key = dataKey;

                        function clearFunction() {
                            delete csvDataStorage[key];
                        }
                        return clearFunction;
                    }
                    setTimeout(makeClearFunction(), 300000);
                    res.redirect(`https://test.ds2g.io/preferences/data?headers=${headers.join(',')}`); // , has to be delimiter, TODO general error handling
                });
        } catch (error) {
            console.log("catch error-", error);
            res.status(500).send({
                message: "Could not upload the file: " + req.file.originalname,
            });
        }
    });

    app.post('/api/importCsv', requireLogin, async (req, res) => {
        console.log('body', req.body);
        console.log('data', csvDataStorage[req.session.csvDataKey]);

        const mappings = {
            'date': 'track_date'
        }

        const tableKeys = ['account', ...Object.values(req.body).map((v) => {
            if(!!mappings[v]) {
                return mappings[v];
            }
            return v;
        })];

        const details = await getUserDetails(req.user._id);
        const data = csvDataStorage[req.session.csvDataKey].map((row) => {
            return [details.account, ...row];
        });
        await insertCsvData(tableKeys, data)

        // todo add flash message
        res.redirect(`/preferences/data`);
    });

    app.get('/api/dataStore', requireLogin, async (req, res) => {
        console.log('dataStore', csvDataStorage);
        res.send();
    });
}
