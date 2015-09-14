var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	if(req.session.employee){
		query('SELECT id, name, description, platforms, "to", "from" FROM campaigns WHERE TRUE;', 
			[], function(err, rows, result){
				if(err || result.rowCount === 0){
					res.render('employee', { title: 'WebAdv' , message : 'failed', name : req.session.employee.name });
				} else {
					console.log(rows);
					res.render('employee', { title: 'WebAdv' , data : rows, name : req.session.employee.name});
				}
			});	

	} else res.redirect('/employee/sign_in');
});

router.get('/sign_in', function(req, res){
	if(req.session.employee){
		res.redirect('/employee/');
	} else {
		res.render('employee_signin', {title : 'WebAdv Employee login', data: [], name: 'Employee Login'})
	}
});

router.post('/login', function(req, res, next) {
	var form = req.body;
	console.log(form.email, form.password);
	if(form.email && form.password){

		query('SELECT id, name, email FROM employees WHERE LOWER(email) = LOWER($1) AND password = $2;', 
			[form.email, form.password], function(err, rows, result){
				if(err) {
					console.log(err);
					res.render('employee_signin', { title: 'WebAdv' , error : 'Database Error! Please Try again'});
				} else if(result.rowCount === 0){
					res.render('employee_signin', { title: 'WebAdv Employee Login' , error : 'Incorrect Combinations.'});
				}
				else {
					req.session.employee = {
						id : rows[0].id,
						name : rows[0].name
					};
					res.redirect('/employee');
				}
			});
	} else res.render('employee_signin', { title: 'WebAdv' , error : 'Missing Fields'});
});

router.post('/add_employee', function(req, res, next) {
	var form = req.body;
	if(form.email && form.password && form.name){

		query('INSERT into employees (name, email, password) VALUES ($1, $2, $3)', 
			[form.name, form.email, form.password], function(err, rows, result){
				if(err) {
					console.log(err);
					res.render('employee', { title: 'WebAdv Employee' , error : 'Database Error! Please Try again'});
				}
				else res.redirect('/employee');
			});

	} else res.render('employee', { title: 'WebAdv' , error : 'Missing Fields'});
});

router.post('/edit_campaign', function(req, res, next) {
	var form = req.body;
	if(form.description && form.platforms && form.name && form.id){

		query('UPDATE campaigns SET name = $1, description = $2, platforms=$3 WHERE id=$4', 
			[form.name, form.description, form.platforms, form.id], function(err, rows, result){
				if(err) {
					console.log(err);
					res.render('employee', { title: 'WebAdv Employee' , error : 'Database Error! Please Try again'});
				}
				else res.redirect('/employee');
			});

	} else res.render('employee', { title: 'WebAdv' , error : 'Missing Fields'});
});

router.post('/delete_campaign', function(req, res, next) {
	var form = req.body;
	if(form.id){

		query('DELETE from campaigns WHERE id=$1', 
			[form.id], function(err, rows, result){
				if(err) {
					console.log(err);
					res.render('employee', { title: 'WebAdv Employee' , error : 'Database Error! Please Try again'});
				}
				else res.redirect('/employee');
			});

	} else res.render('employee', { title: 'WebAdv' , error : 'Missing Fields'});
});


module.exports = router;