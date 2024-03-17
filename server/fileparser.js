// AWS S3 Setup - JG

const formidable = require("formidable");
const Transform = require("stream").Transform;

//How to Upload to the S3 Bucket
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client, S3 } = require("@aws-sdk/client-s3");

const parsefile = async (req) => {
  return new Promise((resolve, reject) => {
    let options = {
      maxFileSize: 100 * 1024 * 1024, //100 MBs converted to bytes
      allowEmptyFiles: false,
    };

    const form = formidable(options);
    form.parse(req, (err, fields, files) => {});

    form.on("error", (error) => {
      reject(error.message);
    });

    form.on("data", (data) => {
      if (data.name === "successUpload") {
        resolve(data.value);
      }
    });

    form.on("fileBegin", (formName, file) => {
      file.open = async function () {
        this._writeStream -
          new Transform({
            transform(chunk, encoding, callback) {
              callback(null, chunk);
            },
          });
        this._writeStream.on("error", (e) => {
          form.emit("error", e);
        });
      };
    });
  });
};

module.exports = parsefile;
