const fs = require('fs');
const express = require("express")
const app = express();
const port = 3000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
});

app.get("/saveFile", (req, res) => {
    var title = req.query.title;
    var content = req.query.content;

    writeToFile(title, content);
    res.send("Saved successfully!");
})

app.get("/getAllFiles", (req, res) => {
    var arrOfFiles = []
    fs.readdir("./saved-files", (err, files) => {
        

        if (err) throw err;
        files.forEach(file => {
            arrOfFiles.push(file);
        })
        
        res.send(arrOfFiles);
    })
})

app.get("/readFile", (req, res) => {
    fs.readFile("./saved-files/" + req.query.name, "utf-8", (err, data) => {
        if(err) throw err;

        res.send(data);
    })
})

function writeToFile(title, content) {
    fs.writeFile("./saved-files/" + title.toLowerCase() + ".txt", content, (err) => {
        if(err) throw err;
    })
}

app.listen(port, () => {
    console.log("Backend is operating on port "  + port);
})