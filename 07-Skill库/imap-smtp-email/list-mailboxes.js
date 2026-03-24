// 列出所有邮箱
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
  imap.getBoxes((err, boxes) => {
    if (err) {
      console.log('Error:', err.message);
      return imap.end();
    }
    
    console.log('Available mailboxes:\n');
    
    Object.keys(boxes).forEach((name) => {
      console.log(`- ${name}`);
    });
    
    console.log('\nNow checking INBOX...');
    
    imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        console.log('INBOX Error:', err.message);
      } else {
        console.log('INBOX Messages:', box.messages.total);
      }
      
      console.log('\nNow checking Sent folder...');
      
      // 尝试不同的已发送文件夹名称
      const sentNames = ['Sent', '已发送', 'INBOX.Sent', '已发送邮件'];
      
      let checked = 0;
      sentNames.forEach((name) => {
        imap.openBox(name, false, (err, box) => {
          checked++;
          if (!err) {
            console.log(`✓ ${name}: ${box.messages.total} messages`);
          } else {
            console.log(`✗ ${name}: ${err.message}`);
          }
          
          if (checked >= sentNames.length) {
            imap.end();
          }
        });
      });
    });
  });
});

imap.on('error', (err) => {
  console.log('Connection Error:', err.message);
});

imap.connect();