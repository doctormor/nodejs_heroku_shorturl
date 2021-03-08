const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const mysql = require("mysql");
const cors = require("cors");
const shortid = require("shortid");
const moment = require("moment");

app.use(cors());
app.use(express.json());

// const db = mysql.createConnection({
//   user: "root",
//   host: "localhost",
//   password: "",
//   database: "shorturl",
// });

const db = mysql.createConnection({
  user: "id16328210_admin_shorturl",
  host: "https://databases.000webhost.com/",
  password: "c}LhYxv4YfQf2Z?B",
  database: "id16328210_shorturl",
});

app.get("/geturl/:code", (req, res) => {
  const shortcode = req.params.code;

  db.query(
    "SELECT * FROM url_record WHERE shortcode = ?",
    [shortcode],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.length > 0) {
          db.query(
            "UPDATE url_record set numofhits = numofhits + 1 WHERE shortcode = ?",
            [shortcode],
            (err, result) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        res.send(result);
      }
    }
  );
});

app.post("/create", (req, res) => {
  const fullurl = req.body.fullurl;
  const shortcode = shortid.generate();

  const expiredate = moment().add(1, "days").format("YYYY-MM-DD");
  db.query(
    "INSERT INTO url_record (fullurl,shortcode,expiredate) VALUES (?,?,?)",
    [fullurl, shortcode, expiredate],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(shortcode);
      }
    }
  );
});

app.get("/geturllist", (req, res) => {
  db.query("SELECT * FROM url_record ORDER BY id DESC", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/geturl", (req, res) => {
  const searchurl = req.body.searchurl;
  db.query(
    "SELECT * FROM url_record WHERE shortcode LIKE ?",
    [searchurl],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`App listening at port:${port}`);
});
