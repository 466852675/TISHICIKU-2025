const Imap = require('imap');
const { simpleParser } = require('mailparser');
require('dotenv').config();

const imap = new Imap({
  user: process.env.IMAP_USER,
  password: process.env.IMAP_PASS,
  host: process.env.IMAP_HOST,
  port: parseInt(process.env.IMAP_PORT),
  tls: process.env.IMAP_TLS === 'true'
});

imap.on('ready', function() {
  imap.openBox('INBOX', false, function(err, box) {
    if (err) {
      console.log('Error:', err.message);
      return imap.end();
    }
    const total = box.messages.total;
    console.log('Total:', total);
    
    const seq = total > 20 ? (total - 20 + 1) + ':*' : '1:*';
    const fetch = imap.seq.fetch(seq, {
      bodies: ['HEADER.FIELDS (SUBJECT FROM DATE)', 'TEXT']
    });
    
    let count = 0;
    fetch.on('message', function(msg) {
      let headers = '';
      let subject = '';
      let from = '';
      let date = '';
      
      msg.on('body', function(stream, info) {
        if (info.which === 'HEADER.FIELDS (SUBJECT FROM DATE)') {
          let data = '';
          stream.on('data', function(chunk) {
            data += chunk.toString('utf8');
          });
          stream.on('end', function() {
            const s = data.match(/Subject: (.*)/);
            const f = data.match(/From: (.*)/);
            const d = data.match(/Date: (.*)/);
            if (s) subject = s[1];
            if (f) from = f[1];
            if (d) date = d[1];
          });
        } else if (info.which === 'TEXT') {
          // Skip body for now
        }
      });
      
      msg.on('attributes', function(attrs) {
        // Got attributes
      });
      
      msg.on('end', function() {
        if (subject || from) {
          console.log('---');
          console.log('Subject:', subject);
          console.log('From:', from);
          console.log('Date:', date);
        }
        count++;
        if (count >= 20) imap.end();
      });
    });
    
    fetch.on('end', function() {
      console.log('Done. Processed', count, 'emails');
      setTimeout(() => imap.end(), 1000);
    });
  });
});

imap.on('error', function(err) {
  console.log('Error:', err.message);
});

imap.connect();