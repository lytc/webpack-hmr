'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (compiler, io) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  options = Object.assign({}, defaultOptions, options);
  var namespace = options.namespace;

  var log = (0, _debug2.default)('' + namespace);
  log.log = console.log.bind(console);

  function emit(payload) {
    io.emit(namespace, payload);
  }

  compiler.plugin('compile', function () {
    log('webpack building...');
    emit({ action: 'building' });
  });

  compiler.plugin('done', function (stats) {
    stats = stats.toJson();
    stats = stats.children && stats.children.length ? stats.children : [stats];

    stats.forEach(function (item) {
      var name = item.name;
      var hash = item.hash;
      var time = item.time;
      var modules = item.modules.reduce(function (modules, module) {
        modules[module.id] = module.name;
        return modules;
      }, {});

      log('webpack built ' + (name ? name + ':' : '') + hash + ' took ' + time + 'ms');

      emit({
        action: 'built',
        name: name,
        hash: hash,
        time: time,
        warnings: item.warnings,
        errors: item.errors,
        modules: modules
      });
    });
  });
};

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = { namespace: 'HMR' };