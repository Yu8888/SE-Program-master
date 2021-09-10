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
  // app.engine("html", require("express-art-template"));

  //Use css and javascript file
  app.use("/style/", express.static("./style/"));
  app.use(express.static(__dirname + "/script"));

  //Launch index.html
  app.get("/", function (request, response) {
    response.sendFile(__dirname + "/index.html");
  });
  app.listen(process.env.PORT || 5000, () => console.log("Server started"));
}
init();
//Declare database variables
var db;
var uri =
"mongodb+srv://hyp9617:0000@cluster0.70jkq.mongodb.net/<dbname>?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Connecting Database Section
// MongoClient.connect(dburl, function (err, client) {
//   db = client.db("searchapp");
//   if (err) return console.log("error...");
//   init();
//   console.log("DB has been connected!");
// });
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
  console.log("success")
});
//Search keyword from Database
app.post("/search", function (req, res) {
  var word = req.body.keyword;
  db.collection("post")
    .find({ name: word })
    .toArray(function (err, result) {
      if (err) {
        return console.log(err);
      }
      var list = [];
      list = result.slice(0);
      console.log(list);
      res.render("search.ejs", { posts: list });
    });
});

//Render index page
app.get("/home", function (req, res) {
  res.render(__dirname + "/index.html");
});

//Login page
app.get("/login", function (req, res) {
  res.render("login.ejs");
});

//Login funtion
app.post("/login", function (req, res) {
  var body = req.body;
  console.log(body);
  db.collection("users").findOne(
    {
      email: body.email,
      password: body.password,
    },
    function (err, data) {
      if (err) {
        return res.status(500).json({
          err_code: false,
          message: "Server error",
        });
      }

      if (data == null) {
        return res.status(200).json({
          // success: true,
          err_code: 1,
          message: "not OK",
        });
      } else if (data) {
        console.log(data);
        return res.status(200).json({
          // success: true,
          err_code: 0,
          message: "ok",
        });
      }
    }
  );
});

//Registration page
app.get("/register", function (req, res) {
  res.render("registeration.ejs");
});

// Registration function
app.post("/register", function (req, res) {
  var body = req.body;
  console.log(body);
  db.collection("users").findOne({ name: body.account_number }, function (
    err,
    data
  ) {
    if (err) {
      return res.status(500).json({
        err_code: false,
        message: "Server error",
      });
    }

    if (data === null) {
      console.log("1");
      db.collection("users")
        .insertOne({
          email: body.email,
          account_number: body.account_number,
          password: body.password,
        })
        .then(function () {
          res.status(200).json({
            // success: true,
            err_code: 0,
            message: "OK",
          });
        });
    } else if (data) {
      console.log(data);
      return res.status(200).json({
        // success: true,
        err_code: 1,
        message: "Email or account number already exists",
      });
    }
  });
});

//Analyst Page
app.get("/analyst", function (req, res) {
  db.collection("submittedData")
    .find()
    .toArray(function (err, result) {
      if (err) {
        return console.log(err);
      }
      var list = [];
      list = result.slice(0);
      console.log(list);
      res.render("analyst.ejs", { subdata: list });
    });
});

//Get submitter
app.get("/submitter", function (req, res) {
  res.render("submitter.ejs");
});

//Get Analyst
// app.get("/analyst", function(req, res) {
//   res.render("analyst.ejs");
// });

//Submitter submission function
app.post("/submitter", function (req, res) {
  var title = req.body.title;
  var author = req.body.author;
  var content = req.body.content;
  var length;

  db.collection("submittedData")
    .find()
    .toArray(function (err, result) {
      if (err) return err;
      length = result.length;
      db.collection("submittedData")
        .insertOne({
          _id: length.toString(),
          Title: title,
          Author: author,
          Content: content,
        })
        .then(res.render("submitter.ejs"))
        .catch(function (err) {
          console.log(err);
        });
    });
});

app.delete("/delete", function (req, res) {
  db.collection("submittedData").deleteOne(req.body, function (err, result) {
    if (err) {
      console.log(err);
    }
    // db.collection("submittedData").find(req.body).toArray(function (err, result) {
    // })
    // console.log("delete complete");
    res.status(200).send("done");
  });
});

app.post("/add", function (req, res) {
  console.log(req.body);
  db.collection("post").insert(req.body, function (err, result) {
    if (err) return err;
    console.log("insert result");
    console.log(result);
    db.collection("post")
      .find()
      .toArray(function (err, result) {
        console.log("find result");
        console.log(result);
      });
  });
});