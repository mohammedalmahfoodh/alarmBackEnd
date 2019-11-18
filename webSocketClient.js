const WebSocket = require("ws");
const wsAlarmList = new WebSocket("ws://127.0.0.1:8089");
let listOfAlarmsObject = {};

let listText;
let listOfAlarms = { dateOfAlarms: "", alarms: [] };

wsAlarmList.onopen = function (evt) {
  console.log("Connection established.");
  setInterval(function () {
    var msg = { getAlarmList: {} };
    wsSend(msg);
  }, 3000);
};

wsAlarmList.onmessage = function (evt) {
  var received_msg = evt.data;
  let alarmList = JSON.parse(received_msg);
  listText = JSON.stringify(alarmList.setAlarmList);
  if (typeof listText === "string" || listText instanceof String) {
    console.log(listText.split(","));
    listOfAlarms.alarms = listText.split(",")
  }
  console.log(listText);  

  
  listOfAlarms.dateOfAlarms = new Date();

  console.log(listOfAlarms.dateOfAlarms);
};

function wsSend(smsg) {
  //var smsg = {"msg":"to server"};
  var msgJson = JSON.stringify(smsg);
  // console.log("Sending: " + msgJson);

  wsAlarmList.send(msgJson);
}

app.listen(3001, () => console.log(`Example app listening on port ${3001}!`));
