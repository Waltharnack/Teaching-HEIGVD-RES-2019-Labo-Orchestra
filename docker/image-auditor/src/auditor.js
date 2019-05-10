// UDP Node.js dependency
const dgram = require('dgram');

// protocol for auditor
const protocol = require('./auditor-protocol');

// datagram socket
const socket = dgram.createSocket('udp4');

socket.bind(protocol.PROTOCOL_PORT, () => {
  socket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

socket.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});
