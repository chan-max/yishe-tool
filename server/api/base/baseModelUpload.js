
export const baseModelUploadHook = (router,sequelize) => router.post('/baseModelUpload' ,async (ctx) => {
    const file = ctx.request.files.file;

    const table = sequelize.models.base_models

    debugger
    
    await table.create({ name:'',description:'', filePath: file.filepath });

    ctx.body = { 
        message: 'File uploaded successfully' 
    };
})

