#### 一、初始化项目

##### 1. 创建 workspace 生成 package.json

> pnpm init

[package.json 文件配置](https://pnpm.io/zh/package_json)

##### 2. 创建`pnpm-workspace.yaml`,定义了 工作空间 的根目录，并能够使您从工作空间中包含 / 排除目录

> touch pnpm-workspace.yaml

[pnpm-workspace.yaml 文件配置](https://pnpm.io/zh/pnpm-workspace_yaml)

##### 3. 在工程目录下创建文件夹以及需要文件

```
.
├── packages
│   ├── pkg1
│   │   ├── package.json   // pkg1项目需要依赖
│   │   ├── src
│   │   │   └── index.ts
│   │   └── tsconfig.json  // 引入tsconfig.root.json配置并扩展pkg1项目需要
│   └── pkg2
│       ├── package.json    // pkg2项目需要依赖
│       ├── src
│       │   └── index.ts
│       └── tsconfig.json  // 引入tsconfig.root.json配置并扩展pkg2项目需要
├── package.json         // 依赖包
├── pnpm-workspace.yaml  // 工作空间配置
└── tsconfig.root.json   // ts的根配置
```

##### 4. 安装全局都需要使用的包

###### 4.1 基础环境

- `typescript` (全局使用 ts 语法)

###### 4.2 构建环境包

- `rollup`（构建工具）
- `@rollup/plugin-commonjs`(commonjs->es 给 rollup 使用)
- `@rollup/plugin-node-resolve`(查找在 node_modules 中的第三方依耐项)
- `@rollup/plugin-typescript`(rollup 处理 ts)
- `@atomico/rollup-plugin-sizes`（显示打包文件大小）
- `rollup-plugin-cleanup`(删除 js 的空格注释)
- `rollup-plugin-clear` (删除指定的文件夹-用于删除 dist 目录)
- `@rollup/plugin-babel`、`@babel/core`、`@babel/preset-env`、`@babel/preset-typescript` 使用 babel 编译，不使用 tsc 编译到 es5





###### 4.3 代码质量代码风格工具


###### 4.4 git 工作流工具

**1. git的hooks工具:**[husky](https://github.com/typicode/husky) - git工作流的hook,s在提交代码的时候会触发 husky



**2. 生成commit-message的工具**: 
```md
  方案一:  `@commitlint/prompt-cli`或者`@commitlint/cz-commitlint`
  方案二:  `cz-conventional-changelog ` + `commitizen`
  方案三:  `cz-customizable` + `commitizen`   我的方案
```

* [commitizen](https://github.com/commitizen/cz-cli) commit -message规范，替代`git commit`

* [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog) commit -message的交互式创建提交信息的工具的适配器

* [cz-customizable](https://github.com/leoforfree/cz-customizable) commit -message的交互式创建提交信息的工具的适配器 支持中文配置-本文使用的方案


**3. commit校验工具:**[commitlint](https://github.com/conventional-changelog/commitlint#getting-started)提交代码commit检测校验commit message的工具



**4. 生成changelog的工具**:
- [conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli) 根据git提交记录生成changelog, 从git metadata生成变更日志

- [@changesets/cli](https://github.com/changesets/changesets)版本管理和`changelogs`工具,遵循 semver 规范 - 生成 changeLog 工具 - *暂时未用这个工具，生成的日志不好看*

**5. 代码规范校验**:



#### 二、 项目文件配置


##### 4、git工作流的hooks`husky`配置
1. 初始化husky， 执行命令后再项目根目录生成`.husky文件夹`,目录下面有`_和husky.sh`
```
  npx husky install
```

2. `.husky`目录下创建commit之前执行脚本命令（比如运行代码格式化之类）,会在`.husky`目录创建`pre-commit`的shell文件
```sh
npx husky add .husky/pre-commit "npm run lint"
```

3. `.husky`目录创建commit-message校验shell
```sh
npx husky add .husky/commit-msg "npx --no-install commitlint -e "$1""
```


##### 5. commit提交校验工具配置-`commitlint`
1. 安装
```sh
pnpm add @commitlint/cli @commitlint/config-conventional -wD
```

2. 项目根目录创建`.commitlintrc.cjs`文件
```js
//  配置 commit-message检测.commitlintrc.cjs
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
        'test'
      ]
    ],
    'type-empty': [2, 'never'],
    'scope-empty': [2, 'never'],
    'subject-empty': [2, 'never']
  }
}

```

3. 在husky的hooks中增加检测
```sh
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit $1'
```


##### 6. commit规范配置`commitizen与cz-conventional-changelog`、`cz-customizable`
1. 在项目更目录创建`touch .czrc`文件, 配置是配置的路径
```json
//  .czrc 文件 配置 适配器的路径
{
  "path": "cz-customizable", // 方案二 "cz-conventional-changelog"
}

//  或者在package.json配置
{
  // ....省略
  "config": {
    "commitizen": {
      "path": "cz-customizable", // 方案二 "cz-conventional-changelog"
    }
  }
}
```

2. 项目根目录创建`touch .cz-config.js`
```js
// 约定提交规范 - 书写规范
// 约定提交规范 - 书写规范

const fs = require("fs");
const scopesList =  fs.readdirSync("packages");
scopesList.push("scripts脚本");
scopesList.push("docs文档");
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
  scopes: scopesList, 
  messages: {
    type: "选择一种你的提交类型type(必选):",
    // used if allowCustomScopes is true
    scope: '请选择变化的范围scope(可选):',
    subject: '请简要描述提交subject(必填):',
    body: '长描述，使用"|"换行body(可选):\n',
    breaking: '列出任何突发的变化breaking(可选):\n',
    footer: '关联关闭的issue或者解决的bug编码footer(可选):\n',
    confirmCommit: '您确定要提交吗?',
  },
  // 跳过步骤
  allowCustomScopes: true,
  skipQuestions: ['breaking'],
  allowBreakingChanges: [],
  subjectLimit: 100,
};
```

3. 执行命令检验
```json
{
  "scripts": {
    ...
    "commit": "git add . && git cz",
  },
}
```



##### 7. 生成changelog配置
```json
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i doc/CHANGELOG.md -s -r 0"
  }
}
```
运行命令不会覆盖以前的Changelog,只会在CHANGELOG.md的头部加上自从上次发布以来的变动
Changelog的生成依据: *根据commit 提交信息生成的changelog*
* Features（对应type: feat）
* Bug Fixes（对应type: fix）
* Code Refactoring (对应type: refactor且breaking changes为y)
* Performance Improvements（对应type: perf）
* Reverts (对应type: revert)
* BREAKING CHANGES (显示body中为BREAKING CHANGES的内容)



