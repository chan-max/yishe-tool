export const availableModelController = ({ router, app, sequelize, redis }) => {
  /* 获取所有可用于购买的模型*/
  router.post("/getAvailableModel", async (ctx) => {


    let table = sequelize.models.t_available_model

    ctx.body = {
      data: info,
    };
  });

    

};
