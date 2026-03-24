const Imap = require('imap');

const imap = new Imap({
  user: 'yuhang@longshine.com',
  password: 'I2e5NA8sVoHNusap',
  host: 'imap.qiye.aliyun.com',
  port: 993,
  tls: true
});

imap.once('ready', () => {
  imap.openBox('INBOX', true, (err, box) => {
    if (err) {
      console.error('Error:', err);
      process.exit(1);
    }
    
    const since = new Date();
    since.setHours(since.getHours() - 12);
    const dateStr = since.toISOString().split('T')[0];
    
    imap.search([['SINCE', dateStr]], (err, results) => {
      if (err || !results || results.length === 0) {
        console.log('No emails');
        imap.end();
        return;
      }
      
      const fetch = imap.fetch(results, {
        bodies: ['HEADER', 'TEXT'],
        markSeen: false
      });
      
      const emails = [];
      
      fetch.on('message', (msg) => {
        let email = { headers: '', text: '' };
        
        msg.on('body', (stream, info) => {
          let buffer = '';
          stream.on('data', (chunk) => buffer += chunk.toString('utf8'));
          stream.on('end', () => {
            if (info.which === 'HEADER') {
              const parsed = Imap.parseHeader(buffer);
              email.from = (parsed.from || []).join(' ').replace(/</g, '(').replace(/>/g, ')');
              email.subject = (parsed.subject || []).join(' ');
              email.date = (parsed.date || []).join(' ');
            } else {
              email.text = buffer.substring(0, 200).replace(/\s+/g, ' ');
            }
          });
        });
        
        msg.on('end', () => {
          if (email.subject) {
            emails.push(email);
          }
        });
      });
      
      fetch.once('end', () => {
        emails.forEach((e, i) => {
          console.log('===MAIL===');
          console.log('SUBJ:' + e.subject);
          console.log('FROM:' + e.from);
          console.log('DATE:' + e.date);
          console.log('TEXT:' + e.text);
        });
        imap.end();
      });
    });
  });
});

imap.connect();