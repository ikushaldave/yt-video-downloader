var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var url = require("url");
var ytdl = require("ytdl-core")

require("dotenv").config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
  console.log(process.env.PORT)
  res.render('index', { PORT: process.env.PORT });
});

app.get("/about", function(req, res, next) {
  res.render("about")
})

app.get("/contact", function(req, res, next) {
  res.render("contact")
})

app.get("/videoInfo",async function(request,response){
	const videoURL = request.query.videoURL;
  console.log(videoURL)
	const info = await ytdl.getInfo(videoURL);
	response.status(200).json(info);
});

app.get("/download",function(request,response){
	const videoURL = request.query.videoURL;
	const itag = request.query.itag;
  console.log(videoURL)
	response.header("Content-Disposition",'attachment;\ filename="video.mp4"');
	ytdl(videoURL,{
		filter: format => format.itag == itag
	}).pipe(response);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
