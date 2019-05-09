/*
This program simulates a musician with
an assignated instrument
*/

// UDP Node.js dependency
const dgram = require('dgram');

// protocol for musician
const protocol = require('./musician-protocol');

// datagram socket
const socket = dgram.createSocket('udp4');

function Musician(instrument) {
  this.instrument = instrument;

  Musician.prototype.play = function play() {
    const sound = {
      instrument: this.instrument
    };

    const payload = JSON.stringify(sound);
    const message = Buffer.from(payload);

    socket.send(message, 0, message.length, protocol.PROTOCOL_PORT,
      protocol.PROTOCOL_MULTICAST_ADDRESS, (err, bytes) => {
        console.log(`Sending payload: ${payload} via port ${socket.address().port}`);
      });
  };

  // play each 500 ms
  setInterval(this.play.bind(this), 500);
}

// take musician params from command line attributes
const instrument = process.argv[2];

const musician = new Musician(instrument);
