/*
This program simulates a musician with
an assignated instrument
*/

// UDP Node.js dependency
const dgram = require('dgram');

// uuid
const uuid = require('uuid');

// protocol for musician
const protocol = require('./musician-protocol');

// datagram socket
const socket = dgram.createSocket('udp4');

// define instruments and their sound
const INSTRUMENTS = Object.freeze({
  piano: 'ti-ta-ti',
  trumpet: 'pouet',
  flute: 'trulu',
  violin: 'gzi-gzi',
  drum: 'boum-boum',
});

function Musician(instrument) {
  this.instrument = instrument;
  this.uuid = uuid.v4();

  Musician.prototype.play = function play() {
    const sound = {
      uuid: this.uuid,
      instrument: this.instrument,
      sound: INSTRUMENTS[instrument],
    };

    const payload = JSON.stringify(sound);
    const message = Buffer.from(payload);

    socket.send(message, 0, message.length, protocol.PROTOCOL_PORT,
      protocol.PROTOCOL_MULTICAST_ADDRESS, (err, bytes) => {
        console.log(`Sending payload: ${payload} via port ${socket.address().port}`);
      });
  };

  // play every second
  setInterval(this.play.bind(this), 1000);
}

// take musician params from command line attributes
const instrument = process.argv[2];

// check that the instrument exists
if (INSTRUMENTS[instrument] != null) {
  const musician = new Musician(instrument);
}
