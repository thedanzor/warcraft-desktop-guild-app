var request = require("request");

const getData = (url) => {
	return new Promise( (resolve, reject) => {
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				body = JSON.parse(body);
				resolve(body);
			} else {
				reject(error);
			}
		})
	});
};

module.exports = getData;
