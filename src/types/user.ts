/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-13 09:16:08
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-13 13:02:05
 * @FilePath: /yishe/src/types/user.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */


// 定义用户间的关系类型
export enum RelationshipType {
    MYSELF = 'myself', // 我自己
    FOLLOWER = 'follower', // 我的粉丝
    FOLLOWING = 'following', // 我的关注
    FRIEND = 'friend', // 我的朋友
    STRANGER = 'stranger', // 陌生人
}


