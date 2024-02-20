/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-31 10:37:57
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-11 11:48:26
 * @FilePath: /yishe/capacitor.config.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'design.yishe',
  appName: '衣设',
  webDir: 'app',
  server: {
    androidScheme: 'https'
  }
};

export default config;
