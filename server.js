//Requirement
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
app.set("view engine", "ejs");

//Body Parser requirements
var bodyParser = require("body-parser");
const { json } = require("body-parser");
const { render } = require("art-template");
const { send } = require("process");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use('/search_page', search_page);

//Server Launch fucntion
function init() {
  app.engine("html", require("express-art-template"));

  //Use css and javascript file
  app.use("/style/", express.static("./style/"));
  app.use(express.static(__dirname + "/script"));

  //Launch index.html
  app.get("/", function (request, response) {
    response.sendFile(__dirname + "/index.html");
  });
  app.listen(process.env.PORT || 8000, () => console.log("Server started"));
}

//Declare database variables
var db;
var dburl =
  "mongodb+srv://hyp9617:0000@cluster0.70jkq.mongodb.net/<dbname>?retryWrites=true&w=majority";

//Connecting Database Section
MongoClient.connect(dburl, function (err, client) {
  db = client.db("searchapp");
  if (err) return console.log("error...");
  init();
  console.log("DB has been connected!");
});

//Search keyword from Database
app.post("/search", function (req, res) {
  var word = req.body.keyword;
  db.collection("post")
    .find({ Name: word })
    .toArray(function (err, result) {
      if (err) {
        return console.log(err);
      }
      var list = [];
      list = result.slice(0);
      console.log(list);
      res.render("search.ejs", { posts : list});
    });
});

