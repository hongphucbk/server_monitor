var Service = require('node-windows').Service;
var EventLogger = require('node-windows').EventLogger;
 
var log = new EventLogger('Industrial IOT Service');

// Create a new service object
var svc = new Service({
  name:'IndustrialIOT',
  description: 'Industrial IOT Service',
  //script: 'E:\\Aucontech\\02. Project\\02. Linde Malaysia\\Project\\GatewayIOT_Demo\\index1.js',
  script: require('path').join(__dirname,'index1.js')
});
 
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
  log.info('Industrial IOT Service is running successfully');
});
 
svc.install();

 
