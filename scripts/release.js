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

const { prompt } = require('enquirer');
const path = require("path");
const { writeFileSync} = require("fs");
const packages = getAllTargets();


runRelease();





async function runRelease(){

  // 1. 确定版本
  const {targetVersion,pkg,pkgDirName, pkgPath, rootPath}  =  await checkVersion();
   
  // 2. 跑测试
  logInfo('\n 正在测试中......');
  
  // 3. 更新所有依耐包的版本
  logInfo('\n 更新所有依耐包的版本......');
  if(pkgDirName == "root"){
    updatePackageVersion(rootPath,targetVersion);
  }else {
    // 更新子路径的版本
    updatePackageVersion(pkgPath,targetVersion);
    // 更新根路径依赖的版本
    updateDevVersion(rootPath,pkgDirName, targetVersion);
    const otherPackages = packages.filter(p => p !== pkgDirName);
    !!otherPackages && otherPackages.forEach(pName => {
      const pkgPath  = `${getTargetDir(pName)}/package.json`;
      updateDevVersion(pkgPath,pkgDirName, targetVersion);
    })

  }
  
  // 4. 构建所有包
  logInfo('\n 构建所有包......');
  if(pkgDirName == "root"){
    await execCmd("pnpm", ["run", "build"]);
  }else{
    await execCmd("pnpm", ["run", "build", `${pkgDirName}`]);
  }


  // 5.commit
  logInfo('\n commit 检测....');
  const {stdout} = await execCmd("git", ["diff"], {stdio: 'pipe' });
  if(stdout){
    logInfo('\n 提交commit改变的change到本地仓库');
    await execCmd("pnpm", ["commit"]);

    // await execCmd("git", ["commit", "-m", `发布${pkgDirName}包版本${targetVersion}`]);
  }else {
    logInfo('\n 暂无commit change 需要提交');
    return process.exit(1);
  }

    // 5. 生成修改日志
    logInfo('\n 生成修改日志......');
    await execCmd("pnpm", ["run", "changelog"]);

   // 暂时不需要打tag标签
   logInfo('\n push到 GitHub......');
   await execCmd("git", ["push"]);


    

  // 7.publish 所有的包
  logInfo('\n publish 所有的包......');


}
// 检测版本
async function checkVersion(){

  const packageList = getAllTargets() || [];
  packageList.unshift("root");
  // 获取包
  const { pkgDirName } = await prompt({
    type: 'select',
    name: 'pkgDirName',
    message: "请选择您想要发布的包",
    choices: packageList,
  });

  // 获取包的package.json
  let pkgPath = "";
  let rootPath = path.resolve(path.resolve(__dirname, '..'), 'package.json');
  if(pkgDirName === "root"){
      pkgPath = rootPath;
  }else {
     pkgPath  = `${getTargetDir(pkgDirName)}/package.json`;
  }
  const pkg = getTargetObjByPath(pkgPath);
  const  initVersion = pkg.version;
  
   
   const { targetVersion } = await prompt({
    type: 'input',
    name: 'targetVersion',
    message: "请输入将要发布包的版本",
    initial: initVersion,
  });

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    initial: "true",
    message: `请确定要发布${pkgDirName}包的V${targetVersion}版本吗?`
  })

  if (!yes) {
    process.exit(1);
  }

  return {
    targetVersion,
    pkg,
    pkgDirName,
    pkgPath,
    rootPath
  }
}

//更新包的版本
function updatePackageVersion(pkgPath, version){
    // 根据目标路径下的版本 
    const pkg = getTargetObjByPath(pkgPath);
    pkg.version = version;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}


// 更新依耐包的版本
function updateDevVersion(pkgPath,devPkgName,version){
  const pkg = getTargetObjByPath(pkgPath);
  updateDependencies(pkg, devPkgName, 'dependencies', version);
  updateDependencies(pkg, devPkgName, 'devDependencies', version);
  updateDependencies(pkg, devPkgName, 'peerDependencies', version);
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

// 更新依耐包的版本
function updateDependencies(pkg,devPkgName, depType, version){
  const deps = pkg[depType];
  const pre = pkg.packagePre || "";
  let targetDev = `${pre}/${devPkgName}`;
  if(!deps) return;
  Object.keys(deps).forEach(dep => {
       
      
    if(!!pre && dep === targetDev){
        deps[dep] =version;
        logYellow(`${pkg.name} -> ${depType} -> ${dep}@${version}`)
      }
  });
}