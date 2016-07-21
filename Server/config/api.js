var configApi = {
	"version": process.env.API_VERSION || '0.1.0'
};

configApi.checkVersion = function() {
	return ('0.1.0' === this.version);
}

module.exports = configApi;