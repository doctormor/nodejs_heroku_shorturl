const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const pg = require("pg");
const cors = require("cors");
const shortid = require("shortid");
const moment = require("moment");

app.use(cors());
app.use(express.json());

const db = new pg.Client({
  connectionString: process.env.postgres://oapamfpesoeavt:d6fce8e0da55819d1ec2a98d498523750b82529e83cb05007867516b67ecbc50@ec2-54-161-239-198.compute-1.amazonaws.com:5432/d3pjlvjn41vsn9,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect();

app.get("/geturl/:code", (req, res) => {
  const shortcode = req.params.code;

  db.query(
    "SELECT * FROM url_record WHERE shortcode = $1",
    [shortcode],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.rows.length > 0) {
          db.query(
            "UPDATE url_record set numofhits = numofhits + 1 WHERE shortcode = $1",
            [shortcode],
            (err, result) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        res.send(result.rows);
      }
    }
  );
});

app.post("/create", (req, res) => {
  const fullurl = req.body.fullurl;
  const shortcode = shortid.generate();

  const expiredate = moment().add(1, "days").format("YYYY-MM-DD");
  db.query(
    "INSERT INTO url_record (fullurl,shortcode,expiredate) VALUES ($1,$2,$3)",
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
      res.send(result.rows);
    }
  });
});

app.post("/geturl", (req, res) => {
  const searchurl = req.body.searchurl;

  db.query(
    "SELECT * FROM url_record WHERE shortcode LIKE $1",
    ["%" + searchurl + "%"],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result.rows);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`App listening at port:${port}`);
});
