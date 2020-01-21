const express = require('express');
const app = express();
const port = 9689;
const bodyParser = require('body-parser');



app.set('view engine', 'pug');

/* set body parser to parse application */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* handle GET and POST requests */
app.get('/', (req, res) => {
    res.render('index', {title: "Using Pug", welcomeMessage: "Welcome to the GET and POST checker!"})
});

app.get('/api/v1/_test', (req, res) => {
    res.render('test', {title: "GET Request", message: "GET request received!", params: req.query});
});

app.post('/api/v1/_test', (req, res) => {
    res.render('test', {title: "POST Request", message: "POST request received!", params: req.body})
})

/* 404 and 500 handlers used from lecture examples */ 

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(port, function()
{
	console.log('App started on port ' + port + '; Press Ctrl-C to terminate.');
});