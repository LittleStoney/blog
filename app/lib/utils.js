'use strict';

const path = require('path');
const { promises: fs } = require('fs');

module.exports = class Utils {
  constructor(app) {
    this.app = app;
    this.config = app.config;
    this.logger = app.logger;
  }

  /**
   * 拷贝文件
   * @async
   * @param {*} file 需要上传的file
   * @return {Promise<string>} 返回新的路径
   */
  async uploadFile(file) {
    const tmpPath = file.filepath;
    const ext = path.extname(file.filename);
    const newName = '' + (new Date().getTime()) + Math.round(Math.random() * 10000) + ext;
    const newPath = '/public/upload/' + newName;
    try {
      // 进行文件拷贝
      const data = await fs.readFile(tmpPath);
      await fs.writeFile(__dirname + '/..' + newPath, data);
      return newPath;
    } catch (error) {
      this.logger.error(new Error(error));
    } finally {
      // 删除临时文件
      await fs.unlink(tmpPath);
    }
  }

  /**
   * 分页函数
   * @param {number} total 总页数
   * @param {number} page 页码
   * @param {number} size 每页数量
   * @return {{star:number,size:number,show:string}} 返回数据
   */
  pagess(total, page = 1, size = 4) {
  // 1.计算截取的开始位置、结束位置、总页数
    let start = (page - 1) * size;
    let pages = Math.ceil(total / size);
    // 2.展示分页效果
    let show = '';
    show += '<a href="?page=1" class="page-link">首页</a>';
    show += `<a href="?page=${page - 1 >= 1 ? page - 1 : 1}" class="page-link">上一页</a>`;
    show += `<span class="current">${page}</span>`;
    show += `<a href="?page=${Number(page) + 1 <= pages ? Number(page) + 1 : page}" class="page-link">下一页</a>`;
    show += `<a href="?page=${pages}" class="page-link">尾页</a>`;
    return {
      start,
      size,
      show,
    };
  }
};

