const _ = require('lodash');

function generateQuestions(appname) {
  return [
    {
      type: 'input',
      name: 'name',
      message: 'Project Name',
      default: () => _.kebabCase(appname),
      validate: input => input === _.kebabCase(input)
        ? true
        : 'Project Name must be kebab case (foo-bar)'
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Framework',
      choices: [
        // 'Django',
        // 'Drupal',
        // 'Isomorphic JavaScript (React)',
        // 'Jekyll',
        // 'KeystoneJS',
        // 'Laravel',
        // 'Magento',
        'Node Module',
        // 'Shopify',
        // 'Symfony',
        // 'Web Application (React)',
        'WordPress',
        'none',
        {type: 'separator'}
      ],
      default: 'none'
    },
    {
      when: answers => !['Shopify', 'Node Module'].includes(answers.framework),
      type: 'input',
      name: 'hostname',
      message: 'Hostname',
      default: answers => `${answers.name}.test`
    },
    {
      when: answers => answers.framework === 'WordPress',
      type: 'input',
      name: 'themeName',
      message: 'Theme Name',
      default: answers => _.kebabCase(answers.name),
      validate: input => input === _.kebabCase(input)
        ? true
        : 'Theme Name must be kebab case (foo-bar)'
    },
    {
      when: answers => answers.framework === 'WordPress',
      type: 'checkbox',
      name: 'wordpressPlugins',
      message: 'WordPress Plugins',
      choices: [
        'ACF',
        'Adminimize',
        'Akismet',
        'Jetpack',
        'Relevanssi',
        'W3 Total Cache',
        'WooCommerce',
        'WPML',
        'Yoast',
        {type: 'separator'}
      ],
      default: [
        'ACF',
        'Akismet',
        'Jetpack',
        'Yoast'
      ]
    },
    {
      when: answers => !['Shopify', 'Node Module'].includes(answers.framework),
      type: 'checkbox',
      name: 'virtualMachine',
      message: 'Virtual Machine',
      choices: [
        'Apache',
        'MongoDB',
        'MySQL',
        'Nginx',
        'Node.js',
        'PHP',
        // 'PostgreSQL',
        // 'Python',
        // 'Ruby',
        {type: 'separator'}
      ],
      default: answers => {
        switch (answers.framework) {
          case 'Isomorphic JavaScript (React)':
          case 'KeystoneJS':
          case 'Web Application (React)':
            return ['MongoDB', 'Node.js', 'Nginx'];
          default:
            return ['Apache', 'MySQL', 'PHP'];
        }
      }
    },
    {
      when: answers => answers.virtualMachine && (answers.virtualMachine.includes('MongoDB') || answers.virtualMachine.includes('MySQL')),
      type: 'input',
      name: 'databaseName',
      message: 'Database Name',
      default: answers => _.snakeCase(answers.name),
      validate: input => input === _.snakeCase(input)
        ? true
        : 'Database Name must be snake case (foo_bar)'
    },
    {
      when: answers => answers.framework !== 'Node Module',
      type: 'list',
      name: 'buildTool',
      message: 'Build Tool',
      choices: [
        'Gulp',
        'npm scripts',
      ],
      default: 'npm scripts'
    },
    {
      when: answers => answers.framework !== 'Node Module',
      type: 'checkbox',
      name: 'libraries',
      message: 'Libraries',
      choices: [
        // 'autotrack',
        // 'font-awesome',
        'jquery',
        // 'modernizr',
        'normalize.css',
        'picturefill',
        // 'webfontloader',
        {type: 'separator'}
      ],
      default: [
        'normalize.css',
        'picturefill'
      ]
    }
  ];
}

module.exports = generateQuestions;
