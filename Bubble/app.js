var express = require("express");
var mysql = require("mysql");

var connection = mysql.createConnection({
 host: 'hostname',
 port: 'port',
 user: 'username',
 password: 'password',
 database: 'databasename'
});

var app = express();

connection.connect(function(err) {
 if (!err) {
  console.log("Database is connected");
 } else {
  console.log("Error connecting to the database");
 }
});

var queryString = "Select * from schedulelist s inner join channellist c where s.channelid = c.channelid and c.name = 'UTV Movies' and s.starttime < now() and s.endtime > now()";

connection.query(queryString,function(err,rows,fields) {
 if (err) {
  console.log(err);
 } else {
  rows.forEach(function(row){
   console.log(row);
  });
 }
});

connection.end();
