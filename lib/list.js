var splitZipCity = require('./splitZipCity');
var _ = require('underscore');

var APP_MAPPING_VER = "v1";
var MAX_LIST_SIZE = 10;

var getList = function($){
	function isOrgnr(){ return $(this).text().trim() == 'Orgnr'; }
	// we find the tr 'orgnr' and go from there.	
	var list   = $('td.liste > b').filter(isOrgnr).parent().parent().nextAll('tr');
	var result = [];
	list.each(function(i){
	  if (i >= MAX_LIST_SIZE) return false;
		var $t      = $(this);
		var orgnr   = $t.find('td:first').text();
		var zipCity = splitZipCity($t.find('td:last').text());
		var name    = $t.find('td').eq(1).find('a').text();
		result.push(_.extend({
		  app: APP_MAPPING_VER,
			id 	     : orgnr,
			orgnr    : orgnr,
			name     : name
		}, zipCity));
	});
	return result;
};

module.exports = getList;