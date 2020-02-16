require('dotenv').config()
const express = require("express");
const AWS = require('aws-sdk');

const app = express();
const PORT = 3000;

app.get("/:bucket/(*/:key|:key)", (req, res) => {
    let {bucket, key} = req.params;

    let s3 = new AWS.S3({
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
        // endpoint: process.env.HOST ,
        // s3ForcePathStyle: true, // needed with minio?
        signatureVersion: 'v4'
    });
    s3.getObject({Bucket: bucket, Key: key, Range: "bytes=0-"}, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else{
            if (data.ContentType.includes("gzip")){
                res.set('Content-Encoding', 'gzip');
            }
            res.send(data.Body);
        }
    });
});

app.listen(PORT, () => {
    console.log("The server is running on port:", PORT);
});