const _ = require('lodash');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.npmScripts = {
      'prebuild': 'rimraf tmp/',
      'lint': 'npm run lint:scripts && npm run lint:styles',
      'lint:scripts': 'eslint source/assets/scripts/',
      'lint:styles': 'stylelint source/assets/styles/**/*.scss'
    };
    this.npmDevDependencies = [];
  }

  configuring() {
    switch (this.options.answers['task-runner']) {
      case 'Gulp':
        switch (this.options.answers['module-loader']) {
          case 'Browserify':
            this.npmScripts = _.assign(this.npmScripts, {
              'build': 'gulp',
              'watch': 'gulp watch'
            });
            this.npmDevDependencies = _.union(this.npmDevDependencies, [
              'vinyl-buffer',
              'vinyl-source-stream'
            ]);
            break;
          case 'Webpack':
            this.npmScripts = _.assign(this.npmScripts, {
              'build': 'gulp && webpack',
              'watch': 'gulp watch & webpack --watch'
            });
            break;
        }
        this.npmDevDependencies = _.union(this.npmDevDependencies, [
          'gulp',
          'gulp-autoprefixer',
          'gulp-clean-css',
          'gulp-imagemin',
          'gulp-sass',
          'gulp-sourcemaps',
          'gulp-uglify',
          'gulp-watch',
          'require-dir'
        ]);
        break;
      case 'npm scripts':
        this.npmScripts = _.assign(this.npmScripts, {
          'build': 'npm run build:scripts && npm run build:styles && npm run build:images',
          'build:images': 'imagemin source/assets/images/**/* --out-dir=public/assets/images/',
          'build:styles': 'node-sass source/assets/styles/main.scss tmp/main.css',
          'postbuild:styles': 'postcss tmp/main.css --use autoprefixer -o public/assets/styles/main.css --no-map',
          'watch': 'npm run watch:scripts & npm run watch:styles',
          'watch:styles': 'node-sass --watch source/assets/styles/main.scss public/assets/styles/main.css & postcss tmp/main.css --use autoprefixer -o public/assets/styles/main.css --no-map --watch'
        });
        switch (this.options.answers['module-loader']) {
          case 'Browserify':
            this.npmScripts = _.assign(this.npmScripts, {
              'build:scripts': 'mkdir -p public/assets/scripts && browserify source/assets/scripts/main.js -o public/assets/scripts/main.js',
              'watch:scripts': 'mkdir -p public/assets/scripts && watchify source/assets/scripts/main.js -o public/assets/scripts/main.js'
            });
            break;
          case 'Webpack':
            this.npmScripts = _.assign(this.npmScripts, {
              'build:scripts': 'webpack',
              'watch:scripts': 'webpack --watch'
            });
            break;
        }
        this.npmDevDependencies = _.union(this.npmDevDependencies, [
          'node-sass',
          'postcss-cli'
        ]);
        break;
    }

    switch (this.options.answers['module-loader']) {
      case 'Browserify':
        this.npmDevDependencies = _.union(this.npmDevDependencies, [
          'browserify',
          'watchify'
        ]);
      case 'Webpack':
        this.npmDevDependencies = _.union(this.npmDevDependencies, [
          'babel-loader',
          'webpack'
        ]);
        break;
    }
  }

  writing() {
    switch (this.options.answers['task-runner']) {
      case 'Gulp':
        this.fs.copyTpl(this.templatePath('gulpfile.js'), this.destinationPath('gulpfile.js'), this.options);
        this.fs.copy(this.templatePath('gulp/images.js'), this.destinationPath('gulp/images.js'));
        this.fs.copy(this.templatePath('gulp/styles.js'), this.destinationPath('gulp/styles.js'));
        if (this.options.answers['module-loader'] === 'Browserify') {
          this.fs.copy(this.templatePath('gulp/scripts.js'), this.destinationPath('gulp/scripts.js'));
        }
        break;
    }

    switch (this.options.answers['module-loader']) {
      case 'Webpack':
        this.fs.copy(this.templatePath('webpack.config.js'), this.destinationPath('webpack.config.js'));
        break;
    }

    this.fs.extendJSON(this.destinationPath('package.json'), {scripts: this.npmScripts});
  }

  install() {
    this.npmInstall(this.npmDevDependencies, {'save-dev': true});
  }
};
