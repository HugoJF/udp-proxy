const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const GLOBAL_PORT = process.argv[2];
const TARGET_IP = process.argv[3];
const TARGET_PORT = process.argv[4];

console.log(process.argv);

function forward_udp(ip, port, msg, rinfo, callback) {
    console.log('Forwarding UDP called...');
    let forwarder = dgram.createSocket('udp4');

    forwarder.on('error', function (e) {
        console.log('Forwarder got error: ', e);
        forwarder.close();
    });

    forwarder.on('message', function (msg, rinfo) {
        console.log('Forward got response: ', msg);
        callback(msg, rinfo);
        forwarder.close();

    });

    forwarder.bind(port);

    forwarder.send(msg, 0, msg.length, port, ip, function (err, bytes) {
        console.log(`Sending forwarding UDP packet to target ${ip}:${rinfo.port} of ${msg}`);
        if(err) {
            console.log('Forwarder got error while forwarding A2S: ', err);
        }
    })
}

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    console.log(`Got proxy request with message: ${msg}`);

    if(msg.indexOf('Source') !== -1) {
        forward_udp(TARGET_IP, TARGET_PORT, msg, rinfo, function (msg2, rinfo2) {
            console.log(`Got target UDP packet with message, sending back to origin: ${msg}`);
            server.send(msg2, 0, msg2.length, rinfo.port, rinfo.address, function (err, bytes) {
                if (err) {
                    console.log('Server got error on back-sender', err);
                }
            })
        });
    }

    console.log(`Packet was delivered to origin!`);

});

server.on('listening', () => {
    const address = server.address();
    console.log(`Server listening ${address.address}:${address.port}`);
});

server.bind(GLOBAL_PORT);
