/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-29 22:40:29
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-29 23:24:32
 * @FilePath: /1s/server/script/ssl.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { createCA, createCert } from "mkcert";




export async function createDevelopmentCert() {
    const ca = await createCA({
        organization: "Hello CA",
        countryCode: "NP",
        state: "Bagmati",
        locality: "Kathmandu",
        validity: 365
    });
 
    const cert = await createCert({
        ca: { key: ca.key, cert: ca.cert },
        domains: ["127.0.0.1", "localhost"],
        validity: 365
    });
    return {
        ca, 
        cert
    }
}