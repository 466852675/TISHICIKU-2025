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

const keywords = ['AI', '人工智能', '大赛', '比赛', '竞赛', '挑战', '大模型', 'GPT', 'ChatGPT', 'LLM'];

imap.on('ready', () => {
  imap.openBox('INBOX', false, (err, box) => {
    if (err) {
      console.log('Error:', err.message);
      return imap.end();
    }
    
    const total = box.messages.total;
    console.log(`搜索 ${total} 封邮件中的 AI 大赛相关内容...\n`);
    
    // Search for emails with these keywords in subject
    imap.search(['ALL'], (err, results) => {
      if (err) {
        console.log('Search error:', err.message);
        return imap.end();
      }
      
      // Get last 100 emails
      const recent = results.slice(-100);
      console.log(`Checking ${recent.length} recent emails...\n`);
      
      let found = [];
      let checked = 0;
      
      const f = imap.fetch(recent, { 
        bodies: 'HEADER.FIELDS (SUBJECT FROM DATE)',
        markSeen: false 
      });
      
      f.on('message', (msg) => {
        let headerText = '';
        
        msg.on('body', (stream) => {
          stream.on('data', (chunk) => {
            headerText += chunk.toString('utf8');
          });
          stream.on('end', () => {
            const subjectMatch = headerText.match(/Subject: (.*)/i);
            const fromMatch = headerText.match(/From: (.*)/i);
            const dateMatch = headerText.match(/Date: (.*)/i);
            
            const subject = subjectMatch ? subjectMatch[1] : '';
            const from = fromMatch ? fromMatch[1] : '';
            const date = dateMatch ? dateMatch[1] : '';
            
            // Check if subject contains keywords
            const lowerSubject = subject.toLowerCase();
            if (keywords.some(k => lowerSubject.includes(k.toLowerCase()))) {
              found.push({ subject, from, date });
            }
            
            checked++;
            if (checked >= recent.length) {
              displayResults();
            }
          });
        });
      });
      
      f.on('end', () => {
        if (checked < recent.length) {
          displayResults();
        }
      });
      
      function displayResults() {
        console.log(`\n✅ 找到 ${found.length} 封相关邮件:\n`);
        
        if (found.length === 0) {
          console.log('最近 100 封邮件中没有找到 AI 大赛相关内容');
          console.log('\n最近收到的邮件主题:');
        }
        
        found.slice(0, 10).forEach((email, i) => {
          console.log(`${i+1}. ${email.subject}`);
          console.log(`   From: ${email.from}`);
          console.log(`   Date: ${email.date}`);
          console.log('');
        });
        
        imap.end();
      }
    });
  });
});

imap.on('error', (err) => {
  console.log('IMAP Error:', err.message);
});

imap.connect();