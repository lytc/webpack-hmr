'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (socket) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (!module.hot) {
    throw new Error('Hot Module Replacement is disabled.');
  }

  options = Object.assign({}, defaultOptions, options);
  var namespace = options.namespace;
  var log = (0, _debug2.default)('' + namespace);
  var warn = (0, _debug2.default)('' + namespace);
  var error = (0, _debug2.default)('' + namespace);
  log.log = console.log.bind(console);
  log.warn = console.warn.bind(console);
  log.error = console.error.bind(console);

  function processUpdate(hash, modules) {
    var lashHash;

    function upToDate() {
      return lashHash.indexOf(__webpack_hash__) >= 0;
    }

    function applyResult(updatedModules, renewedModules) {
      var unacceptedModules = updatedModules.filter(function (moduleId) {
        return renewedModules && renewedModules.indexOf(moduleId) < 0;
      });

      if (unacceptedModules.length > 0) {
        warn('The following modules couldn\'t be hot updated (They would need a full reload!):');
        unacceptedModules.forEach(function (id) {
          return warn('- ' + modules[id]);
        });
      }

      if (!renewedModules || renewedModules.length === 0) {
        log('Nothing hot updated.');
      } else {
        log('Updated modules:');
        renewedModules.forEach(function (id) {
          return log('- ' + modules[id]);
        });
      }
    };

    function check() {
      module.hot.check(function (err, updatedModules) {
        if (err) {
          if (module.hot.status() in {
            abort: 1,
            fail: 1
          }) {
            warn('Cannot check for update. Need to do a full reload!');
            warn(err.stack || err.message);
          } else {
            warn('Update check failed: %s', err.stack || err.message);
          }
          return;
        }

        if (!updatedModules) {
          warn('Cannot find update. Need to do a full reload!');
          warn('(Probably because of restarting the webpack-dev-server)');
          return;
        }

        module.hot.apply({
          ignoreUnaccepted: true
        }, function (err, renewedModules) {
          if (err) {
            if (module.hot.status() in {
              abort: 1,
              fail: 1
            }) {
              warn('Cannot apply update. Need to do a full reload!');
              warn(err.stack || err.message);
            } else {
              warn('Update failed: %s', err.stack || err.message);
            }
            return;
          }

          if (!upToDate()) {
            check();
          }

          applyResult(updatedModules, renewedModules);

          if (upToDate()) {
            log('App is up to date.');
          }
        });
      });
    }

    lashHash = hash;
    if (!upToDate() && module.hot.status() === 'idle') {
      log('Checking for updates on the server...');
      check();
    }
  }

  function processMessage(payload) {
    var action = payload.action;

    if (action !== 'built') {
      log('webpack ' + action);
      return;
    }

    var name = payload.name;
    var hash = payload.hash;
    var time = payload.time;

    log('webpack built ' + (name ? name + ':' : '') + hash + ' took ' + time + 'ms');

    if (payload.errors.length) {
      error('webpack build error', payload.errors);
      return;
    }

    if (payload.warnings.length) {
      error('webpack build warning', payload.warnings);
    }

    processUpdate(hash, payload.modules);
  }

  socket.on(namespace, processMessage);
};

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = { namespace: 'HMR' };