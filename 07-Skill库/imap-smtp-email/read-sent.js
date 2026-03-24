// 读取已发送邮箱的邮件
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

imap.on('ready', () => {
  imap.openBox('已发送', false, (err, box) => {
    if (err) {
      console.log('Error:', err.message);
      return imap.end();
    }
    
    const total = box.messages.total;
    console.log(`Total sent: ${total}\n`);
    
    // 获取最后 10 封
    const start = Math.max(1, total - 9);
    console.log(`Fetching ${start} to ${total}...\n`);
    
    const f = imap.seq.fetch(start + ':' + total, {
      bodies: '',
      struct: true
    });
    
    let count = 0;
    
    f.on('message', (msg) => {
      count++;
      console.log(`--- Message ${count} ---`);
      
      msg.on('body', (stream) => {
        simpleParser(stream, (err, parsed) => {
          if (err) {
            console.log('Parse error:', err.message);
          } else {
            console.log('Subject:', parsed.subject);
            console.log('To:', parsed.to?.text);
            console.log('From:', parsed.from?.text);
            console.log('Date:', parsed.date);
            console.log('');
          }
        });
      });
    });
    
    f.on('end', () => {
      console.log(`\nDone. Fetched ${count} messages.`);
      imap.end();
    });
  });
});

imap.on('error', (err) => {
  console.log('Error:', err.message);
});

imap.connect();