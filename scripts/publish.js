const {
  getAllTargets, 
  getCmdArgv, 
  getTargetDir, 
  getTargetPkg,
  getTargetObjByPath,
  execCmd,
  logError,
  logSuccess,
  logInfo,
  logWarn,
  logYellow
} = require("./utils");


runPublish();


async function runPublish(params) {
   
  // 1.代码格式化


  // 2. 代码格式检测


  // 3. commit-message 检测
  logInfo('\n commit message 检测....');
  const {stdout} = await execCmd("git", ["diff"], {stdio: 'pipe' });
  if(stdout){
    logInfo('\n 提交commit改变的change到本地仓库');
    await execCmd("pnpm", ["commit"]);
  }else {
    logInfo('\n 暂无commit change 需要提交');
    return process.exit(1);
  }

  

   // 4. 生成修改日志
   logInfo('\n 生成修改日志......');
   await execCmd("pnpm", ["run", "changelog"]);

  // 5. 推送代码到github
  logInfo('\n push到 GitHub......');
  await execCmd("git", ["push"]);

}