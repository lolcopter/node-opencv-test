var express = require('express'),
    cv      = require('opencv'),
    fs      = require('fs'),
    app     = express();

app.use(express.multipart());
console.log();
app.get('/', function(req, res){

    res.setHeader('Content-Type', 'text/html' );
    res.write("<form method='post' enctype='multipart/form-data' action='img'>" +
            "<input type='file' name='img'/><input type='submit'><br />"+
            "Cascades: <select name='cascade'>");
    fs.readdirSync("node_modules/opencv/data/").forEach(function(it) {
        res.write("<option>" + it + "</option>")
    });
    res.end("</select>"+
            "</form>");
});

app.post('/img', function(req, res){
    cv.readImage(req.files.img.path, function(err, im){
      im.detectObject("node_modules/opencv/data/" + req.body.cascade, {}, function(err, faces){
        for (var i=0;i<faces.length; i++){
          var x = faces[i]
          im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
        }
        res.setHeader('Content-Type', 'image/png' );
        res.end(im.toBuffer());
      });
    })
})

app.listen(3000);