const {app, BrowserWindow} = require('electron');
const path = require('path');
const io = require('socket.io')();
const mqtt = require('mqtt');

const mqtt_Topic = 'test';                  // MQTT topic
const mqtt_Server = 'mqtt://127.0.0.1';     // MQTT broker IP address
const mqtt_Port = 1883;                     // MQTT broker port
const deviceName = 'SmartMirror01';         // Client name

process.env.SOCKET_PORT = 18092;

let mainWindow;

function createWindow () {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1368,
    height: 768,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Load HTML page
  mainWindow.loadFile('index.html');

  // DevTools
  //mainWindow.webContents.openDevTools();

  // Maximise the window
  mainWindow.maximize(); 
}

app.on('ready', createWindow)

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})

app.on('activate', function () {
  if (mainWindow === null) createWindow();
})

// MQTT connection
var client  = mqtt.connect(`${mqtt_Server}/${mqtt_Port}`, {clientId: deviceName, protocolId: 'MQIsdp', protocolVersion: 3, connectTimeout: 2000, debug: true});

// Connect to MQTT Server/Broker
client.on('connect', function () {

  // Subscribe to the topic
  client.subscribe(mqtt_Topic, function (err) {
    if (!err) {
      // Publish to topic on connection
      client.publish(mqtt_Topic, `${deviceName} has connected`)
      console.log(`Connected to MQTT server @ ${mqtt_Server} on port: ${mqtt_Port}`)
    }
  })
})

// On client connection to socket io server
io.on('connection', socket => {

  //console.log('Front end connected');

  // On receiving MQTT message
  client.on('message', (topic, message) => {

    // Check if the topic matches
    if(topic == mqtt_Topic) {

      // Check the message
      // "start-game"
      if(message == 'start-game'){
        socket.emit('start-game', '');
      }
      // "pause-game"
      else if(message == 'pause-game'){
        socket.emit('pause-game', '');
      }
      // "reset-game"
      else if(message == 'reset-game'){
        socket.emit('reset-game', '');
      }
      // If isnt the above it will be taken as the hint "message"
      else{
        socket.emit('message', message.toString());
      }
    }
  });
})

io.listen(18092);