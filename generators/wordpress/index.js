const _ = require('lodash');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.pluginsPath = this.options.publicPath + 'wp-content/plugins/';
    this.themePath = this.options.publicPath + 'wp-content/themes/' + this.options.answers['theme-name'];
  }

  configuring() {
    this.fs.copy(this.templatePath('editorconfig'), this.destinationPath(this.options.publicPath + '.editorconfig'));
    this.fs.copy(this.templatePath('gitignore'), this.destinationPath(this.options.publicPath + '.gitignore'));
    this.fs.copy(this.templatePath('composer.json'), this.destinationPath('composer.json'));
  }

  writing() {
    this.fs.copyTpl(this.templatePath('wp-config.php'), this.destinationPath(this.options.publicPath + 'wp-config.php'), this.options);
    this.fs.copy(this.templatePath('theme'), this.destinationPath(this.themePath));
  }

  install() {
    let composerDependencies = [
      'interconnectit/search-replace-db',
      'johnpbloch/wordpress-core',
      'wpackagist-theme/twentyseventeen'
    ];
    for (var i = 0; i < this.options.answers['wordpress-plugins'].length; i++) {
      switch (this.options.answers['wordpress-plugins'][i]) {
        case 'ACF':
          this.fs.copy(this.templatePath('plugins/advanced-custom-fields-pro'), this.destinationPath(this.pluginsPath + 'advanced-custom-fields-pro'));
          break;
        case 'Adminimize':
          composerDependencies.push('wpackagist-plugin/adminimize');
          break;
        case 'Akismet':
          composerDependencies.push('wpackagist-plugin/akismet');
          break;
        case 'Jetpack':
          composerDependencies.push('wpackagist-plugin/jetpack');
          break;
        case 'Redirection':
          composerDependencies.push('wpackagist-plugin/redirection');
          break;
        case 'Relevanssi':
          composerDependencies.push('wpackagist-plugin/relevanssi');
          break;
        case 'W3 Total Cache':
          composerDependencies.push('wpackagist-plugin/w3-total-cache');
          break;
        case 'WPML':
          this.fs.copy(this.templatePath('plugins/acfml'), this.destinationPath(this.pluginsPath + 'acfml'));
          this.fs.copy(this.templatePath('plugins/sitepress-multilingual-cms'), this.destinationPath(this.pluginsPath + 'sitepress-multilingual-cms'));
          this.fs.copy(this.templatePath('plugins/wpml-media-translation'), this.destinationPath(this.pluginsPath + 'wpml-media-translation'));
          this.fs.copy(this.templatePath('plugins/wpml-sticky-links'), this.destinationPath(this.pluginsPath + 'wpml-sticky-links'));
          break;
        case 'Yoast':
          composerDependencies.push('wpackagist-plugin/wordpress-seo');
          break;
      }
    }
    this.spawnCommand('composer', _.union(['require'], composerDependencies));
  }
};
