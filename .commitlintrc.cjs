//  约定提交规范 - 校验与检测
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'env',
        'build',
        'ci',
        'perf',
        'feat',
        'fix',
        'refactor',
        'docs',
        'chore',
        'style',
        'revert',
        'test',
        "merge",
        "env",
        "ci"
      ]
    ],
    'type-empty': [2, 'never'],
    'scope-empty': [2, 'never'],
    'subject-empty': [2, 'never']
  }
}
