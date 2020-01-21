const express = require('express');
const app = express();
const PORT = process.env.PORT || process.argv[2] || 9681;
const handlebars = require('express-handlebars');
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  partialsDir: `${__dirname}/views/partials`,
}));



app.get('/', (req, res) => res.status(200).render('home'));
app.get('/about', (req, res) => res.status(200).render('about'));
app.get('/jobs', (req, res) => res.status(200).render('jobs'));
app.get('/gallery', (req, res) => res.status(200).render('gallery'));


app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(PORT, function()
{
	console.log('App started on port ' + PORT + '; Press Ctrl-C to terminate.');
});