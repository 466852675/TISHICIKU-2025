// 搜索今天发送的邮件
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
  // 打开已发送邮箱
  imap.openBox('已发送', false, (err, box) => {
    if (err) {
      console.log('Error:', err.message);
      return imap.end();
    }
    
    console.log('Total sent emails:', box.messages.total);
    console.log('Searching for today\'s emails...\n');
    
    const today = new Date();
    const todayStr = today.toDateString();
    
    const f = imap.seq.fetch('1:*', {
      bodies: 'HEADER.FIELDS (SUBJECT TO DATE FROM)'
    });
    
    let found = [];
    
    f.on('message', (msg) => {
      let headerData = '';
      
      msg.on('body', (stream) => {
        stream.on('data', (chunk) => {
          headerData += chunk.toString('utf8');
        });
        stream.on('end', () => {
          const subject = headerData.match(/Subject: (.*)/);
          const to = headerData.match(/To: (.*)/);
          const from = headerData.match(/From: (.*)/);
          const date = headerData.match(/Date: (.*)/);
          
          if (date) {
            const dateStr = date[1];
            const emailDate = new Date(dateStr);
            
            // 检查是否是今天的邮件
            if (emailDate.toDateString() === todayStr) {
              found.push({
                subject: subject ? subject[1] : 'N/A',
                to: to ? to[1] : 'N/A',
                from: from ? from[1] : 'N/A',
                date: dateStr
              });
            }
          }
        });
      });
    });
    
    f.on('end', () => {
      console.log(`\n✅ 今天发送了 ${found.length} 封邮件:\n`);
      
      if (found.length === 0) {
        console.log('今天还没有发送邮件');
      } else {
        found.forEach((email, i) => {
          console.log(`--- 邮件 ${i+1} ---`);
          console.log('主题:', email.subject);
          console.log('收件人:', email.to);
          console.log('发件人:', email.from);
          console.log('时间:', email.date);
          console.log('');
        });
      }
      
      imap.end();
    });
  });
});

imap.on('error', (err) => {
  console.log('IMAP Error:', err.message);
});

imap.connect();