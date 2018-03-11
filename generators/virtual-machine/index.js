const _ = require('lodash');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  configuring() {
    this.options.config.privateIp = `192.168.${_.random(255)}.${_.random(255)}`;
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(),
      this.options,
      {},
      {globOptions: {dot:true}}
    );
  }
};
