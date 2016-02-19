var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

var pg = require('pg');
var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/iota';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/employee_records', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM employee_records ORDER BY id ASC');

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            done();
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }
    });
});

app.post('/employee_records', function(req, res) {
    var addEmployee = {
        empFirstName: req.body.empFirstName,
        empLastName: req.body.empLastName,
        empID: req.body.empID,
        jobTitle: req.body.jobTitle,
        empSalary: req.body.empSalary
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO employee_records (first_name, last_name, emp_id, job_title, emp_salary) VALUES" +
            " ($1, $2, $3, $4, $5)",
            [addEmployee.empFirstName, addEmployee.empLastName, addEmployee.empID, addEmployee.jobTitle, addEmployee.empSalary],
            function(err, result) {
                done();

                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            }
        );
    });
});

app.get('/*', function(req, res) {
    var file = req.params[0] || 'views/index.html';
    res.sendFile(path.join(__dirname, './server/public/', file));
});


app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});