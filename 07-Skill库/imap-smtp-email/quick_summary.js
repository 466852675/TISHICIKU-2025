const Imap = require('imap');

const imap = new Imap({
  user: 'yuhang@longshine.com',
  password: 'I2e5NA8sVoHNusap',
  host: 'imap.qiye.aliyun.com',
  port: 993,
  tls: true
});

const emails = [];

imap.once('ready', () => {
  imap.openBox('INBOX', true, (err, box) => {
    if (err) {
      console.error('Error:', err);
      process.exit(1);
    }
    
    // 搜索最近12小时的邮件
    const since = new Date();
    since.setHours(since.getHours() - 12);
    const dateStr = since.toISOString().split('T')[0];
    
    imap.search([['SINCE', dateStr]], (err, results) => {
      if (err || !results || results.length === 0) {
        console.log('未找到最近12小时的邮件');
        imap.end();
        return;
      }
      
      console.log('找到 ' + results.length + ' 封邮件 (自 ' + dateStr + ' 起)\n');
      
      const fetch = imap.fetch(results, {
        bodies: 'HEADER',
        markSeen: false
      });
      
      fetch.on('message', (msg) => {
        let email = {};
        msg.on('body', (stream) => {
          let buffer = '';
          stream.on('data', (chunk) => buffer += chunk.toString('utf8'));
          stream.on('end', () => {
            const parsed = Imap.parseHeader(buffer);
            email.from = (parsed.from || []).join(' ').replace(/</g, '(').replace(/>/g, ')');
            email.subject = (parsed.subject || []).join(' ');
            email.date = (parsed.date || []).join(' ');
          });
        });
        msg.on('end', () => {
          if (email.subject) {
            emails.push(email);
          }
        });
      });
      
      fetch.once('error', (err) => {
        console.error('Fetch error:', err);
      });
      
      fetch.once('end', () => {
        emails.forEach((e, i) => {
          console.log(`${i + 1}. 【${e.subject}】`);
          console.log(`   发件人: ${e.from}`);
          console.log(`   时间: ${e.date}`);
          console.log('');
        });
        imap.end();
      });
    });
  });
});

imap.once('error', (err) => {
  console.error('IMAP Error:', err);
});

imap.connect();