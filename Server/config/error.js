var configError = {};

configError.codes = {};
configError.codes["10001"] = "Name field is required!";

configError.getMessage = function(code) {
	return this.codes[''+code];
}

module.exports = configError;