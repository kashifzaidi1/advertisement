var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	if(req.session.admin){
		query('SELECT id, name, email FROM employees;', 
			[], function(err, rows, result){
				if(err || result.rowCount === 0){
					res.render('admin', { title: 'WebAdv Admin' , message : 'failed', name : 'Admin' });
				} else {
					res.render('admin', { title: 'WebAdv' , data : rows, name : 'Admin'});
				}
			});	

	} else res.redirect('/admin/sign_in');
});

router.get('/sign_in', function(req, res){
	if(req.session.admin){
		res.redirect('/admin/');
	} else {
		res.render('admin_signin', {title : 'WebAdv Admin login', data: [], name: 'Admin Login'})
	}
});

router.post('/login', function(req, res, next) {
	var form = req.body;
	console.log(form.email, form.password);
	if(form.email && form.password){

		if(form.email !== 'admin@admin.com' || form.password !== '123456'){
			res.render('admin_signin', { title: 'WebAdv Admin Login' , error : 'Incorrect Combinations.'});
		} else {
			req.session.admin = {
				name: 'Admin'
			};
			res.redirect('/admin');
		}

	} else res.render('admin_signin', { title: 'WebAdv' , error : 'Missing Fields'});
});

router.post('/add_employee', function(req, res, next) {
	var form = req.body;
	if(form.email && form.password && form.name){

		query('INSERT into employees (name, email, password) VALUES ($1, $2, $3)', 
			[form.name, form.email, form.password], function(err, rows, result){
				if(err) {
					console.log(err);
					res.render('admin', { title: 'WebAdv Admin' , error : 'Database Error! Please Try again'});
				}
				else res.redirect('/admin');
			});

	} else res.render('admin', { title: 'WebAdv' , error : 'Missing Fields'});
});

router.post('/edit_employee', function(req, res, next) {
	var form = req.body;
	if(form.email && form.password && form.name && form.id){

		query('UPDATE employees SET name = $1, email = $2, password=$3 WHERE id=$4', 
			[form.name, form.email, form.password, form.id], function(err, rows, result){
				if(err) {
					console.log(err);
					res.render('admin', { title: 'WebAdv Admin' , error : 'Database Error! Please Try again'});
				}
				else res.redirect('/admin');
			});

	} else res.render('admin', { title: 'WebAdv' , error : 'Missing Fields'});
});

router.post('/delete_employee', function(req, res, next) {
	var form = req.body;
	if(form.id){

		query('DELETE from employees WHERE id=$1', 
			[form.id], function(err, rows, result){
				if(err) {
					console.log(err);
					res.render('admin', { title: 'WebAdv Admin' , error : 'Database Error! Please Try again'});
				}
				else res.redirect('/admin');
			});

	} else res.render('admin', { title: 'WebAdv' , error : 'Missing Fields'});
});


module.exports = router;