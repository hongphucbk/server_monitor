//requiring path and fs modules
require('dotenv').config()
const net = require('net');
const { LineClient } = require('messaging-api-line');
const { Telnet } = require('telnet-client');
const socket = new net.Socket();


const moment = require('moment');

//const HOST = 'core.ziot.vn';
//const PORT = 5003; // Telnet port number

//Send Line
// get accessToken and channelSecret from LINE developers website
const client = LineClient.connect({
  accessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET, 
});

setInterval(async function(){
  checkMongoDb()
}, 5*60*1000);

checkMongoDb()

async function checkMongoDb() {
  socket.connect(process.env.PORT, process.env.HOST, () => {
    //console.log(`Connected to ${HOST}:${PORT}`);
    // process.stdin.on('data', (data) => {
    //   socket.write(data);
    // });
  });
}

socket.on('data', (data) => {
  //process.stdout.write(data);
});

socket.on('close', () => {
  //console.log('Connection closed');
});

socket.on('error', () => {
  console.log("U Error");
  socket.destroy();

  let strData="Server MongoDb down - " + process.env.HOST + " " + process.env.PORT +   " " +  moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + '\n'

  client.push(process.env.CHANEL_ID, [
    {
      type: 'text',
      text: strData,
    },
  ]);

} )

socket.on('connect', () => {
  console.log("U Connected");
  socket.end();
} )