Exec {
  path => ['/usr/sbin', '/usr/bin', '/sbin', '/bin'],
}
<%_ if (config.operatingSystemDistribution === 'centos/7') { _%>

class { 'selinux':
  mode => 'disabled',
}
<%_ } _%>
<%_ if (config.virtualMachine.includes('PHP')) { _%>

<%_ if (config.operatingSystemDistribution === 'ubuntu/trusty64') { _%>
class { '::php::globals':
  php_version => '5.6',
  config_root => '/etc/php/5.6',
}->
<%_ } _%>
class { '::php':
  <%_ if (config.operatingSystemDistribution === 'ubuntu/trusty64') { _%>
  manage_repos => true,
  <%_ } _%>
  <%_ if (config.virtualMachine.includes('MySQL')) { _%>
  extensions => {
    mysql => {},
  },
  <%_ } _%>
}
<%_ } _%>
<%_ if (config.virtualMachine.includes('Node.js')) { _%>

class { 'nodejs':
  version => 'lts',
}
<%_ } _%>
<%_ if (config.virtualMachine.includes('Apache')) { _%>

class { 'apache':
  user => 'vagrant',
  group => 'vagrant',
  <%_ if (config.operatingSystemDistribution === 'ubuntu/xenial64' || config.operatingSystemDistribution === 'ubuntu/trusty64') { _%>
  mpm_module => 'prefork',
  <%_ } _%>
}
apache::vhost { '<%= config.hostname %>':
  port => '80',
  docroot => '/vagrant/<%= paths.destination %>',
  directories => [
    {
      path => '/vagrant/<%= paths.destination %>',
      options => ['Indexes', 'FollowSymLinks'],
      allow_override => ['All'],
    },
  ],
}
<%_ if (config.virtualMachine.includes('PHP')) { _%>
include apache::mod::php
include apache::mod::rewrite
<%_ } _%>
<%_ } _%>
<%_ if (config.virtualMachine.includes('Nginx')) { _%>

class { 'nginx':
  sendfile => 'off',
}
nginx::resource::server { '<%= config.hostname %>':
  www_root => '/vagrant/<%= paths.destination %>',
}
<%_ } _%>
<%_ if (config.virtualMachine.includes('MySQL')) { _%>

<%_ if (config.operatingSystemDistribution === 'ubuntu/trusty64') { _%>
class { '::mysql::client':
  package_name => 'mysql-client-5.6',
}
class { '::mysql::server':
  package_name => 'mysql-server-5.6',
}
<%_ } else { _%>
include ::mysql::server
<%_ } _%>
mysql::db { '<%= config.databaseName %>':
  user => 'vagrant',
  password => 'vagrant',
  host => 'localhost',
  grant => ['ALL'],
}
<%_ } _%>
<%_ if (config.virtualMachine.includes('MongoDB')) { _%>

include mongodb::server
mongodb::db { '<%= config.databaseName %>':
  user => 'vagrant',
  password => 'vagrant',
}
<%_ } _%>
<%_ if (config.framework === 'WordPress') { _%>

<%_ if (config.virtualMachine.includes('Apache') && config.operatingSystemDistribution === 'centos/7') { _%>
file { '/vagrant/<%= paths.destination %>/wp-content/uploads':
  ensure => directory,
  owner => 'apache',
  group => 'apache',
  mode => '775',
  recurse => true,
}
<%_ } _%>
<%_ } _%>
