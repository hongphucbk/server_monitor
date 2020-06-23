//requiring path and fs modules
require('dotenv').config()
const { LineClient } = require('messaging-api-line');
const mariadb = require('mariadb');
const moment = require('moment');

const pool = mariadb.createPool({
	host: process.env.DB_HOST, 
	user: process.env.DB_USER, 
	password: process.env.DB_PASSWORD, 
	database: process.env.DB_DATABASE,
	connectionLimit: 5});

//Send Line
// get accessToken and channelSecret from LINE developers website
const client = LineClient.connect({
  accessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET, 
});

readData()
setInterval(async function(){
  readData()
}, 60*60*1000);


async function readData() {
  let conn;
  let strData="Thông tin người truy cập - " + moment(new Date()).format("YYYYMMDD-HHmmss") + '\n'
  					 +'--------------' + '\n'
  try {
 
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM course_count order by id desc limit 5");
    rows.forEach(function(data){
    	strData = strData + data.country + ' ' + data.city + ' - ' + data.location + ' - ' + data.ip + '\n'
    	strData = strData + '-----------\n'
    })
    client.push(process.env.CHANEL_ID, [
			{
			  type: 'text',
			  text: strData,
			},
		]);

    console.log('--------------------------------------')
    // // rows: [ {val: 1}, meta: ... ]
 
    // const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
    // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
 
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release(); //release to pool
  }
}

