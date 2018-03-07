# <%= config.name %>

## Requirements
<%_ if (config.hasComposer) { _%>
- [Composer](https://getcomposer.org/)
<%_ } _%>
<%_ if (config.virtualMachine) { _%>
- [Librarian-puppet](https://github.com/voxpupuli/librarian-puppet)
<%_ } _%>
- [Node.js](https://nodejs.org/en/)
<%_ if (config.virtualMachine) { _%>
- [Puppet](https://puppet.com/)
<%_ } _%>
<%_ if (config.target === 'web') { _%>
- [Sass](http://sass-lang.com/)
<%_ } _%>
<%_ if (config.virtualMachine) { _%>
- [Vagrant](https://www.vagrantup.com/)
- [VirtualBox](https://www.virtualbox.org/)
<%_ } _%>

## Getting Started
```sh
<%_ if (config.hasComposer) { _%>
composer install
<%_ } _%>
npm install
npm run build
<%_ if (config.virtualMachine) { _%>
(cd puppet/ && librarian-puppet install)
vagrant plugin install vagrant-hostsupdater vagrant-puppet-install vagrant-vbguest
vagrant up
<%_ } _%>
```

## Build
- `npm run lint` to lint source files
- `npm test` to run tests
- `npm run build` to build source files
- `npm run watch` to watch source files
