var Scraper              = require('./scraper');
var getCompanyProperties = require('./company');
var getList              = require('./list');

var cache = {};

module.exports = function(param, options, done){
    var optionsIsCb = typeof options === 'function';
    done    = optionsIsCb ? options : done;
    options = optionsIsCb ? {}      : options;

    var isCached = cache['param_'+param];
    if (!options.dontCache && isCached) {
        if (isCached.company && typeof options.onCompany === 'function') options.onCompany.call(isCached);
        if (isCached.list    && typeof options.onList === 'function')    options.onList.call(isCached);
        if (typeof done === 'function') done.call(isCached);
        return true;
    }

    var scraper = new Scraper('http://w2.brreg.no/enhet/sok/valg.jsp?inputparam=' + param);

    scraper.onPage(/^\/enhet\/sok\/detalj\.jsp/i, function(){
        this.company = getCompanyProperties(this.$);
        cache['param_'+param] = {'company': this.company, 'timestamp': Date.now()};
        if (typeof options.onCompany === 'function') options.onCompany.call(this);
        cache[param] = this.company;
    });

    scraper.onPage(/^\/enhet\/sok\/treffliste\.jsp/i, function(){
        this.list = getList(this.$);
        cache['param_'+param] = {'list': this.list, 'timestamp': Date.now()};
        if (typeof options.onList === 'function') options.onList.call(this);
    });

    if (typeof done === 'function') scraper.done(done);

    scraper.run();
};