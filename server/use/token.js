import jwt from "jsonwebtoken";

const token = jwt.sign({ account: '666', exp: Date.now() + 60 * 60 }, '666');
console.log(token);
let res = jwt.verify(token, '666', { complete: true })
console.log(res);



export const 