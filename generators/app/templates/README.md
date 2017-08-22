# <%= answers.name %>

## Requirements
- [Librarian-puppet](https://github.com/voxpupuli/librarian-puppet)
- [Node.js](https://nodejs.org/en/)
- [Puppet](https://puppet.com/)
- [Sass](http://sass-lang.com/)
- [Vagrant](https://www.vagrantup.com/)
- [VirtualBox](https://www.virtualbox.org/)

## Getting Started
```sh
npm install
NODE_ENV='production' npm run build
cd puppet/ && librarian-puppet install
vagrant plugin install vagrant-hostsupdater vagrant-librarian-puppet vagrant-puppet-install vagrant-vbguest
vagrant up
```

## Build
```sh
npm run build
npm run watch
npm run lint
```

## Browser Support
- Chrome XX+
- Firefox XX+
- IE XX+
- Safari XX+
- Chrome XX+ for Android XX+
- Safari for iOS XX+
