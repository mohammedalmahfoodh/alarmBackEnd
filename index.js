const mySqlConnection = require("./connection");
const WebSocket = require("ws");
const wsAlarmList = new WebSocket("ws://192.168.190.232:8089");
const wsTankList = new WebSocket("ws://192.168.190.232:8089");
const wsTankLiveData = new WebSocket("ws://127.0.0.1:8089");
const wsSetAlarmAccept = new WebSocket("ws://192.168.190.232:8089");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
let listOfTanksCode = [];
let listOfTanksData =[];
let tanksObject ={tanksName:[],tanksId:[]};
let tanksLiveData ={setTankSubscriptionData:[]};
let alarmListText = [];
let alarmDate;

///************************************************** Websockets ********************************************************** */
 /* wsAlarmList.onopen = function(evt) {
  console.log("Connection established.");
  setInterval(function() {
    var msg = { getAlarmList: {} };
  //  wsSend(msg);
  }, 6000);
};

wsAlarmList.onmessage = function(evt) {
  var received_msg = evt.data;
  let alarmList = JSON.parse(received_msg);


  if (
    typeof alarmList.setAlarmList === "string" ||
    alarmList.setAlarmList instanceof String
  ) {
    alarmListText = alarmList.setAlarmList.split(",");
    alarmDateDate = new Date();
    let stralarmDate = alarmDateDate.toISOString();
    let dayDateStr = stralarmDate.slice(0, 10);
    let timeDateStr = stralarmDate.slice(11, 19);
    let completeDate = dayDateStr + " " + timeDateStr;
    alarmDate = completeDate;
    console.log(alarmListText);
    console.log(alarmDate);
  }
};
function wsSend(smsg) {
  //var smsg = {"msg":"to server"};
  var msgJson = JSON.stringify(smsg);
  // console.log("Sending: " + msgJson);
  wsAlarmList.send(msgJson);
}*/
//****************************** Set alarm accept******************************** */

  /* wsSetAlarmAccept.onopen = function(evt) {
  console.log("Connection established Accept alarmlist.");
  setInterval(function() {
    
    var msg = {setAlarmAccept:{tankId:1}};
   // wsSendAlarmAccept(msg);
  }, 1000);
};

wsSetAlarmAccept.onmessage = function(evt) {
  var received_msg = evt.data;
  console.log(received_msg)
  let alarmListAccept = JSON.parse(received_msg);
  console.log(alarmListAccept)
 if (  typeof alarmList.setAlarmList === "string" ||  alarmList.setAlarmList instanceof String  ) {
    alarmListText = alarmList.setAlarmList.split(",");   
    console.log(alarmListText);
    console.log(alarmDate);
  }
};
function wsSendAlarmAccept(smsg) {
  //var smsg = {"msg":"to server"};
  var msgJson = JSON.stringify(smsg);
  // console.log("Sending: " + msgJson);
  wsSetAlarmAccept.send(msgJson);
}*/



//****************** Get Tanks Code  **************************************** *//

wsTankList.onopen = function(evt) {
  console.log("Connection Tanks established.");  
    var msg = { getKslTankData: { vessel: 1 } };   
   let inte= setInterval(function(){
        wsTSend(msg); 
    }, 200);
   setTimeout(() => {
    clearInterval(inte);
    console.log('fetching tanks names done..')
   
   }, 3000);   
   
};

wsTankList.onmessage = function(evt) {
  var received_msg = evt.data;
  
  let kslTankData = JSON.parse(received_msg);
  //console.log(kslTankData)
  let arrayOfTanks = kslTankData.setKslTankData
  if (  typeof arrayOfTanks === "array" ||    arrayOfTanks instanceof Array  ) {     
       listOfTanksCode= arrayOfTanks.map(element => element.TankCode);
       tanksObject.tanksName=listOfTanksCode;
    //   console.log(tanksObject.tanksName); 
      } 
};

wsTankList.onclose = function(){    
   
    console.log("Tanks name and Id Websocket is closed.....");				  
};
 
function wsTSend(smsg) {
  //var smsg = {"msg":"to server"};
  var msgJson = JSON.stringify(smsg);
  // console.log("Sending: " + msgJson);
  wsTankList.send(msgJson);     
  
}
/////************************* Get Tanks live data ********************** */

