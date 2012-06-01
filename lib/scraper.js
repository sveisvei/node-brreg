var jsdom = require('jsdom');
var jquery = require('jquery');
var request = require('request');

function Scraper(url, options){
	this.url         = url;
	this.options     = options || {};
	this.options.url = this.url;
	this.callbacks   = [];
}

Scraper.prototype.run = function(){
	var scraper = this;
	request(scraper.options, function(err, res, body){
	  if (err){
	    console.log('Error while requesting page:' + err);
	  }
		scraper.currentPath = this.path;
		scraper.ready(err, body);
	});
};

Scraper.prototype.onPage = function(r, cb){ this.callbacks.push({ rex: r, cb: cb }); };
Scraper.prototype.done   = function(cb){ this.callbacks.push({ cb: cb }); };

Scraper.prototype.ready = function(err, body){
	var useEval = this.options.useEval ? null : { features: {'FetchExternalResources': false,	'ProcessExternalResources': false}};
	this.window = jsdom.jsdom(body, null, useEval).createWindow();
	this.$      = jquery.create(this.window);
	if (err) this.err = err;
	
	var scraper = this;
	this.callbacks.forEach(function(obj){
		var match = obj.rex && scraper.currentPath.match(obj.rex);
		if (match || !obj.rex && obj.cb){ obj.cb.call(scraper); }
	});
};

module.exports = Scraper;