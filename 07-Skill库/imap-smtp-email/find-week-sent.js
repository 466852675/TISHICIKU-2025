// 搜索最近 7 天发送的邮件
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
  imap.openBox('已发送', false, (err, box) => {
    if (err) {
      console.log('Error:', err.message);
      return imap.end();
    }
    
    console.log('Total sent emails:', box.messages.total);
    console.log('Searching for emails sent in last 7 days...\n');
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
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
            const emailDate = new Date(date[1]);
            
            if (emailDate >= weekAgo && emailDate <= now) {
              found.push({
                subject: subject ? subject[1] : 'N/A',
                to: to ? to[1] : 'N/A',
                from: from ? from[1] : 'N/A',
                date: date[1],
                emailDate: emailDate
              });
            }
          }
        });
      });
    });
    
    f.on('end', () => {
      console.log(`\n✅ 最近 7 天发送了 ${found.length} 封邮件:\n`);
      
      if (found.length === 0) {
        console.log('最近 7 天没有发送邮件');
      } else {
        // 按时间倒序排序
        found.sort((a, b) => b.emailDate - a.emailDate);
        
        found.slice(0, 10).forEach((email, i) => {
          console.log(`--- 邮件 ${i+1} ---`);
          console.log('主题:', email.subject);
          console.log('收件人:', email.to);
          console.log('发件人:', email.from);
          console.log('时间:', email.date);
          console.log('');
        });
        
        if (found.length > 10) {
          console.log(`... 还有 ${found.length - 10} 封邮件`);
        }
      }
      
      imap.end();
    });
  });
});

imap.on('error', (err) => {
  console.log('IMAP Error:', err.message);
});

imap.connect();