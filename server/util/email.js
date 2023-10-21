import nodemailer from 'nodemailer'

// 创建可重用的邮件传输器
const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  auth: {
    user: 'yishe1s@163.com',
    pass: 'IRNAIJUOISGECLKU'
  }
});

// 邮件发送函数
export function sendEmail(options) {
  // 邮件配置
  const mailOptions = {
    from: 'yishe1s@163.com',
    to: options.email,
    subject: '衣设账号注册验证码 ',
    text: 'This is a test email from Nodemailer'
  };

  // 发送邮件
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred while sending email:', error.message);
    } else {
      console.log('Email sent successfully!');
    }
  });
}

