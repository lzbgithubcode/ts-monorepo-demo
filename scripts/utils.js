const fs = require("fs");
const path = require("path");
const execa = require("execa");

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
 * @param {*} target 目标文件
 * @return {*}
 */
const getTargetPkg = (target)=>{
  return require(`${getTargetDir(target)}/package.json`);
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
 * @param {*} cmd 命令名称
 * @param {*} args 参数
 * @param {*} opt  配置项
 * @return {*}
 */
const execCmd = async (cmd, args, opt = {})=>{
   return await execa(cmd, args ,{stdio: 'inherit', ...opt})
}



module.exports = {
  getAllTargets,
  getTargetDir,
  getTargetPkg,
  getCmdArgv,
  execCmd

}