// 搜索今天的邮件
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
    
    console.log('Total:', box.messages.total);
    
    // 获取最后 50 封邮件
    const start = Math.max(1, box.messages.total - 50);
    console.log(`Checking ${start} to ${box.messages.total}...\n`);
    
    const f = imap.seq.fetch(start + ':*', {
      bodies: 'HEADER.FIELDS (SUBJECT FROM DATE TO)'
    });
    
    let count = 0;
    let todayCount = 0;
    const today = new Date();
    
    f.on('message', (msg) => {
      count++;
      let headerData = '';
      
      msg.on('body', (stream) => {
        stream.on('data', (chunk) => {
          headerData += chunk.toString('utf8');
        });
        stream.on('end', () => {
          const subject = headerData.match(/Subject: (.*)/);
          const from = headerData.match(/From: (.*)/);
          const to = headerData.match(/To: (.*)/);
          const date = headerData.match(/Date: (.*)/);
          
          if (date) {
            const emailDate = new Date(date[1]);
            if (emailDate.toDateString() === today.toDateString()) {
              todayCount++;
              console.log(`--- Email ${todayCount} ---`);
              console.log('Subject:', subject ? subject[1] : '');
              console.log('From:', from ? from[1] : '');
              console.log('To:', to ? to[1] : '');
              console.log('Date:', date[1]);
              console.log('');
            }
          }
        });
      });
    });
    
    f.on('end', () => {
      console.log(`\nProcessed ${count} emails, found ${todayCount} from today`);
      imap.end();
    });
  });
});

imap.on('error', (err) => {
  console.log('Error:', err.message);
});

imap.connect();