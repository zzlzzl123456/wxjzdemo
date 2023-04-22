'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
  //event为客户端上传的参数
  console.log('event : ', event)
  let {
    keyword
  } = event
  console.log(keyword)
  const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云函数的event和context，必传
    event,
    context
  })
  //返回数据给客户端
  let bookList = await dbJQL.collection('user-bookList').where(
    `${new RegExp(keyword, "ig")}.test(recordDate) && userId==$cloudEnv_uid`).getTemp()
  let bookTypeList=await dbJQL.collection('user-bookTypeList').field('_id,type,name,icon').getTemp()
  let res=await dbJQL.collection(bookList,bookTypeList).get()
  let data = res.data
  console.log(res)
 console.log(data)
  let newArr = [];
  //遍历数组
  data.forEach((item, i) => {
    // 默认当前操作的数据下标 -1 
    let index = -1;
    // 判断数组中是否已经存在当前遍历数据的时间
    let isExists = newArr.some((newItem, j) => {
      if (item.recordDate == newItem.recordDate) {
        // 存在就保存当前数据下标  用于插入数据
        index = j;
        return true;
      }
    })
    // 如果没有就存储一条新对象数据
    if (!isExists) {
      newArr.push({
        recordDate: item.recordDate,
        subList: [item],
        payAmt:"",
        incomeAmt:"",
        date:""
      })
    } else {
      // 如果有就插入到已存在的对象中
      newArr[index].subList.push(item);
    }
  })
  //返回数据给客户端
      newArr.forEach((item1 ,i)=>{
        let date=item1.recordDate
        let payAmt=0
        let incomeAmt=0
        item1.date=date.slice(date.length-2,date.length)
        item1.subList.forEach((item2,i)=>{
          if(item2.type==0){
            payAmt+=item2.money
          }else{
            incomeAmt+=item2.money
          }
        })
       item1.incomeAmt=(incomeAmt/100).toFixed(2)
       item1.payAmt=(payAmt/100).toFixed(2)
      })
      newArr.sort((a,b)=>{ return b.date-a.date})//升序
      
  return  newArr
};