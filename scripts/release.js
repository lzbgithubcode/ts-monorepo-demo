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




async function runRelease(){

  // 1. 确定版本
   
  // 2. 跑测试
  logInfo('\n 正在测试中......');
  
  // 3. 更新所有包的版本
  logInfo('\n 更新所有包的版本......');

  // 4. 构建所有包
  logInfo('\n 构建所有包......');

  // 5. 生成修改日志
  logInfo('\n 生成修改日志......');

  // 6.更新pnpm-lock.yaml
  logInfo('\n 更新pnpm-lock.yaml......');

  // 7.push到 GitHub
  logInfo('\n push到 GitHub......');

  // 8.publish 所有的包
  logInfo('\n publish 所有的包......');


}