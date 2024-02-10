/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-06 19:33:52
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-10 10:13:08
 * @FilePath: /1s/src/types/message.ts
 * @Description: 在此记录所有的消息类型
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

/*
    所有会发送的消息类型
*/

export enum MessageType {
    // 给模型点赞
    AVAILABLE_MODE_LIKE = 'availableModelLike',

    // 给模型评论
    AVAILABLE_MODEL_COMMENT = 'availableModelComment',

    // 给模型评论点赞
    AVAILABLE_MODEL_LIKE_COMMENT = 'availableModelLikeComment',

    // 被关注
    FOLLOWED = 'followed',

    //被取消关注
    UNFOLLOWED = 'unfollowed',

    // 被分享模型
    SHARED = 'shared',
}