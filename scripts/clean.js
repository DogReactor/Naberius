const fs = require('fs');
const path = require('path');

/**
 * 递归删除js文件
 * @param {string} _path 路径
 */
const recursiveDelete = (_path) => {
  fs.readdirSync(_path).forEach(name => {
    const childPath = path.join(_path, name);
    const stat = fs.statSync(childPath);
    // 文件夹就递归
    if(stat.isDirectory()) recursiveDelete(childPath);
    else {
      if(name.split('.').pop() === 'js') {
        fs.unlinkSync(childPath);
      }
    }
  })
}

recursiveDelete(process.argv[2]);
