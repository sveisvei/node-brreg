var http  = require('http');
var url   = require('url');
var bfind = require('./index');
require('colors');

http.createServer(function(req, res){
  var request  = url.parse(req.url, true);
  var name = request.query.callback||'hollaback';
  
  if (!request.query.find) return res.end('Missing ' + request.query.find);
  
  bfind(request.query.find, function(){
    var body = "";
    var result = {};
    res.writeHead(200, {
      'Content-Type'                  : 'text/javascript;charset=utf-8', 
      'Access-Control-Allow-Origin'   : '*',
      'Access-Control-Max-Age'        : '33628800',
      'Access-Control-Allow-Methods'  : 'GET'
    });    
    if (this.err){
      result.action = 'error'
    } else if (this.company){
      result.action = 'company';
      result.data = this.company;
    } else {
      result.action = 'list';
      result.data = this.list;
    }
    body = name+'('+JSON.stringify(result)+');';          
    res.end(body, 'utf8');
    console.log('[BRREG]'.red, 'served on search term'.green, (request.query.find+'').blue.bold)
  });
  
}).listen(3004);