wsTankLiveData.onopen = function(evt) {
  console.log("Connection Live Tanks data established.");  
    var msg = {"setTankSubscriptionOn":{"tankId":0}};   
   // var msg2 = {setAlarmAccept:{tankId:1}};
   // wsSendAlarmAccept(msg2)
   let inte= setInterval(function(){
        wsTankLiveDataSend(msg); 
    }, 10000);
   setTimeout(() => {   
    console.log('fetching tanks live data...')   
   }, 2000);   
   
};
wsTankLiveData.onmessage = function(evt) {
  var received_msg = evt.data;  
   tanksLiveData = JSON.parse(received_msg);
    //console.log(tanksLiveData)
   listOfTanksData = tanksLiveData.setTankSubscriptionData; 
  if (  typeof listOfTanksData === "array" ||    listOfTanksData instanceof Array  ) {    
   /* let listOftanksId = listOfTanksData.map(element => element.tankId);
      tanksObject.tanksId=listOftanksId; */
     
      
      listOfTanksData.forEach((tankInfo)=>{
        
        let tankId =tankInfo.tankId;
       // console.log(tankId)
      
        
        let tankLevel =tankInfo.level;
        let  tankVolume = tankInfo.volume;
        let levelAlarm = tankInfo.levelAlarm;        
        let acknowledged;
        let description ;
        let alarmName ;
        let tankCode =tanksObject.tanksName[tankId-1];
        if(levelAlarm %2 == 1){
         acknowledged =false;
        }else{
          acknowledged = true;
        }
        switch (levelAlarm) {
          case 17:
            alarmName =tankCode+'LevelAlarm'+'HH';
           description = 'Hight Hight Alarm detected.';
            break;
          case 9:
              alarmName =tankCode+'LevelAlarm'+'H';
              description = 'Hight Alarm detected.';
            break;
          case 5:
              alarmName =tankCode+'LevelAlarm'+'L';
              description = 'Low Alarm detected.';
            break;
          case 3:
              alarmName =tankCode+'LevelAlarm'+'LL';
              description = 'Low Low Alarm detected.';
            break;
          default:
            alarmName ='noAlarm'
              description = 'No Alarm detected.';
        } 
        console.log('Alarm Name:'+alarmName+' tankId: '+tankId+' Acknowledged: '+acknowledged+'Description:'+description+' levelAlarm'+levelAlarm)
        /*  mySqlConnection.query(`SELECT * FROM tanks where tank_id =${tankId}`, function (err, result, fields) {
          if (err) throw err;
          tankCode = result[0].code_name
          console.log(result[0].code_name);
        });*/
      })
     


 
  }
};
wsTankLiveData.onclose = function(){  
   
  console.log("Tanks live data Websocket is closed.....");				  
};

function wsTankLiveDataSend(smsg) {
//var smsg = {"msg":"to server"};
var msgJson = JSON.stringify(smsg);
wsTankLiveData.send(msgJson);   
}

wsTankLiveData.onclose = function(){    
  var smsg = {"setTankSubscriptionOff":{"tankId":0}};
   wsTankLiveData.send(smsg);
  console.log("Tanks live data Websocket is closed.....");			
  	 
};
 













///******************************************* Apis ****************************************************************************** */
const routes = require("./routes");
app.use("/api/levelMaster", routes);
function insertDataintoDB() {
  setInterval(() => {
    mySqlConnection.query(
      "INSERT INTO tasks (title, priority,status) VALUES ('Retrief data from dataBase', 8,1)",
      (err, result, fields) => {
        console.log(result);
      }
    );
  }, 2000);
}

//getDatFromDB();

app.listen(3000, () => console.log(`Example app listening on port ${3000}!`));



////*** Functin to insert tanks names and ids data into mysql dabase */
/*function insertTanksIdNameIntoDB() {
  mySqlConnection.connect(() => {
    tanksObject.tanksName.forEach(tankName => {
      mySqlConnection.query(`INSERT INTO tanks (code_name) VALUES ('${tankName}')`, function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
      });
    });

  })
}
setTimeout(function () {
  console.log('chekikdsjflksjlfkjslfkjslkfjslkjf')
  insertTanksIdNameIntoDB();
}, 5000);*/