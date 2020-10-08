var express = require('express');
var fs = require('fs');

processUploadForm = (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {

        return res.json(JSON.stringify({"error": "No files were uploaded."}));
    }

    let sampleFile = req.files.sampleFile;

    let path = './public/csv/'+sampleFile.name;
    let redirect = '/file/' + sampleFile.name;

    if(fs.existsSync(path)){
        return res.json(JSON.stringify({'error': 'File already exists! Try another file'}));

    }

    sampleFile.mv(path , function(err) {
        if (err)
            return res.status(500).send(err);
        return res.redirect(redirect);

    });

}

module.exports = {
    processUploadForm: (req, res) => processUploadForm(req,res)
}