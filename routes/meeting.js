exports.main = function(req, res){
	/** session start **/
	if( !req.session.email || !req.session.email.length )
		res.redirect("/");
	/** session end **/

	res.render('meeting', { title: 'Express' });
};

exports.appraisal = function(req, res){
	/** session start **/
	if( !req.session.email || !req.session.email.length )
		res.redirect("/");
	/** session end **/

	res.render('appraisal', { title: 'Express' });
};

exports.result = function(req, res){
	/** session start **/
	if( !req.session.email || !req.session.email.length )
		res.redirect("/");
	/** session end **/

	res.render('result', { title: 'Express' });
};