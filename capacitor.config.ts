/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-31 10:37:57
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-31 13:47:15
 * @FilePath: /1s/capacitor.config.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'design.1s',
  appName: '衣设',
  webDir: 'app',
  server: {
    androidScheme: 'https'
  }
};

export default config;
