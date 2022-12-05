// 约定提交规范 - 书写规范
module.exports = {
  types: [
    { value: 'feat', name: 'feat:     新需求或者新功能' },
    { value: 'fix', name: 'fix:      修复一个Bug' },
    { value: 'docs', name: 'docs:    变更的只有文档' },
    { value: 'style',name: 'style:    修改样式'},
    { value: 'refactor', name: 'refactor:    代码重构，注意和特性、修复区分开'},
    { value: 'perf', name: 'perf:    性能优化',},
    { value: 'test', name: 'test:    新增测试' },
    { value: 'chore', name: 'chore:    构建/工程依赖/工具'},
    { value: 'revert', name: 'revert:   版本回退' },
    { value: 'merge', name: 'merge:      合并代码' },
    { value: 'ci', name: 'ci:      持续集成' },
    { value: 'env', name: 'env:      环境变更' },
  ],
  messages: {
    type: "选择一种你的提交类型(type):",
    scope: '\n选择一个scope (可选):',
    // used if allowCustomScopes is true
    customScope: '模块名称scope:',
    subject: '短描述(description):\n',
    body: '长描述，使用"|"换行(可选):\n',
    breaking: '非兼容性说明 (可选):\n',
    footer: '关联关闭的issue或者解决的bug编码:\n',
    confirmCommit: '您确定要提交吗?',
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  subjectLimit: 100,
};