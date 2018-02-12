var async = require('async');

module.exports = function (req, res) {
	var keystone = req.keystone;
	var counts = {};
	var nav = JSON.parse(JSON.stringify(keystone.nav));
	async.each(keystone.lists, function (list, next) {
		if (!list.canView(req.user)) {
			for (var i=0; i<nav.sections.length; i++) {
				let listArray = nav.sections[i].lists;
				for (var j=0; j<listArray.length; j++) {
					if (listArray[j]) {
						if (listArray[j].path == list.path) {
							delete listArray[j];
						}
					}
				}
			}

		}
		list.model.count(function (err, count) {
			if (req.user.isAdmin) {
				counts[list.key] = count;
			}
			next(err);
		});
	}, function (err) {
		if (err) return res.apiError('database error', err);
		return res.json({
			counts: counts,
			nav: Object.assign(nav, {
				sections: nav.sections.filter((section) => section.lists.filter((a) => a).length > 0)
			})
		});
	});
};
