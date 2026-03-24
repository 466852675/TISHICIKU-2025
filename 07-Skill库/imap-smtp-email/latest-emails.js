// 读取最近50封邮件
const Imap = require('imap');
require('dotenv').config();

const imap = new Imap({
  user: process.env.IMAP_USER,
  password: process.env.IMAP_PASS,
  host: process.env.IMAP_HOST,
  port: parseInt(process.env.IMAP_PORT),
  tls: process.env.IMAP_TLS === 'true'
});

imap.on('ready', () => {
  imap.openBox('INBOX', false, (err, box) => {
    if (err) {
      console.log('Error:', err.message);
      return imap.end();
    }
    
    const total = box.messages.total;
    const start = Math.max(1, total - 50);
    console.log(`Total: ${total}, fetching from ${start}...\n`);
    
    // Use UIDs instead
    imap.fetch(start + ':*', { 
      uidv: false,
      bodies: 'HEADER.FIELDS (SUBJECT FROM DATE)',
      markSeen: false
    }, (err, messages) => {
      if (err) {
        console.log('Fetch error:', err.message);
        return imap.end();
      }
      
      let count = 0;
      messages.on('message', (msg) => {
        let headerData = '';
        
        msg.on('body', (stream) => {
          let buffer = '';
          stream.on('data', (chunk) => {
            buffer += chunk.toString();
          });
          stream.on('end', () => {
            headerData += buffer;
          });
        });
        
        msg.on('end', () => {
          const subject = headerData.match(/Subject: (.*)/);
          const from = headerData.match(/From: (.*)/);
          const date = headerData.match(/Date: (.*)/);
          
          count++;
          console.log(`--- Email ${count} ---`);
          console.log('Subject:', subject ? subject[1] : 'N/A');
          console.log('From:', from ? from[1] : 'N/A');
          console.log('Date:', date ? date[1] : 'N/A');
          console.log('');
        });
      });
      
      messages.on('error', (err) => {
        console.log('Message error:', err.message);
      });
      
      messages.on('end', () => {
        console.log(`\nTotal displayed: ${count}`);
        imap.end();
      });
    });
  });
});

imap.on('error', (err) => {
  console.log('Error:', err.message);
});

imap.connect();