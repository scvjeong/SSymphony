
/*
 * GET meeting
 */

exports.main = function(req, res){
	/** session start **/
	if( !req.session.email || !req.session.email.length )
		res.redirect("/");
	/** session end **/

	res.render('meeting', { title: 'Express' });
};