const crypto = require('crypto');
const _ = require('lodash');
const path = require('path');
const request = require('request');
const Generator = require('yeoman-generator');

const repositories = require('./repositories');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.composer = {
      repositories: [
        {
          type: 'composer',
          url: 'https://wpackagist.org'
        }
      ]
    };
    this.composerDependencies = ['johnpbloch/wordpress', 'vlucas/phpdotenv', 'wpackagist-theme/twentyseventeen'];
  }

  configuring() {
    if (this.options.config.wordpressPlugins.includes('ACF')) {
      this.composer.repositories = _.union(this.composer.repositories, repositories.acf);
    }
    if (this.options.config.wordpressPlugins.includes('WPML')) {
      this.composer.repositories = _.union(this.composer.repositories, repositories.wpml);
      if (this.options.config.wordpressPlugins.includes('ACF')) {
        this.composer.repositories = _.union(this.composer.repositories, repositories.wpmlAcf);
      }
    }
    for (var i = 0; i < this.options.config.wordpressPlugins.length; i++) {
      switch (this.options.config.wordpressPlugins[i]) {
        case 'ACF':
          this.composerDependencies.push('advanced-custom-fields/advanced-custom-fields-pro');
          break;
        case 'Adminimize':
          this.composerDependencies.push('wpackagist-plugin/adminimize');
          break;
        case 'Akismet':
          this.composerDependencies.push('wpackagist-plugin/akismet');
          break;
        case 'Jetpack':
          this.composerDependencies.push('wpackagist-plugin/jetpack');
          break;
        case 'Relevanssi':
          this.composerDependencies.push('wpackagist-plugin/relevanssi');
          break;
        case 'W3 Total Cache':
          this.composerDependencies.push('wpackagist-plugin/w3-total-cache');
          break;
        case 'WPML':
          this.composerDependencies.push('wpml/sitepress-multilingual-cms');
          this.composerDependencies.push('wpml/wpml-string-translation');
          this.composerDependencies.push('wpml/wpml-sticky-links');
          this.composerDependencies.push('wpml/wpml-media-translation');
          if (this.options.config.wordpressPlugins.includes('ACF')) {
            this.composerDependencies.push('wpml/acfml');
          }
          if (this.options.config.wordpressPlugins.includes('WooCommerce')) {
            this.composerDependencies.push('wpackagist-plugin/woocommerce-multilingual');
          }
          break;
        case 'Yoast':
          this.composerDependencies.push('wpackagist-plugin/wordpress-seo');
          break;
      }
    }
  }

  _writeTemplates() {
    this.fs.copyTpl(
      this.templatePath('root'),
      this.destinationPath(),
      this.options,
      {},
      {globOptions: {dot:true}}
    );
    this.fs.copyTpl(
      this.templatePath('source'),
      this.destinationPath(this.options.paths.source),
      this.options,
      {},
      {globOptions: {dot:true}}
    );
    this.fs.copyTpl(
      this.templatePath('theme'),
      this.destinationPath(this.options.paths.theme),
      this.options,
      {},
      {globOptions: {dot:true}}
    );
    if (this.options.config.wordpressPlugins.includes('ACF')) {
      this.fs.copyTpl(
        this.templatePath('acf'),
        this.destinationPath(this.options.paths.theme),
        this.options,
        {},
        {globOptions: {dot:true}}
      );
    }
    this.fs.extendJSON(this.destinationPath('composer.json'), this.composer);
  }

  _writeEnvironmentFiles() {
    const salts = {
      AUTH_KEY: crypto.randomBytes(32).toString('hex'),
      SECURE_AUTH_KEY: crypto.randomBytes(32).toString('hex'),
      LOGGED_IN_KEY: crypto.randomBytes(32).toString('hex'),
      NONCE_KEY: crypto.randomBytes(32).toString('hex'),
      AUTH_SALT: crypto.randomBytes(32).toString('hex'),
      SECURE_AUTH_SALT: crypto.randomBytes(32).toString('hex'),
      LOGGED_IN_SALT: crypto.randomBytes(32).toString('hex'),
      NONCE_SALT: crypto.randomBytes(32).toString('hex')
    };
    this.fs.copyTpl(
      this.templatePath('.env'),
      this.destinationPath(path.join(this.options.paths.source, '.env')),
      _.extend(this.options, {salts: salts})
    );
    this.fs.copy(
      this.templatePath('source/wp-config-sample.php'),
      this.destinationPath(path.join(this.options.paths.source, 'wp-config.php'))
    );
  }

  _writeGitIgnore() {
    const gitIgnoreTemplates = ['composer', 'wordpress'];
    const done = this.async();
    request.get(`https://www.gitignore.io/api/${gitIgnoreTemplates.sort().join()}`, (error, response, body) => {
      const gitignorePath = path.join(this.options.paths.source, '.gitignore');
      let gitignore = body.trimLeft();
      gitignore += '\n\n### Project ###\nwp-content/plugins/\nweb/wp-content/themes/twentyseventeen/\nwp/\n';
      this.fs.write(this.destinationPath(gitignorePath), gitignore);
      done(error);
    });
  }

  writing() {
    this._writeTemplates();
    this._writeEnvironmentFiles();
    this._writeGitIgnore();
  }

  install() {
    this.spawnCommand('composer', _.union(['require'], this.composerDependencies));
  }
};
