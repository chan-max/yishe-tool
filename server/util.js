
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

// 暂停
export function sleep(s){
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve()
    }, s * 1000);
  })
}

// 格式化文件路径
export function formatFilePath(path) {
  const formattedPath = path.replace(/([^:]\/)\/+/g, '$1');
  return formattedPath;
}
  