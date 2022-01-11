//ptp.getPrinters().then(console.log);

var express = require("express");
var ptp = require("pdf-to-printer");
var http = require('http');
var fs = require('fs');
var path = require('path');

const app = express();
const port = 3000;

var download = function(url, dest, options, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
      file.on('finish', function() {
        file.close(cb);  // close() is async, call cb after close completes.
        ptp.print(dest, options);
      });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

app.post('', express.raw({ type: 'application/pdf' }), async(req, res) => {

  const options = {};
  if (req.query.printer) {
    options.printer = req.query.printer;
  }

  var pdfFile = req.query.pdffile;

  download('http://posdemo.restopos.me/application/modules/ordermanage/controllers/generated_pdf/'+pdfFile, pdfFile, options);

  res.status(204);
  res.send();
});

app.listen(port, () => {
  
  // setInterval(function() {
  //   console.log("hello");
  // }, 1000);
  //download('http://posdemo.restopos.me/application/modules/ordermanage/controllers/generated_pdf/1-1641774761-tokenprint.pdf', '1-1641774761-tokenprint.pdf');
});