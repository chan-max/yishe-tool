
// 生成随机六位验证码

export function generateVerificationCode() {
    const codeLength = 6;
    let code = '';
  
    for (let i = 0; i < codeLength; i++) {
      const digit = Math.floor(Math.random() * 10);
      code += digit.toString();
    }
    return code;
  }
  