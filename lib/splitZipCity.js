module.exports = function(zipCity){
	var match = zipCity.match(/(\d+)\s+(.*)/i);
	var obj = {};
	if (match && match[1])  obj.zip = match[1]
	if (match && match[1])  obj.city = match[2]
	obj.country = !match ? zipCity : 'Norge';
	return obj;
}