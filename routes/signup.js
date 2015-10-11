var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Advertisement+' });
});

router.post('/register', function(req, res, next) {
	var form = req.body;
	if(form.email && form.password && form.phone && form.name){

		query('INSERT into users(name, email, password, phone) VALUES ($1, $2, $3, $4)', 
			[form.name, form.email, form.password, form.phone], function(err, rows, result){
				if(err) {
					console.log(err);
					res.render('signup', { title: 'Advertisement+' , error : 'Database Error! Please Try again'});
				}
				else res.render('signin', {title: 'Advertisement+', message: 'Registration Successful!'});
			});

	} else res.render('signup', { title: 'Advertisement+' , error : 'Missing Fields'});
});

module.exports = router;

		