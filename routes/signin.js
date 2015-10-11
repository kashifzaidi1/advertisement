var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('signin', { title: 'Advertisement+' });
});

router.post('/login', function(req, res, next) {
	var form = req.body;
	if(form.email && form.password){

		query('SELECT id, name, email FROM users WHERE LOWER(email) = LOWER($1) AND password = $2;', 
			[form.email, form.password], function(err, rows, result){
				if(err) {
					console.log(err);
					res.render('signin', { title: 'Advertisement+' , error : 'Database Error! Please Try again'});
				} else if(result.rowCount === 0){
					res.render('signin', { title: 'Advertisement+' , error : 'Incorrect Combinations.'});
				}
				else {
					req.session.user = {
						id: rows[0].id,
						name: rows[0].name
					};
					res.redirect('/home');
				}
			});

	} else res.render('signin', { title: 'Advertisement+' , error : 'Missing Fields'});
});


module.exports = router;