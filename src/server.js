import debug from 'debug';

const defaultOptions = { namespace: 'HMR' };

export default function (compiler, io, options = {}) {
  options = Object.assign({}, defaultOptions, options);
  const namespace = options.namespace;

  const log = debug(`${namespace}`);
  log.log = console.log.bind(console);

  function emit(payload) {
    io.emit(namespace, payload);
  }

  compiler.plugin('compile', () => {
    log('webpack building...');
    emit({ action: 'building' });
  });

  compiler.plugin('done', (stats) => {
    stats = stats.toJson();
    stats = stats.children && stats.children.length ? stats.children : [stats];
    
    stats.forEach(item => {
      const name = item.name;
      const hash = item.hash;
      const time = item.time;
      const modules = item.modules.reduce((modules, module) => {
        modules[module.id] = module.name;
        return modules;
      }, {});
      
      log(`webpack built ${name? name + ':' : ''}${hash} took ${time}ms`);
      
      emit({
        action: 'built',
        name,
        hash,
        time,
        warnings: item.warnings,
        errors: item.errors,
        modules,
      });
    });
  });
}