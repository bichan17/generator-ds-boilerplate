Exec {
  path => ['/usr/sbin', '/usr/bin', '/sbin', '/bin']
}

class { 'selinux':
  mode => 'disabled'
}
<%_ if (config.virtualMachine.includes('PHP')) { _%>

class { '::php':
  composer => true,
<%_ if (config.virtualMachine.includes('MySQL')) { _%>
  extensions => {
    mysql => {}
  }
<%_ } _%>
}
<%_ } _%>
<%_ if (config.virtualMachine.includes('Node.js')) { _%>

class { 'nodejs': }
<%_ } _%>
<%_ if (config.virtualMachine.includes('Apache')) { _%>

class { 'apache':
  user => "vagrant",
  group => "vagrant",
}
apache::vhost { '<%= config.hostname %>':
  port => '80',
  docroot => '/var/www/html',
  directories => [
    {
      path => '/var/www/html',
      options => ['Indexes', 'FollowSymLinks'],
      allow_override => ['All']
    }
  ]
}
<%_ if (config.virtualMachine.includes('PHP')) { _%>
include apache::mod::php
<%_ } _%>
<%_ } _%>
<%_ if (config.virtualMachine.includes('Nginx')) { _%>

class { 'nginx':
  sendfile => 'off',
}
nginx::resource::server { '<%= config.hostname %>':
  www_root => '/var/www/html'
}
<%_ } _%>
<%_ if (config.virtualMachine.includes('MySQL')) { _%>

include ::mysql::server
<%_ if (config.framework !== 'WordPress') { _%>
mysql::db { '<%= config.databaseName %>':
  user => 'vagrant',
  password => 'vagrant',
  host => 'localhost',
  grant => ['ALL']
}
<%_ } _%>
<%_ } _%>
<%_ if (config.virtualMachine.includes('MongoDB')) { _%>

include mongodb::server
mongodb::db { '<%= config.databaseName %>':
  user => 'vagrant',
  password => 'vagrant',
}
<%_ } _%>
<%_ if (config.framework === 'WordPress') { _%>

<%_ if (config.virtualMachine.includes('MySQL')) { _%>
mysql::db { '<%= config.databaseName %>':
  user => 'wordpress',
  password => 'vagrant',
  host => 'localhost',
  grant => ['ALL']
}
<%_ } _%>
<%_ if (config.virtualMachine.includes('Apache')) { _%>
file { '/var/www/html/wp-content/uploads':
  ensure => directory,
  owner => 'apache',
  group => 'apache',
  mode => '775',
  recurse => true
}
<%_ } _%>
<%_ } _%>
