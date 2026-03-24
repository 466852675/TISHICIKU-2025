// 读取最近30封邮件并搜索AI大赛相关
const Imap = require('imap');
require('dotenv').config();

const keywords = ['ai', '大赛', '比赛', '人工智能', '智能', '创新', '挑战', '竞赛', 'chatgpt', 'gpt', '大模型', '模型', '算法'];

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
    
    console.log('Total emails:', box.messages.total);
    console.log('Searching for AI/大赛 related emails...\n');
    
    const fetch = imap.seq.fetch('1:*', {
      bodies: 'HEADER.FIELDS (SUBJECT FROM DATE)',
      maxParallel: 10
    });
    
    let found = [];
    let processed = 0;
    let total = 0;
    
    fetch.on('message', (msg) => {
      let headerData = '';
      total++;
      
      msg.on('body', (stream) => {
        stream.on('data', (chunk) => {
          headerData += chunk.toString();
        });
        stream.on('end', () => {
          const subject = headerData.match(/Subject: (.*)/);
          const from = headerData.match(/From: (.*)/);
          const date = headerData.match(/Date: (.*)/);
          
          const s = subject ? subject[1].toLowerCase() : '';
          
          if (keywords.some(k => s.includes(k))) {
            found.push({
              subject: subject ? subject[1] : 'N/A',
              from: from ? from[1] : 'N/A',
              date: date ? date[1] : 'N/A'
            });
          }
          
          processed++;
          if (processed >= box.messages.total) {
            console.log(`\nProcessed ${processed} emails, found ${found.length} matches:\n`);
            found.slice(0, 20).forEach((email, i) => {
              console.log(`--- Email ${i+1} ---`);
              console.log('Subject:', email.subject);
              console.log('From:', email.from);
              console.log('Date:', email.date);
              console.log('');
            });
            imap.end();
          }
        });
      });
    });
    
    fetch.on('error', (err) => {
      console.log('Fetch error:', err.message);
    });
    
    fetch.on('end', () => {
      if (processed < box.messages.total) {
        console.log(`\nProcessed ${processed} emails, found ${found.length} matches:\n`);
        found.slice(0, 20).forEach((email, i) => {
          console.log(`--- Email ${i+1} ---`);
          console.log('Subject:', email.subject);
          console.log('From:', email.from);
          console.log('Date:', email.date);
          console.log('');
        });
        imap.end();
      }
    });
  });
});

imap.on('error', (err) => {
  console.log('Error:', err.message);
});

imap.connect();