
/*
 * GET meeting
 */

exports.main = function(req, res){
	/** session start **/
	req.session.id = "scvjeong";
	req.session.nickname = "Dream Supporter";
	if( req.session.id.length < 1 )
		res.redirect("/page/login");
	/** session end **/

	res.render('meeting', { title: 'Express' });
};