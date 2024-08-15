

// 处理用户信息
export function formatUserInfo(ctx, userInfo) {
    userInfo.setDataValue(
        "avatar",
        ctx.relativePathToPreviewPath(userInfo.avatar)
    );

    userInfo.setDataValue(
        "password",
        ''
    );
}