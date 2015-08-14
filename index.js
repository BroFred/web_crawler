var express=require('express');
var request = require('request');
var app=express();
var cheerio = require('cheerio');
app.use(express.static('./public'));
var mid=function(req,res,next){
	request('https://en.wikipedia.org/wiki/Nucleic_acid_sequence', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	req.body=body;
	  	next();
	  }
	})
}
app.get('/',mid,function(req,res){
	$ = cheerio.load(req.body);
	var reg =/[\s\w]+/i
	console.log(reg.exec($('head').children('title').text())[0]);
	console.log($('image').attr.toString());
	res.send(req.body);
});
exports.app=app;