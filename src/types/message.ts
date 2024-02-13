/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-06 19:33:52
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-13 23:50:27
 * @FilePath: /yishe/src/types/message.ts
 * @Description: 在此记录所有的消息类型
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */

/*
    所有会发送的消息类型
*/

export enum MessageType {
    // 给模型点赞
    LIKE_AVAILABLE_MODE = 'likeAvailableModel',

    // 给模型评论
    COMMENT_AVAILABLE_MODEL = 'commentAvailableModel',

    // 给模型评论点赞
    LIKE_AVAILABLE_MODEL_COMMENT = 'likeAvailableModelComment',

    // 被关注
    FOLLOWED = 'followed',

    //被取消关注
    UNFOLLOWED = 'unfollowed',

    // 被分享模型
    SHARE_AVAILABLE_MODEL = 'shareAvailableModel',

    // 被分享img
    SHARE_IMAGE = 'shareImage',

    MESSAGE = '发送普通消息'
}