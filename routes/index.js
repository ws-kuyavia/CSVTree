var express = require('express');
var csv = require('../helpers/parseCSV.js');
var router = express.Router();
var UploadForm = require('../helpers/fileUploadForm.js');
var fs = require('fs');

var nodes;
let fileList;
let title = 'CSV Tree';
let csvDir = './public/csv/';
let populateList = (err, data) => {
    fileList = data;
}
fs.readdir(csvDir, populateList);

router.get('/', function (req, res, next) {
let file;

    if(fileList.length > 0){
        console.log(fileList.length);
        file = csvDir + fileList[0];
        nodes = csv.getData(file);
    }

    res.render('index', {
        title: title,
        nodes: nodes,
        fileList: fileList,
        formAction: '/upload'
    });
});


router.get('/file/:file', function (req, res, next) {
let filePath = './public/csv/' + req.params.file;

    fs.readdir(csvDir, populateList);

    csv.getDataAsync(filePath, (data) => {

        res.render('index', {
            title: title,
            nodes: data,
            fileList: fileList,
            formAction: 'http://localhost:3000/upload'
        });
    })

});

router.post('/upload', function (req, res) {
    UploadForm.processUploadForm(req, res);
    fs.readdir('./public/csv/', populateList);
});

router.post('/tree', function (req, res) {
    nodes = csv.getData('./public/csv/' + req.body.fileName);
    res.send(JSON.stringify({nodes: nodes}));
});

module.exports = router;