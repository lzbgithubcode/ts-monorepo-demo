const fs = require("fs-extra");
const {
  getAllTargets, 
  getCmdArgv, 
  getTargetDir, 
  getTargetPkg,
  execCmd,
  logError,
  logSuccess,
  logInfo,
  logWarn
} = require("./utils");

// 获取的命令参数
const args = getCmdArgv();
const targets = args._; //
const isBuildTypes = (args.types || args.t) === "true"; // 是否构建类型type 对应 --types 或者 -t
const isRollupWatch = (args.watch || args.w) === "true"; // 是否观察rollup 的watch
const isSourcemap = (args.sourceMap || args.s) === "true"; // 是否开启rollup 的sourceMap


runBuild();

/**
 * @description: 构建方法
 * @return {*} void
 */
async function runBuild(){
   try {
    if(targets && targets.length > 0){
      await buildAll(targets);
    }else {
      await buildAll(getAllTargets());
    }
    logSuccess("恭喜您，构建成功!!!!");
   }catch (error) {
    logError(`很抱歉,构建失败!!!!   ${error}`); 
     process.exit(1);
   }
}

/**
 * @description: 编译目标数组
 * @param [] targets
 * @return {*}
 */
async function buildAll(targets =[]){
  const count = require("os").cpus().length;
  return await runParallel(count, targets, build)
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
    logWarn(`构建失败, 未能获取到构建的包`)
    return process.exit(1);
  }

  // 3. 移除dist 目录
  await fs.remove(`${pkgDir}/dist`);

  // 4. 运行命令 
  const args = ["-c", "--environment", `TARGET:${target}`]; 
  isSourcemap && args.push(`SOURCE_MAP:true`);
  await execCmd("rollup", args);
  
  logInfo(`运行包---${target}, 运行包命令的参数---${args}`);
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