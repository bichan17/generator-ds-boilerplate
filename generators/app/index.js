const _ = require('lodash');
const Generator = require('yeoman-generator');
const path = require('path');

module.exports = class extends Generator {
  initializing() {
    this.answers = undefined;
    this.projectConfig = {
      hostname: undefined,
      aliases: [],
      paths: {},
      vagrant: {
        settings: {
          memory: 1024,
          // cpus: 2
        },
        network: {
          privateIp: '192.168.50.' + _.random(255)
        },
        vhosts: [],
        packages: [
          {
            name: 'apache',
            version: 2.4
          },
          {
            name: 'mysql',
            version: 5.7,
            // databases: [
            //   "VAGRANTDB1",
            //   "VAGRANTDB2"
            // ],
            // rootPassword: "customVagrantPassword"
          },
          {
            name: 'nginx',
            version: 1.10
          },
          {
            name: 'php',
            version: 7.1,
            // extensions: [
            //   "php-common",
            //   "php-mysqlnd",
            //   "php-mcrypt",
            //   "php-gd"
            // ]
          },
          {
            name: 'node',
            version: 6,
            globalPackages: [
              "bower",
              "gulp"
            ]
          }
        ],
        // systemctl: {
        //   start: [
        //     "redis"
        //   ],
        //   enable: [
        //     "redis.service"
        //   ]
        // }
      }
    };
    this.npmDependencies = [];
    this.npmDevDependencies = [
      'babel-core',
      'babel-preset-env',
      'eslint',
      'stylelint',
      'stylelint-config-standard'
    ];
    this.sourcePath = 'source/';
    this.publicPath = 'public/';
    this.assetsPath = undefined;
  }

  prompting() {
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Project name',
        default: _.kebabCase(this.appname)
      },
      {
        type: 'input',
        name: 'hostname',
        message: 'Hostname',
        default: answers => _.kebabCase(answers.name) + '.localhost'
      },
      {
        type: 'list',
        name: 'backend',
        message: 'Backend',
        choices: [
          // 'Drupal',
          // 'Laravel',
          // 'Magento',
          'WordPress',
          'none'
        ],
        default: 'none'
      },
      {
        when: answers => answers.backend === 'WordPress',
        type: 'input',
        name: 'theme-name',
        message: 'Theme Name',
        default: answers => _.kebabCase(answers.name)
      },
      {
        when: answers => answers.backend === 'WordPress',
        type: 'checkbox',
        name: 'wordpress-plugins',
        message: 'WordPress Plugins',
        choices: [
          'ACF',
          'Adminimize',
          'Akismet',
          'Jetpack',
          'Redirection',
          'Relevanssi',
          'W3 Total Cache',
          'WPML',
          'Yoast'
        ],
        default: [
          'ACF',
          'Adminimize',
          'Akismet',
          'Jetpack',
          'Redirection',
          'W3 Total Cache',
          'Yoast'
        ]
      },
      {
        type: 'list',
        name: 'task-runner',
        message: 'Task Runner',
        choices: [
          'Gulp',
          'npm scripts'
        ],
        default: 'Gulp'
      },
      {
        type: 'list',
        name: 'module-loader',
        message: 'Module Loader',
        choices: [
          'Browserify',
          'Webpack'
        ],
        default: 'Webpack'
      },
      // {
      //   type: 'list',
      //   name: 'frontend',
      //   message: 'Frontend',
      //   choices: [
      //     'Angular',
      //     'React',
      //     'none'
      //   ],
      //   default: 'none'
      // },
      {
        type: 'checkbox',
        name: 'libraries',
        message: 'libraries',
        choices: [
          'autotrack',
          'font-awesome',
          'jquery',
          'js-cookie',
          'lodash',
          'modernizr',
          'normalize.css',
          'picturefill',
          'query-string',
          'url',
          'webfontloader'
        ],
        default: [
          'autotrack',
          'normalize.css',
          'picturefill'
        ]
      }
    ];

    return this.prompt(questions).then((answers) => {
      this.answers = answers;
    });
  }

  configuring() {
    if (this.answers.backend === 'WordPress') {
      this.projectConfig.paths.pluginsPath = path.join(this.publicPath, 'wp-content/plugins/');
      this.projectConfig.paths.themePath = path.join(this.publicPath, 'wp-content/themes', this.answers['theme-name']);
      this.assetsPath = path.join(this.projectConfig.paths.themePath, 'assets/');
      this.projectConfig.paths.assetsPath = this.assetsPath;
    } else {
      this.assetsPath = this.publicPath;
      this.projectConfig.paths.assetsPath = this.assetsPath;
    }

    this.projectConfig.paths = {
      source: this.sourcePath,
      public: this.publicPath,
      images: {
        src: path.join(this.sourcePath, 'assets/images/**/*'),
        dest: path.join(this.assetsPath, 'images/'),
        watch: path.join(this.sourcePath, 'assets/images/**/*')
      },
      scripts: {
        filename: 'main.js',
        src: path.join(this.sourcePath, 'assets/scripts/main.js'),
        dest: path.join(this.assetsPath, 'scripts/'),
        watch: path.join(this.sourcePath, 'assets/scripts/**/*.js')
      },
      styles: {
        src: path.join(this.sourcePath, 'assets/styles/main.scss'),
        dest: path.join(this.assetsPath, 'styles/'),
        watch: path.join(this.sourcePath, 'assets/styles/**/*.scss')
      }
    };

    this.projectConfig.hostname = this.answers.hostname;
    if (this.projectConfig.hostname.startsWith('www.')) {
      this.projectConfig.aliases.push(this.projectConfig.hostname.slice(4));
    } else {
      this.projectConfig.aliases.push('www.' + this.answers.hostname);
    }
    this.projectConfig.vagrant.vhosts.push({
      hostname: this.projectConfig.hostname,
      aliases: this.projectConfig.aliases,
      path: this.publicPath
    });
    this.npmDependencies = _.union(this.npmDependencies, this.answers.libraries);
  }

  writing() {
    const tplData = {
      answers: this.answers,
      projectConfig: this.projectConfig,
      publicPath: this.publicPath,
      sourcePath: this.sourcePath
    };

    this.fs.copy(this.templatePath('public/.htaccess'), this.destinationPath(this.publicPath + '.htaccess'));
    this.fs.copy(this.templatePath('public/favicon.ico'), this.destinationPath(this.publicPath + 'favicon.ico'));
    this.fs.copy(this.templatePath('public/robots.txt'), this.destinationPath(this.publicPath + 'robots.txt'));
    if (this.answers['backend'] === 'none') {
      this.fs.copy(this.templatePath('public/404.html'), this.destinationPath(this.publicPath + '404.html'));
      this.fs.copy(this.templatePath('public/index.html'), this.destinationPath(this.publicPath + 'index.html'));
      this.fs.copy(this.templatePath('public/sitemap.xml'), this.destinationPath(this.publicPath + 'sitemap.xml'));
    }
    this.fs.copy(this.templatePath('puppet/'), this.destinationPath('puppet/'), {globOptions: {dot: true}});
    // this.fs.copy(this.templatePath('puppet/modules/.keep'), this.destinationPath('puppet/modules/.keep'));
    this.fs.copyTpl(this.templatePath('puppet/environments/local/manifests/default.pp'), this.destinationPath('puppet/environments/local/manifests/default.pp'), tplData);
    this.fs.copy(this.templatePath('source/'), this.destinationPath(this.sourcePath));
    this.fs.copyTpl(this.templatePath('source/assets/styles/main.scss'), this.destinationPath('source/assets/styles/main.scss'), tplData);
    this.fs.copy(this.templatePath('.babelrc'), this.destinationPath('.babelrc'));
    this.fs.copy(this.templatePath('.editorconfig'), this.destinationPath('.editorconfig'));
    this.fs.copy(this.templatePath('.eslintrc.json'), this.destinationPath('.eslintrc.json'));
    this.fs.copy(this.templatePath('.gitignore'), this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('.stylelintrc.json'), this.destinationPath('.stylelintrc.json'));
    this.fs.copy(this.templatePath('browserslist'), this.destinationPath('browserslist'));
    this.fs.writeJSON(this.destinationPath('config.json'), tplData.projectConfig);
    this.fs.copy(this.templatePath('package.json'), this.destinationPath('package.json'));
    this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('README.md'), tplData);
    this.fs.copy(this.templatePath('Vagrantfile'), this.destinationPath('Vagrantfile'));

    if (this.answers.backend === 'WordPress') {
      this.composeWith(require.resolve('../wordpress'), tplData);
    }

    this.composeWith(require.resolve('../task-runner'), tplData);
  }

  install() {
    this.npmInstall(this.npmDependencies, {'save': true});
    this.npmInstall(this.npmDevDependencies, {'save-dev': true});
  }
};
