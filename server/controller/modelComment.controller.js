
export const modelCommentController = ({ router, app, sequelize, redis }) => {
  /* 给评论点赞 */
    router.post("/likeModelComment", async (ctx) => {

    var payload = ctx.verifyToken()

    await sequelize.models.t_model_comment.increment('like_count', { by: 1, where: { id: ctx.request.body.commentId }})
        
    ctx.body = {
        type:'success'
    }
  });
};
