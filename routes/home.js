var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	if(!req.session.user){
		res.redirect('/signin');
	}
  	else {
  		query('SELECT id, name, description, platforms, "to", "from" FROM campaigns WHERE user_id = $1;', 
  			[req.session.user.id], function(err, rows, result){
  				if(err || result.rowCount === 0){
  					res.render('home', { title: 'Advertisement+' , message : 'failed', name : req.session.user.name });
  				} else {
  					console.log(rows);
  					res.render('home', { title: 'Advertisement+' , data : rows, name : req.session.user.name});
  				}
  			});	
  	}
});

router.get('/logout', function(req, res, next){
	delete req.session.user;
	if(req.session.admin){
		delete req.session.admin;
	}
	if(req.session.employee){
		delete req.session.employee;
	}
	res.redirect('/signin');
});

router.post('/campaign', function(req, res, next){
	var form = req.body;
	if(form.name && form.description && form.platforms && form.to && form.from){

		query('INSERT into campaigns(name, description, platforms, "to", user_id, "from") VALUES ($1, $2, $3, $4, $5, $6)', 
			[form.name, form.description, form.platforms, form.to, req.session.user.id, form.from], function(err, rows, result){
				if(err) {
					console.log(err);
					res.status(500).json({
						error : true,
						message : "Database Error! Please Try again."
					});
				}
				else {
					res.status(200).json({
						error : false,
						message : "Successfully Added."
					});
				}
			});

	} else res.status(500).json({
		error : true,
		message : "Missing Fields."
	});
});

module.exports = router;
