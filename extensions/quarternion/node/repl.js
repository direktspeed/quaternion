const net = require('node:net');
const repl = require('node:repl');
const { Duplex } = require('node:stream');
const DataChannel = require('node-datachannel');
let connections = 0;

repl.start({
  prompt: '',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {

}).listen('/tmp/node-repl-sock');

const channel = new nodeDataChannel.PeerConnection("nativMessaging", { iceServers: [
//  "stun:stun.l.google.com:19302"
] });

channel.onLocalDescription((sdp, type) => {
    console.log("SDP:", sdp, " Type:", type);
    //peer1.setRemoteDescription(sdp, type);
});

channel.onLocalCandidate((candidate, mid) => {
    console.log("Candidate:", candidate);
    //peer1.addRemoteCandidate(candidate, mid);
});

channel.onDataChannel((dc) => {
    const supportedChannels = {
      repl(dc) {
        connections += 1;
        const repl = repl.start({
          prompt: '',
        }).on('exit', () => {
          dc?.end(); dc.close();
        });
        dc.onMessage(socket.input.push);
        socket.output.on('data',(data)=>dc.sendMessage(data));    
      }
    }
    supportedChannels[dc.getLabel()]?(dc);
});
