// UDP Node.js dependency
const dgram = require('dgram');

// moment
const moment = require('moment');

// tcp
const net = require('net');

// protocol for auditor
const protocol = require('./auditor-protocol');

// datagram socket
const socket = dgram.createSocket('udp4');

// list of musicians
let musicians = new Map();

// tcp server creation
const tcpServer = net.createServer();

// listen for connection requests
tcpServer.listen(protocol.PROTOCOL_PORT, () => {
  console.log(`listening on port ${protocol.PROTOCOL_PORT}`);
});

// do that on connection
tcpServer.on('connection', (tcpSocket) => {
  const payload = [];

  musicians.forEach((value, key) => {
    if (moment.duration(moment().diff(moment(value[1]))).seconds() >= 5) {
      musicians.delete(key);
    } else {
      payload.push({ uuid: key, instrument: value[0], activeSince: value[1] });
    }
  });

  tcpSocket.write(JSON.stringify(payload));

  // close connection
  tcpSocket.destroy();
});

// listen to musicians on multicast address
socket.bind(protocol.PROTOCOL_PORT, () => {
  socket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

socket.on('message', (msg, rinfo) => {
  const jsonMessage = JSON.parse(msg);
  const activeSince = moment().toISOString();
  musicians.set(jsonMessage.uuid, [jsonMessage.instrument, activeSince]);
  console.log(musicians);
});
