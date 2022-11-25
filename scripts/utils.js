const fs = require("fs");
const path = require("path");
const execa = require("execa");
const chalk = require("chalk");

/**
 * @description: 获取所有的目标target
 * @return {*}
 */
const getAllTargets = ()=> {
    return fs.readdirSync("packages").filter(f => {
       if(!fs.statSync(`packages/${f}`).isDirectory()){
           return false;
        }
        const pkg = getTargetPkg(f);
        if(pkg.private && !pkg.buildOptions){
          return false;
        }
        return true;
    });
}
/**
 * @description: 获取目标文件夹的目录
 * @param {*} target 目标文件夹名称
 * @return {*}
 */
const getTargetDir = (target)=>{
  return path.resolve(`packages/${target}`);
}

/**
 * @description:  获取目标文件夹的package.json文件
 * @param {string} target 目标文件
 * @return {*}
 */
const getTargetPkg = (target)=>{
  const pkgPath = `${getTargetDir(target)}/package.json`;
  return getTargetObjByPath(pkgPath);
}

/**
 * @description:  根据路径获取文件路径下的对象
 * @param {string} path 路径
 * @return {*}
 */
const getTargetObjByPath = (path) => {
  return  JSON.parse(fs.readFileSync(path, 'utf-8'))
}
/**
 * @description:  获取命令行参数
 * @return {*}
 */
const getCmdArgv = ()=>{
  const argv = require('minimist')(process.argv.slice(2));
  return argv;
};


/**
 * @description:  执行命令函数
 * @param {*} bin 命令名称
 * @param {*} args 参数
 * @param {*} opts  配置项
 * @return {*}
 */
const execCmd = async (bin, args, opts = {})=>{
   console.log(chalk.blue(`[运行命令] ${bin} ${args.join(' ')}`), opts);
   return await execa(bin, args ,{stdio: 'inherit', ...opts})
}


/**
 * @description: 打印错误日志
 * @param {*} message
 * @return {*}
 */
const logError = (msg) => {
  console.log();
  console.log(`${chalk.bgRed.white(' ERROR ')}   ${chalk.red(msg)}`);
  console.log();
};

/**
 * @description: 打印成功日志
 * @param {*} msg
 * @return {*}
 */
const logSuccess = (msg)=>{
  console.log();
  console.log(`${chalk.bgGreen.white(' SUCCESS ')}   ${chalk.green(msg)}`)
  console.log();
};

/**
 * @description: 打印常规日志
 * @param {*} msg
 * @return {*}
 */
const logInfo = (msg)=>{
  console.log(chalk.cyan(msg));
}

/**
 * @description: 打印常规日志
 * @param {*} msg
 * @return {*}
 */
 const logYellow= (msg)=>{
  console.log(chalk.yellowBright(msg));
}

/**
 * @description: 打印警告日志
 * @param {*} msg
 * @return {*}
 */
const logWarn = (msg)=> {
  console.log(`${chalk.bgYellow.white('warn')}   ${chalk.yellow(msg)}`)
};

module.exports = {
  getAllTargets,
  getTargetDir,
  getTargetPkg,
  getTargetObjByPath,
  getCmdArgv,
  execCmd,
  logError,
  logSuccess,
  logInfo,
  logWarn,
  logYellow


}