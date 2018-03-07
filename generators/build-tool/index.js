const _ = require('lodash');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.package = {
      scripts: {}
    };
    this.npmDependencies = [];
    this.npmDevDependencies = [];
  }

  _configureLinters() {
    const npmLintScripts = {};
    switch (this.options.config.target) {
      case 'node':
        npmLintScripts.lint = `eslint ${this.options.paths.source}`;
        break;
      case 'web':
      default:
        npmLintScripts.lint = 'npm run lint:scripts && npm run lint:styles';
        npmLintScripts['lint:scripts'] = `eslint ${this.options.paths.assets.scripts.lint}`;
        npmLintScripts['lint:styles'] = `stylelint ${this.options.paths.assets.styles.lint}`;
        break;
    }
    this.package.scripts = _.assign(this.package.scripts, npmLintScripts);
  }

  _configureScripts() {
    this._configureLinters();
    this.package.scripts.test = 'mocha --require babel-register';
    this.package.scripts.prebuild = this.options.paths.source === this.options.paths.destination
      ? 'rimraf tmp/'
      : `rimraf tmp/ ${this.options.paths.destination}`;
    switch (this.options.config.buildTool) {
      case 'Gulp':
        this.package.scripts = _.assign(this.package.scripts, {
          'build': 'gulp && webpack',
          'watch': 'gulp watch & webpack --watch'
        });
        this.npmDevDependencies = _.union(this.npmDevDependencies, [
          'gulp',
          'gulp-autoprefixer',
          'gulp-clean-css',
          'gulp-imagemin',
          'gulp-sass',
          'gulp-sourcemaps',
          'gulp-watch',
          'require-dir'
        ]);
        break;
      case 'npm scripts':
        switch (this.options.config.target) {
          case 'node':
            this.package.scripts = _.assign(this.package.scripts, {
              'build': 'webpack',
              'watch': 'webpack --watch',
            });
            break;
          case 'web':
            this.package.scripts = _.assign(this.package.scripts, {
              'build': 'npm run build:scripts && npm run build:styles && npm run build:images',
              'build:images': `imagemin ${this.options.paths.assets.images.source} --out-dir=${this.options.paths.assets.images.destination}`,
              'build:scripts': 'webpack',
              'build:styles': `node-sass --include-path=node_modules/ ${this.options.paths.assets.styles.source} tmp/main.css`,
              'postbuild:styles': `postcss tmp/main.css --use autoprefixer cssnano -o ${this.options.paths.assets.styles.destination} --no-map`,
              'watch': 'npm run watch:scripts & npm run watch:styles',
              'watch:scripts': 'webpack --watch',
              'watch:styles': `node-sass --include-path=node_modules/ --watch ${this.options.paths.assets.styles.source} tmp/main.css & postcss tmp/main.css --use autoprefixer cssnano -o ${this.options.paths.assets.styles.destination} --no-map --watch`
            });
            this.npmDevDependencies = _.union(this.npmDevDependencies, [
              'autoprefixer',
              'cssnano',
              'imagemin-cli',
              'node-sass',
              'postcss-cli'
            ]);
            break;
        }
        break;
    }
  }

  _configureDependencies() {
    this.npmDependencies = _.union(this.npmDependencies, this.options.config.libraries);
    this.npmDevDependencies = _.union(this.npmDevDependencies, ['babel-core', 'babel-loader', 'babel-preset-env', 'eslint', 'mocha', 'rimraf', 'webpack']);
    if (this.options.config.target === 'web') {
      this.npmDevDependencies = _.union(this.npmDevDependencies, ['stylelint', 'stylelint-config-standard']);
    }
    switch (this.options.config.framework) {
      case 'Web Application (React)':
        this.npmDependencies = _.union(this.npmDependencies, ['classnames', 'prop-types', 'react', 'react-dom', 'react-router', 'react-router-dom', 'redux', 'react-redux']);
        this.npmDevDependencies = _.union(this.npmDevDependencies, ['babel-preset-es2015', 'babel-preset-react', 'eslint-plugin-react', 'react-test-renderer']);
        break;
    }
  }

  configuring() {
    if (this.options.config.target === 'node') {
      this.package.version = '0.1.0';
    }
    this._configureScripts();
    this._configureDependencies();
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('root'),
      this.destinationPath(),
      this.options,
      {},
      {globOptions: {dot:true}}
    );
    if (this.options.config.buildTool === 'Gulp') {
      this.fs.copyTpl(
        this.templatePath('gulp'),
        this.destinationPath(),
        this.options,
        {},
        {globOptions: {dot:true}}
      );
    }
    this.fs.extendJSON(this.destinationPath('package.json'), this.package);
  }

  install() {
    this.npmInstall(this.npmDependencies, {'save': true});
    this.npmInstall(this.npmDevDependencies, {'save-dev': true});
  }
};
