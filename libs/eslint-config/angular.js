module.exports = {
  overrides: [
    {
      parserOptions: {
        project: ['./tsconfig.*?.json'],
      },
      files: ['*.ts'],
      plugins: ['rxjs', 'rxjs-angular', 'unused-imports'],
      extends: [
        'plugin:@nrwl/nx/angular',
        'plugin:@nrwl/nx/typescript',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:rxjs/recommended',
      ],
      rules: {
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              object: false,
            },
            extendDefaults: true,
          },
        ],
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-empty-interface': 0,
        '@typescript-eslint/prefer-readonly': 'error',
        '@angular-eslint/prefer-on-push-component-change-detection': 'error',
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            accessibility: 'no-public',
            overrides: { parameterProperties: 'explicit' },
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          { type: 'element', prefix: 'avo', style: 'kebab-case' },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          { type: 'attribute', prefix: 'avo', style: 'camelCase' },
        ],
        'rxjs-angular/prefer-takeuntil': [
          'error',
          {
            alias: ['take', 'takeUntil', 'takeUntilDestroyed'],
            checkComplete: true,
            checkDecorators: ['Component', 'Directive', 'Injectable'],
            checkDestroy: false,
          },
        ],
        'unused-imports/no-unused-imports': 'error',
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@nrwl/nx/angular-template'],
      rules: {
        '@angular-eslint/template/no-negated-async': 'error',
        '@angular-eslint/template/no-call-expression': 'error',
        '@angular-eslint/template/banana-in-box': 'error',
      },
    },
    {
      files: ['*.js', '*.jsx'],
      extends: ['plugin:@nrwl/nx/javascript'],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-unused-vars': 0,
      },
    },
    {
      files: ['**/**/test.ts'],
      extends: ['plugin:@nrwl/nx/typescript'],
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
      },
    },
  ],
};
