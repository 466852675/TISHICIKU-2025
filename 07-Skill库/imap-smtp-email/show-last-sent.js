// 显示最近发送的邮件
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
    
    const total = box.messages.total;
    console.log('Total sent:', total);
    
    if (total === 0) {
      console.log('已发送邮箱为空');
      return imap.end();
    }
    
    // 获取最后 10 封
    const fetchSeq = (total >= 10) ? (total-9) + ':*' : '1:*';
    console.log('Fetching:', fetchSeq);
    
    const f = imap.seq.fetch(fetchSeq, {
      bodies: 'HEADER.FIELDS (SUBJECT TO DATE FROM)'
    });
    
    let emails = [];
    
    f.on('message', (msg) => {
      let headers = '';
      
      msg.on('body', (stream) => {
        let buffer = '';
        stream.on('data', (chunk) => {
          buffer += chunk.toString('utf8');
        });
        stream.on('end', () => {
          headers += buffer;
        });
      });
      
      msg.on('end', () => {
        const subject = headers.match(/Subject: (.*)/);
        const to = headers.match(/To: (.*)/);
        const from = headers.match(/From: (.*)/);
        const date = headers.match(/Date: (.*)/);
        
        emails.push({
          subject: subject ? subject[1] : '',
          to: to ? to[1] : '',
          from: from ? from[1] : '',
          date: date ? date[1] : ''
        });
      });
    });
    
    f.on('end', () => {
      console.log('\n📧 最近发送的邮件:\n');
      
      if (emails.length === 0) {
        console.log('没有获取到邮件');
      } else {
        emails.forEach((email, i) => {
          console.log(`${i+1}. ${email.subject}`);
          console.log('   To:', email.to);
          console.log('   Date:', email.date);
          console.log('');
        });
      }
      
      imap.end();
    });
  });
});

imap.on('error', (err) => {
  console.log('Error:', err.message);
});

imap.connect();