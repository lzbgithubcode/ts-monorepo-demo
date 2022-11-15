
import path from "path";
// 查找外部模块
import {nodeResolve} from "@rollup/plugin-node-resolve"; 
// 将commonjs转化为es6
import commonjs from "@rollup/plugin-commonjs";
// 编译ts文件
import typescript from "@rollup/plugin-typescript";
// 显示文件打下
import sizes from "@atomico/rollup-plugin-sizes"
// 删除js的注释空格
import cleanup from 'rollup-plugin-cleanup';
// 删除指定文件
import clearDir from "rollup-plugin-clear";



if(!process.on.TARGET){
  throw new Error("命令中必须 输入TARGET 编译目标");
}

const resolvePath = (dir,p)=> path.resolve(dir, p);
// 获取项目的packages包
const packageDir = resolvePath(__dirname, "packages");
const targetPkgDir = resolvePath(packageDir, process.env.TARGET);
const targetPkgDist = resolvePath(targetPkgDir, 'dist');
const targetPkg = require(resolvePath(targetPkgDir, 'package.json'));
const fileName = (targetPkg.buildOptions && targetPkg.buildOptions.filename) || path.basename(targetPkgDir);
const targetTsconfigPath = resolvePath(targetPkgDir, "tsconfig.json");

// 各种插件
const tsPlugin = typescript({
  tsconfig:targetTsconfigPath,
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


// 基础配置
const baseConfig = {
     input: `${targetPkgDir}/src/index.ts`,
     output:{
        sourcemap: false,
        minifyInternalExports: true,
     },
     plugins:[
      sizesPlugin,
      cleanupPlugin,
      tsPlugin,
      commonjsPlugin,
      nodeResolvePlugin,
      clearDirPlugin,
     ]
};

// 编译commonjs， 适用于node与webpack
const cjsConfig = {
  ...baseConfig,
  output:{
    format: "cjs",
    file: `${targetPkgDist}/${fileName}.cjs.js`,
    ...baseConfig.output
  },
  plugins: [...baseConfig.plugins],
}


// 编译amd 异步模块定义，用于像RequireJS这样的模块加载器
const amdConfig = {
  ...baseConfig,
  output: {
    file: `${targetPkgDist}/${fileName}.amd.js`,
    format: "amd",
    ...baseConfig.output,
  },
  plugins: [...baseConfig.plugins],
}

// 编译iife 适合作为<script>标签
const iifeConfig = {
  ...baseConfig,
  output: {
    file: `${targetPkgDist}/${fileName}.global.js`,
    format: "iife",
    ...baseConfig.output,
  },
  plugins: [...baseConfig.plugins],
}

// 编译umd 通用模块定义，以amd，cjs 和 iife 为一体
const umdConfig = {
  ...baseConfig,
  output: {
    file: `${targetPkgDist}/${fileName}.umd.js`,
    format: "umd",
    ...baseConfig.output,
  },
  plugins: [...baseConfig.plugins],
}


// 编译esm模块，适用于<script type=module> 标签引入 或者import
const esmConfig = {
  ...baseConfig,
  output: {
    file: `${targetPkgDist}/${fileName}.es.js`,
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
export default  [...Object.values(config)];