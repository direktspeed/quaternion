const net = require('node:net');
const repl = require('node:repl');
const { Readable, Writable } = require('node:stream');
const DataChannel = require('node-datachannel');
let connections = 0;

repl.start({
  prompt: '',
  input: process.stdin,
  output: process.stdout,
});

const channel = new nodeDataChannel.PeerConnection("nativMessaging", { iceServers: [
  //  "stun:stun.l.google.com:19302"
] });

useGlobal

channel.onLocalDescription((sdp, type) => {
    console.log("SDP:", sdp, " Type:", type);
    //peer1.setRemoteDescription(sdp, type);
});

channel.onLocalCandidate((candidate, mid) => {
    //console.log("Candidate:", candidate);
    //peer1.addRemoteCandidate(candidate, mid);
});

channel.onDataChannel((dc) => {
    const supportedChannels = {
      repl(dc) {
        connections += 1;
        const repl = repl.start({
          prompt: '', useGlobal: true,
          input: Readable.fromWeb(new ReadableStream({ 
            start(c){ dc.onMessage((data)=>c.enqueue(data)); }
          })),
          output: Writable.fromWeb(new WritableStream({ 
            write(output){ dc.sendMessage(output) }
          })),
        }).on('exit', () => {
          dc?.end(); dc.close();
        });
      }
    }
    supportedChannels[dc.getLabel()]?(dc);
});
