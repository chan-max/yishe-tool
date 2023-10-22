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
export function sendValidateCodeEmail(options) {
  // 邮件配置
  const mailOptions = {
    from: 'yishe1s@163.com',
    to: options.email,
    subject: '衣设账号注册认证',
    text: `你的验证码为${options.validateCode}，有效期为十分钟`
  };
  
  return new Promise((resolve,reject) => {
  // 发送邮件
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error.message)
      } else {
        resolve()
      }
    });
  })
}

