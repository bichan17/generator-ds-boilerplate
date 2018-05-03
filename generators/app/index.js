const _ = require('lodash');
const path = require('path');
const request = require('request');
const Generator = require('yeoman-generator');

const generateQuestions = require('./generateQuestions');

module.exports = class extends Generator {
  initializing() {
    this.props = {
      name: _.kebabCase(this.appname),
      framework: 'none',
      hostname: null,
      themeName: null,
      wordpressThemePrefix: null,
      wordpressPlugins: null,
      virtualMachine: null,
      operatingSystemDistribution: null,
      databaseName: null,
      buildTool: 'npm scripts',
      libraries: null,
      target: 'web',
      hasComposer: false
    };
    this.answers = null;
    this.paths = {};
    this.templateData = {};
  }

  prompting() {
    const questions = generateQuestions(this.appname);
    return this.prompt(questions).then(answers => {
      this.answers = answers;
    });
  }

  _configureProps() {
    this.props = _.extend(this.props, this.answers);

    // configure target prop
    switch (this.props.framework) {
      case 'Node Module':
        this.props.target = 'node';
        break;
      case 'none':
      default:
        this.props.target = 'web';
        break;
    }

    // configure framework props
    switch (this.props.framework) {
      case 'WordPress':
        this.props.wordpressThemePrefix = _.snakeCase(this.props.themeName);
        this.props.hasComposer = true;
        break;
    }
  }

  _configurePaths() {
    // configure source/destination paths
    switch (this.props.framework) {
      case 'Node Module':
        this.paths.source = 'source/';
        this.paths.destination = 'module/';
        break;
      case 'WordPress':
      case 'none':
        this.paths.source = 'html/';
        this.paths.destination = this.paths.source;
        break;
      default:
        this.paths.source = 'source/';
        this.paths.destination = 'build/';
        break;
    }

    // configure framework paths
    switch (this.props.framework) {
      case 'WordPress':
        this.paths.plugins = path.join(this.paths.destination, 'wp-content/plugins/');
        this.paths.theme = path.join(this.paths.destination, 'wp-content/themes/', this.props.themeName);
        break;
    }

    // configure target paths
    switch (this.props.target) {
      case 'node':
        this.paths.app = {
          filename: 'index.js',
          source: path.join(this.paths.source, 'index.js'),
          destination: path.join(this.paths.destination),
          watch: path.join(this.paths.source, 'index.js'),
          lint: path.join(this.paths.source, 'index.js')
        };
        this.paths.assets = {
          scripts: this.paths.app
        };
        break;
      case 'web':
      default:
        switch (this.props.framework) {
          case 'WordPress':
            this.paths.assets = {
              source: path.join(this.paths.theme, 'assets/'),
              destination: path.join(this.paths.theme, 'assets/')
            };
            break;
          default:
            this.paths.assets = {
              source: path.join(this.paths.source, 'assets/'),
              destination: path.join(this.paths.destination, 'assets/')
            };
            break;
        }
        this.paths.assets.images = {
          source: path.join(this.paths.assets.source, 'images/**/*'),
          destination: path.join(this.paths.assets.destination, 'images/')
        };
        this.paths.assets.scripts = {
          filename: 'main.bundle.js',
          source: path.join(this.paths.assets.source, 'scripts/main.js'),
          destination: path.join(this.paths.assets.destination, 'scripts/'),
          watch: path.join(this.paths.assets.source, 'scripts/**/*.js'),
          lint: path.join(this.paths.source, 'index.js')
        };
        this.paths.assets.styles = {
          source: path.join(this.paths.assets.source, 'styles/main.scss'),
          destination: path.join(this.paths.assets.destination, this.props.buildTool === 'npm scripts' ? 'styles/main.css' : 'styles/'),
          watch: path.join(this.paths.assets.source, 'styles/**/*.scss'),
          lint: path.join(this.paths.assets.source, 'styles/**/*.scss')
        };
        break;
    }
  }

  _configureTemplateData() {
    this.templateData.config = this.props;
    this.templateData.paths = this.paths;
  }

  configuring() {
    this._configureProps();
    this._configurePaths();
    this._configureTemplateData();
  }

  _writeTemplates() {
    // write root templates
    this.fs.copyTpl(
      this.templatePath('root'),
      this.destinationPath(),
      this.templateData,
      {},
      {globOptions: {dot:true}}
    );

    // write target templates
    switch (this.props.target) {
      case 'web':
        this.fs.copy(this.templatePath('.browserslistrc'), this.destinationPath('.browserslistrc'));
        this.fs.copy(this.templatePath('.stylelintrc.json'), this.destinationPath('.stylelintrc.json'));
        this.fs.copyTpl(
          this.templatePath('assets'),
          this.destinationPath(this.paths.assets.source),
          this.templateData,
          {},
          {globOptions: {dot:true}}
        );
        break;
    }

    // write 'none' framework templates
    switch (this.props.framework) {
      case 'none':
        this.fs.copyTpl(
          this.templatePath('source'),
          this.destinationPath(this.paths.source),
          this.templateData,
          {},
          {globOptions: {dot:true}}
        );
        break;
    }
  }

  _writeRcFiles() {
    const babelrc = {
      presets: ['env']
    };
    const eslintrc = {};
    switch (this.props.target) {
      case 'node':
        eslintrc.env = {node: true};
        break;
      case 'web':
      default:
        eslintrc.env = {browser: true};
        break;
    }
    switch (this.props.framework) {
      case 'Web Application (React)':
        babelrc.presets.push('es2015');
        babelrc.presets.push('react');
        eslintrc.env.node = true;
        eslintrc.extends = [
          'eslint:recommended',
          'plugin:react/recommended'
        ];
        eslintrc.parserOptions = {
          ecmaFeatures: {jsx: true}
        };
        eslintrc.plugins = ['react'];
        break;
    }
    this.fs.extendJSON(this.destinationPath('.babelrc'), babelrc);
    this.fs.extendJSON(this.destinationPath('.eslintrc.json'), eslintrc);
  }

  _writeGitIgnore() {
    const gitIgnoreTemplates = ['macos', 'node', 'sublimetext'];
    if (this.props.hasComposer) gitIgnoreTemplates.push('composer');
    if (this.props.target === 'web') gitIgnoreTemplates.push('sass');
    if (this.props.virtualMachine) gitIgnoreTemplates.push('vagrant');
    const done = this.async();
    request.get(`https://www.gitignore.io/api/${gitIgnoreTemplates.sort().join()}`, (error, response, body) => {
      let gitignore = body.trimLeft();
      gitignore += '\n\n### Domani ###\n*.sql\n.pyc';
      gitignore += '\n\n### Project ###\ntmp/\n';
      if (this.paths.source !== this.paths.destination) {
        gitignore += `${this.paths.destination}\n`;
      } else if (this.props.target === 'web') {
        const scriptBuildPath = path.join(this.paths.assets.scripts.destination, this.paths.assets.scripts.filename);
        const styleBuildPath = this.props.buildTool === 'npm scripts'
          ? this.paths.assets.styles.destination
          : path.join(this.paths.assets.styles.destination, 'main.css');
        gitignore += `${scriptBuildPath}\n`;
        gitignore += `${styleBuildPath}\n`;
      }
      this.fs.write(this.destinationPath('.gitignore'), gitignore);
      done(error);
    });
  }

  writing() {
    this._writeTemplates();
    this._writeRcFiles();
    this._writeGitIgnore();
  }

  end() {
    this.composeWith(require.resolve('../build-tool'), this.templateData);
    if (this.props.virtualMachine) {
      this.composeWith(require.resolve('../virtual-machine'), this.templateData);
    }
    switch (this.props.framework) {
      case 'Node Module':
        this.composeWith(require.resolve('../node-module'), this.templateData);
        break;
      case 'WordPress':
        this.composeWith(require.resolve('../wordpress'), this.templateData);
        break;
    }
  }
};
