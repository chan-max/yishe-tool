/*
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-13 10:41:47
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-13 11:24:09
 * @FilePath: /yishe/server/query/user.js
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */


/*
    获取两个用户间的关系
    myself
    friend
    myfollower
    myfollowing
    stranger
*/
export async function getRelationship(t_follower, mainUserId, userId) {
    if (mainUserId == userId) {
        return 'myself'
    }

    let followed = await t_follower.findOne({
        where: {
            user_id: mainUserId,
            follower_id: userId
        }
    })

    let following = await t_follower.findOne({
        where: {
            user_id: userId,
            follower_id: mainUserId
        }
    })

    if(followed && following){
        return 'friend'
    }

    if(!followed && !following){
        return 'stranger'
    }
    
    if(followed && !following){
        return 'follower'
    }

    if(!followed && following){
        return 'following'
    }
}