const express = require('express')
const app = express();
var mysql = require('mysql');
const request = require('request');
const $ = require('cheerio');
var Sitemapper = require('sitemapper');
var sitemap= new Sitemapper();
var arrayOfUrls;
var mapObj = {
   AnswerAnswered:" ",
   byAnswerAnswered:" ",
   by:" "

};
 var con = mysql.createConnection({
   host: "localhost",
   port: '3306',
   user: "root",
   password: "root",
   database: "Crawler"
 })
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
sitemap.fetch('https://brainly.com/sitemap_task_0.xml').then(function(urls){
  console.log(urls.sites.length);
    arrayOfUrls=urls.sites;
    var interval = 1*1000; 
for (var i = 0; i <=arrayOfUrls.length; i++) {
    setTimeout( function (i) {
      console.log(arrayOfUrls[i]+  "|"+  "count:"+i);
        var url =arrayOfUrls[i];
        request(url, function(error, resp, body) { 
            if (error) return;
        var questiontext = $('h1', body).text().toString().replace(/AnswerAnswered|byAnswerAnswered|by/gi, function(matched){
       return mapObj[matched];
     }); 
      try{
         if(questiontext!=" "){
          var sql = "INSERT INTO questions (text) VALUES (?);";
          con.query(sql,[questiontext], function (err, result) {
         if (err) throw err;
          console.log("record inserted" + i);
       });
  
         }
       }catch(ex){
        console.log(ex);
        return;
       }

      //   fs.appendFile('mynewfile.txt', questiontext, function (err) {
      // if (err) throw err;
      //  });
        });
    }, interval*i, i);
}
})

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(8080, () => {
  console.log('Example app listening on port 8080!')
});