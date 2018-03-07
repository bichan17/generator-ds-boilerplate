const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('source'),
      this.destinationPath(this.options.paths.source),
      this.options,
      {},
      {globOptions: {dot:true}}
    );
  }
};
