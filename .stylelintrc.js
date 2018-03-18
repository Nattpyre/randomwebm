module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'property-no-unknown': [true, {
      ignoreProperties: [
        'composes'
      ]
    }],
    'selector-pseudo-class-no-unknown': [true, {
      ignorePseudoClasses: [
        'global'
      ]
    }],
    'string-quotes': 'single',
  },
};
