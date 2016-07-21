var Hooks = function () {
  this.Before(function (callback) {
    process.env.AUTH_BYPASS = true;
    callback();
  });
};

module.exports = Hooks;
