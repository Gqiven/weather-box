const cloud = require('wx-server-sdk')
cloud.init();


const db = cloud.database()
exports.main = async (event, context) => {
  // console.log('cloud-update', event)
  let _db_name = event.db_name;
  let _data = event.value;
  try {
    // return await db.collection(_db_name).add({
    //   // data 字段表示需新增的 JSON 数据
    //   data: _data
    // })
    return await db.collection(_db_name).where({
      _id: _data._id
    })
    .update({
      data: {
        time: new Date()
      },
    })
  } catch (e) {
    console.error(e)
  }
}