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
* [commitlint](https://github.com/conventional-changelog/commitlint#getting-started)提交代码commit检测校验commit message的工具


* [commitizen](https://github.com/commitizen/cz-cli) commit -message规范，替代`git commit`

* [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog) commit -message的交互式创建提交信息的工具的适配器

- [conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli) 根据git提交记录生成changelog, 从git metadata生成变更日志

- [@changesets/cli](https://github.com/changesets/changesets)版本管理和`changelogs`工具,遵循 semver 规范 - 生成 changeLog 工具 - *暂时未用这个工具，生成的日志不好看*

- [husky](https://github.com/typicode/husky) - git工作流的hook,s在提交代码的时候会触发 husky




#### 二、 项目文件配置

##### 1. 配置全局的 tsconfig.json

[详细 tsconfig.json 配置](https://www.typescriptlang.org/tsconfig)

常用配置

```json
{
  "compilerOptions": {
    //Modules
    "moduleResolution": "node", // 指定模块解析策略：'node' （Node.js） 或 'classic' `classic不需要`
    "module": "esnext", // 设置程序的模块系统 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'

    // Emit
    "declaration": false, // 如果设为true，编译每个ts文件之后会生成一个js文件和一个声明文件
    "declarationMap": false, // 值为true或false，指定是否为声明文件.d.ts生成map文件
    "sourceMap": false, // 用来指定编译时是否生成.map文件
    "removeComments": true, // 编译的时候删除注释
    "outDir": "dist", // 编译后的文件存到到哪个目录下,默认是每一个ts文件的当前目录

    // javaScript Support
    "allowJs": true, // 允许编译JS
    "checkJs": true, // 是否检测JS的语法

    // Language and Environment
    "lib": ["es5", "es6", "esnext", "dom"], // 注入的库
    "target": "es5", // 与lib搭配使用 - 使用babel编译将无效

    // Compiler Diagnostics
    "listEmittedFiles": true, // 打印出编译后生成文件的名字。
    "listFiles": true, // 编译过程中打印文件名。

    //Interop Constraints
    "esModuleInterop": true, // 通过为导入内容创建命名空间，实现CommonJS和ES模块之间的互操作性

    // Type Checking
    "strict": false, // 严格模式检测下面选项
    "alwaysStrict": true, // 使用js的严格模式,在每一个文件上部声明 use strict
    "noImplicitAny": true, // 不允许变量或函数参数具有隐式any类型
    "noImplicitThis": false, //  // 检测this是否隐式指定
    "strictBindCallApply": true, // 严格检查bind call apply
    "strictNullChecks": true, // null类型检测,const teacher: string = null;会报错
    "strictFunctionTypes": true, // 对函数参数进行严格逆变比较
    "strictPropertyInitialization": true, // 此规则将验证构造函数内部初始化前后已定义的属性。

    // 其他检测
    "noImplicitReturns": false, // 用于检查函数是否有返回值，设为true后，如果函数没有返回值则会提示
    "noUnusedParameters": true, // 用于检查是否有在函数体中没有使用的参数
    "noUnusedLocals": true, // 是否检测定义了但是没使用的变量
    "noFallthroughCasesInSwitch": true //  // 用于检查switch中是否有case没有使用break跳出switch
  },
  "include": ["packages/*/src/"]
}
```

##### 2. `rollup.config.mjs`构建文件的配置

- 确定构建的目标`cjs`、`amd`、`es`、`iife`、`umd`
- 构建其他配置以及优化

```javascript
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

// 查找外部模块
import { nodeResolve } from "@rollup/plugin-node-resolve";
// 将commonjs转化为es6
import commonjs from "@rollup/plugin-commonjs";
// 编译ts文件
import typescript from "@rollup/plugin-typescript";
// 显示文件打下
import sizes from "@atomico/rollup-plugin-sizes";
// 删除js的注释空格
import cleanup from "rollup-plugin-cleanup";
// 删除指定文件
import clearDir from "rollup-plugin-clear";
// babel 编译es5
import { babel } from "@rollup/plugin-babel";

if (!process.env.TARGET) {
  throw new Error("命令中必须 输入TARGET 编译目标");
}
const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const resolvePath = (dir, p) => path.resolve(dir, p);
// 获取项目的packages包
const packageDir = resolvePath(__dirname, "packages");
const targetPkgDir = resolvePath(packageDir, process.env.TARGET);
const targetPkgDist = resolvePath(targetPkgDir, "dist");
const targetPkg = require(resolvePath(targetPkgDir, "package.json"));
const name =
  (targetPkg.buildOptions && targetPkg.buildOptions.name) ||
  path.basename(targetPkgDir);
const targetTsconfigPath = resolvePath(targetPkgDir, "tsconfig.json");

// 各种插件
const tsPlugin = typescript({
  tsconfig: resolvePath(__dirname, "tsconfig.json"),
});
const commonjsPlugin = commonjs({
  exclude: "node_modules",
});
const nodeResolvePlugin = nodeResolve();

// 计算大小插件
const sizesPlugin = sizes();
// 清楚插件
const cleanupPlugin = cleanup({
  comments: "none",
});
// 删除指定文件目录
const clearDirPlugin = clearDir({
  targets: [targetPkgDist],
});

// babel编译到es5
const babelPlugin = babel({
  exclude: "node_modules/**",
  babelHelpers: "bundled",
});

// 基础配置
const baseConfig = {
  input: `${targetPkgDir}/src/index.ts`,
  output: {
    name: name,
    sourcemap: false,
    minifyInternalExports: true,
  },
  plugins: [
    sizesPlugin,
    cleanupPlugin,
    tsPlugin,
    commonjsPlugin,
    nodeResolvePlugin,
    clearDirPlugin,
    babelPlugin,
  ],
};

// 编译commonjs， 适用于node与webpack
const cjsConfig = {
  ...baseConfig,
  output: {
    format: "cjs",
    file: `${targetPkgDist}/${name}.cjs.js`,
    ...baseConfig.output,
  },
  plugins: [...baseConfig.plugins],
};

// 编译amd 异步模块定义，用于像RequireJS这样的模块加载器
const amdConfig = {
  ...baseConfig,
  output: {
    file: `${targetPkgDist}/${name}.amd.js`,
    format: "amd",
    ...baseConfig.output,
  },
  plugins: [...baseConfig.plugins],
};

// 编译iife 适合作为<script>标签
const iifeConfig = {
  ...baseConfig,
  output: {
    file: `${targetPkgDist}/${name}.global.js`,
    format: "iife",
    ...baseConfig.output,
  },
  plugins: [...baseConfig.plugins],
};

// 编译umd 通用模块定义，以amd，cjs 和 iife 为一体
const umdConfig = {
  ...baseConfig,
  output: {
    file: `${targetPkgDist}/${name}.umd.js`,
    format: "umd",
    ...baseConfig.output,
  },
  plugins: [...baseConfig.plugins],
};

// 编译esm模块，适用于<script type=module> 标签引入 或者import
const esmConfig = {
  ...baseConfig,
  output: {
    file: `${targetPkgDist}/${name}.es.js`,
    format: "esm",
    ...baseConfig.output,
  },
  plugins: [...baseConfig.plugins],
};

const config = {
  cjsConfig,
  amdConfig,
  iifeConfig,
  umdConfig,
  esmConfig,
};
export default [...Object.values(config)];
```

##### 3、 `.babelrc`babel 插件转 es5

```json
{
  "presets": [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        "targets": "last 1 version,> 1%,not dead",
        "corejs": 3,
        "useBuiltIns": "usage"
      }
    ]
  ]
}
```
##### 4、husky配置
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


##### 5. 配置commitlint检测工具
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


##### 6. 配置commitizen与配置cz-conventional-changelog
1. 在项目更目录创建`touch .czrc`文件, 配置是配置的路径
```json
//  .czrc 文件 配置 适配器的路径
{
  "path": "cz-conventional-changelog"
}

//  或者在package.json配置
{
  // ....省略
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

2. 在


#### 三、shell 脚本编写

- `preinstall` npm 的 hook-执行 install 必须使用 pnpm
- `build` 构建打包不同的包的脚本

##### 1. `preinstall`的生命周期 hooks 的脚本

```javascript
if (!/pnpm/.test(process.env.npm_execpath || "")) {
  console.warn(`\n请安装pnpm 包管理才能正常工作\n`);
  process.exit(1);
}
```

##### 2. `build` rollup 构建脚本

```javascript
const fs = require("fs-extra");
const {
  getAllTargets,
  getCmdArgv,
  getTargetDir,
  getTargetPkg,
  execCmd,
} = require("./utils");

// 获取的命令参数
const args = getCmdArgv();
const targets = args._; //
const isBuildTypes = (args.types || args.t) === "true"; // 是否构建类型type 对应 --types 或者 -t
const isRollupWatch = (args.watch || args.w) === "true"; // 是否观察rollup 的watch
const isSourcemap = (args.sourceMap || args.s) === "true"; // 是否开启rollup 的sourceMap

console.log("获取的命令参数-------", args, targets, getAllTargets());

runBuild();

/**
 * @description: 构建方法
 * @return {*} void
 */
async function runBuild() {
  if (targets && targets.length > 0) {
    buildAll(targets);
  } else {
    buildAll(getAllTargets());
  }
}

/**
 * @description: 编译目标数组
 * @param [] targets
 * @return {*}
 */
async function buildAll(targets = []) {
  const count = require("os").cpus().length;
  return runParallel(count, targets, build);
}

/**
 * @description: 构建单个目标
 * @param {*} target 目标项目
 * @return {*} viod
 */
async function build(target) {
  // 1. 获取文件
  const pkgDir = getTargetDir();
  const pkg = getTargetPkg(target);

  // 2. 如果是私有 获取没有获取到包
  if (!getAllTargets().length || pkg.private) {
    return process.exit(1);
  }

  // 3. 移除dist 目录
  await fs.remove(`${pkgDir}/dist`);

  // 4. 运行命令
  const args = ["-c", "--environment", `TARGET:${target}`];
  isSourcemap && args.push(`SOURCE_MAP:true`);
  await execCmd("rollup", args);

  console.log("运行命令的参数------", target, args);
  // 5. 生成文档
}

/**
 * @description: 并发构建
 * @param {*} maxConcurrency 最大并发数
 * @param {*} sourceTargets 构建目标targets数组
 * @param {*} iteratorFn 迭代函数
 * @return {*}
 */
async function runParallel(maxConcurrency, sourceTargets, iteratorFn) {
  const ret = [];
  const executing = [];
  const maxTargetLen = sourceTargets.length;
  for (const item of sourceTargets) {
    // 增加到微任务队列
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);

    // 超过CPU的核数量
    if (maxConcurrency <= maxTargetLen) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}
```

运行命令后会在每个包的下面生成`dist`目录, 每个目录下文件

- `{name}.amd.js` 异步模块，用于像 RequireJS 这样的模块加载器
- `{name}.cmd.js` 符合 Commonjs 规范, 适用于 node 的 require 导入
- `{name}.es.js` 符合 ES Module 规范, 适用于 import 导入
- `{name}.global.js` 符合 iife 规范, 适用于 `<script>`标签 导入
- `{name}.umd.js` 通用模块定义，以 amd，cjs 和 iife 为一体

* [rollup 官方推荐包](https://github.com/rollup/plugins)
