
##### 1. 创建workspace 生成package.json
> pnpm init 

[package.json文件配置](https://pnpm.io/zh/package_json)

##### 2. 创建`pnpm-workspace.yaml`,定义了 工作空间 的根目录，并能够使您从工作空间中包含 / 排除目录
> touch pnpm-workspace.yaml

[pnpm-workspace.yaml文件配置](https://pnpm.io/zh/pnpm-workspace_yaml)

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
* typescript (全局使用ts语法)
* rollup（构建工具）
* @rollup/plugin-commonjs(commonjs->es给rollup使用)
* @rollup/plugin-node-resolve(查找在node_modules中的第三方依耐项)
* @rollup/plugin-typescript(rollup处理ts)
* @atomico/rollup-plugin-sizes（显示打包文件大小）
* rollup-plugin-cleanup(删除js的空格注释)
* rollup-plugin-clear (删除指定的文件夹-用于删除dist目录)

##### 6. 配置全局的tsconfig.json
[详细tsconfig.json配置](https://www.typescriptlang.org/tsconfig)

##### 5. 构建项目shell编写
* `preinstall` npm的hook-执行install 必须使用pnpm












* [rollup官方推荐包](https://github.com/rollup/plugins)




