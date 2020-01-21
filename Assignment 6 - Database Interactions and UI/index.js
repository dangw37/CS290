const express = require('express');
const app = express();
const handlebars = require('express-handlebars')
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const request = require('request');

const PORT = process.env.PORT || process.argv[2] || 9610;

app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
}));  

// login info
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_dangw',
  password        : '8689',
  database        : 'cs290_dangw',
});



// reload table
app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT NOT NULL,"+
    "weight INT NOT NULL,"+
    "date DATE NOT NULL,"+
    "lbs BOOLEAN NOT NULL)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

//insert value in table, reference: https://dev.mysql.com/doc/refman/5.7/en/insert.html
app.get('/insert',function(req,res,next){
  var context = {};
  console.log("test");
  console.log(req.query);
  pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?,?,?,?,?)", [req.query.name,req.query.reps,req.query.weight,req.query.date,req.query.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
  });
  pool.query('SELECT id, name, reps, weight, date, lbs FROM workouts', function(err, rows, results){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.send(JSON.stringify(context));
  });
});

app.get('/',function(req,res,next){
  var context = {};
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    context.results = rows;
    res.render('home', context);
  });
});

//change where select information from row reference: https://dev.mysql.com/doc/refman/5.7/en/select.html
app.get('/edit',function(req,res,next){
  var context = {};
  pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows[0];
    res.render('update', context);
  });
});

//update query reference: https://www.tutorialspoint.com/mysql/mysql-update-query.htm
app.get('/update',function(req,res,next){
  var context = {};

  pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
    return;
  }
  if(result.length == 1){
    var curVals = result[0];
    pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id = ?",
    [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id], function(err, results){
      if(err){
        next(err);
      return;
    }
    pool.query('SELECT * FROM workouts', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      res.render('home', context);
        });
      });
    }
  });
});

//delete function reference: https://dev.mysql.com/doc/refman/5.7/en/delete.html
app.get('/delete',function(req,res,next){
  var context = {};
    pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
      if(err){
        next(err);
        return;
      }
    pool.query('SELECT * FROM workouts', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      res.send(JSON.stringify(rows));
  })
  });
});


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