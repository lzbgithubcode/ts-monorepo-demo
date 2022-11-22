const fs = require("fs-extra");
const {
  getAllTargets, 
  getCmdArgv, 
  getTargetDir, 
  getTargetPkg,
  execCmd
} = require("./utils");

// 获取的命令参数
const args = getCmdArgv();
const targets = args._; //
const isBuildTypes = (args.types || args.t) === "true"; // 是否构建类型type 对应 --types 或者 -t
const isRollupWatch = (args.watch || args.w) === "true"; // 是否观察rollup 的watch
const isSourcemap = (args.sourceMap || args.s) === "true"; // 是否开启rollup 的sourceMap

console.log('获取的命令参数-------',args, targets,getAllTargets());

runBuild();

/**
 * @description: 构建方法
 * @return {*} void
 */
async function runBuild(){
  if(targets && targets.length > 0){
    buildAll(targets);
  }else {
    buildAll(getAllTargets());
  }
}

/**
 * @description: 编译目标数组
 * @param [] targets
 * @return {*}
 */
async function buildAll(targets =[]){
  const count = require("os").cpus().length;
  return runParallel(count, targets, build)
}


/**
 * @description: 构建单个目标
 * @param {*} target 目标项目
 * @return {*} viod 
 */
async function build(target){

  // 1. 获取文件
   const pkgDir = getTargetDir();
   const pkg = getTargetPkg(target);
  

  // 2. 如果是私有 获取没有获取到包
  if (!getAllTargets().length || pkg.private) {
    return process.exit(1);;
  }

  // 3. 移除dist 目录
  await fs.remove(`${pkgDir}/dist`);

  // 4. 运行命令 
  const args = ["-c", "--environment", `TARGET:${target}`]; 
  isSourcemap && args.push(`SOURCE_MAP:true`);
  await execCmd("rollup", args);
  
  console.log("运行命令的参数------", target,args);
  // 5. 生成文档

}


/**
 * @description: 并发构建
 * @param {*} maxConcurrency 最大并发数
 * @param {*} sourceTargets 构建目标targets数组
 * @param {*} iteratorFn 迭代函数
 * @return {*}
 */
async function runParallel(maxConcurrency, sourceTargets, iteratorFn){
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