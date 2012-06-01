var bfind     = require('./index');
var listCb    = function (list){};
var companyCb = function (company){};
var options = {onCompany: companyCb, onList: listCb};

function logCompany(){
	console.log('Found company:\n', this.company.name, this.company.id);	
}

bfind('KONICA MINOLTA BUSINESS SOLUTIONS', options, function(){
	var id = this.list[1].id;
	console.log(this.list[1]);
	bfind(id, logCompany);
	bfind('993925837', logCompany);
});

bfind('993925837', logCompany);
