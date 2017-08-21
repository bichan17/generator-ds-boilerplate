Exec {
  path => ['/usr/sbin', '/usr/bin', '/sbin', '/bin']
}

class { 'selinux':
  mode => 'disabled'
}

class { '::php':
  extensions => {
    gd => {},
    mysql => {}
  }
}

class { 'apache':
  user => "vagrant",
  group => "vagrant",
}
include apache::mod::php
apache::vhost { '<%= projectConfig.hostname %>':
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

<% if (answers.backend === 'WordPress') { %>include '::mysql::server'
mysql::db { 'wordpress':
  user => 'wordpress',
  password => 'vagrant',
  host => 'localhost',
  grant => ['ALL']
}

file { '/var/www/html/wp-content/uploads':
  ensure => directory,
  owner => 'apache',
  group => 'apache',
  mode => '775',
  recurse => true
}<% } %>
