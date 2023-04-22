'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  //event为客户端上传的参数
const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云函数的event和context，必传
		event,
		context 
	})
  //返回数据给客户端
  let res = await dbJQL.collection('TestDemo').add({
    TestName: 'Ben'
  })
  return res
};
