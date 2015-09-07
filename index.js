var express=require('express');
var request = require('request');
var app=express();
var http=require('http').Server(app);
var cheerio = require('cheerio');
var io=require('socket.io')(http);
var dic=new Set();
app.use(express.static('../public'));
var link='https://en.wikipedia.org/wiki/Nucleic_acid_sequence';
var calllist=[[0,'https://en.wikipedia.org/wiki/Nucleic_acid_sequence']];
var count=0;
setInterval(function(){
	var t;
	t=calllist.shift();
	link=t[1];
	request('http://localhost:3000/start',function(error, response, body){
		console.log(t);
	})},5000);
var mid=function(req,res,next){
	request(link, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	req.body=body;
	  	next();
	  }
	})
}
app.get('/start',mid,function(req,res){
	$ = cheerio.load(req.body);
	var temp=$('.mw-redirect');
	var t;
	count++;
	for( var i in temp ){
		if(!isNaN(parseInt(i.toString()))){
			t='https://en.wikipedia.org'+temp[i]['attribs']['href'];
			if(!dic.has(t)){
				dic.add(t);
				calllist.unshift([count,t]);
			}
		}
	}
	io.emit('new_page',req.body);
	res.send(req.body);
});
exports.app=http;