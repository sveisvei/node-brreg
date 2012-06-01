var splitZipCity = require('./splitZipCity');

function unworthy(v){ return !!v; }

function trim(val){
	if (!val) {return null;}
	return val.replace('&nbsp;', ' ').trim();
}

var APP_MAPPING_VER = "v1";
var map = {
	'Telefon'					 : 'phone',
	'Mobil'  					 : 'mobile',
	'Telefax'					 : 'fax',
	'Daglig leder/ adm.direktør' : 'ceo',
	'Navn/foretaksnavn'			 : 'name',
	'Internettadresse'			 : 'web',
	'Kontaktperson'				 : 'contact'	
};

var getKeyValue = function($, obj) {
	return function(){
		var $t = $(this);
		// fetch value
		var elem = $t.closest('tr').find('td:last > p');
		if (elem === null) { return console.error('failed', this); }
		// fetch html value(hopefully not deep) of selected element
		var val = ('' + elem.html()).trim();
		// catch linebreaks
		if (val.indexOf('<br />') !== -1) {
			val = val.split('<br />').map(trim).filter(unworthy);
		}
		// catch newlines
		if (val.indexOf('\n') !== -1){
			val = val.split('\n').map(trim).filter(unworthy);
		}
		// catch links
		if (val && val.indexOf('<a') !== -1){
			val = {
				web  : $(val).attr('href'),
				text : $(val).text()
			};
		}		
		// make key
		var key = ('' + $t.text()).trim().replace(/:$/, '');		
		// set val if key and a non null value
		if (key && key !== '' && val && val !== 'null') {
			obj[key] = val;
		} else {
			// ignoring unworthy key/val
			// console.log('CANT set ' +key);
		}
	};			
};

var getCompanyProperties = function($) {
	var obj = {};
	// 'td > p > b' is a very, very hacky start point.
	$('td > p > b').each(getKeyValue($, obj));
	
	var result = { 
		app : APP_MAPPING_VER, 
		timestamp       : Date.now(),
		id              : obj.Organisasjonsnummer.replace(/\s+/gi, '') 
	};
	// fetch visit_address
	var addr = obj.Forretningsadresse;
	if (addr && $.isArray(addr)) {
		result.address = {};
		result.address.text = addr.slice(0, addr.length -1).join(', ');
		var addressZipCity  = splitZipCity(addr[addr.length-1]);
		result.address.zip 	= addressZipCity.zip;
		result.address.city = addressZipCity.city;
	}
	// fetch post_address
	var po = obj.Postadresse;
	if (po && $.isArray(po)){
		result.postaddress = {};
		result.postaddress.text =  po.slice(0, po.length -1).join(', ');				
		var poZipCity           = splitZipCity(po[po.length-1]);
		result.postaddress.zip  = poZipCity.zip;
		result.postaddress.city = poZipCity.city;
	}	
	// flat values
	var val;
	for(var key in map){
		val = obj[key];
		if (val && val !== '-') {
			if ($.isArray(val)) {
				result[map[key]] = val.join(', ');				
			} else if (val.web) {
				result[map[key]] = val.web;				
			} else {
				result[map[key]] = val;			
			}
		}
	}
	// fetch email link
	if (obj['E-postadresse'] !== '-') result.email = obj['E-postadresse'].text;
	// set src data
	result.data = obj;
	return result;
};

module.exports = getCompanyProperties;