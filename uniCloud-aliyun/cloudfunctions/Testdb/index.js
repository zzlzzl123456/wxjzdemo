'use strict';
const db = uniCloud.database();
const collection = db.collection('TestDemo');
exports.main = async (event, context) => {
  //event为客户端上传的参数
  let res = await collection.add({
    name: 'Ben'
  })
  //返回数据给客户端
  let data=[]
  return res
};