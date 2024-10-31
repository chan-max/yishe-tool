

// 将远程图片地址 转换为去除多余空白边框的本地版本
export async function remoteImageUrlToRemoveTransparentEdgesLocalPreviewUrl(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // 处理跨域问题
        img.src = imageUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 设置canvas大小
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // 去除透明边
            let left = canvas.width, right = 0, top = canvas.height, bottom = 0;
            for (let i = 0; i < data.length; i += 4) {
                const alpha = data[i + 3];
                if (alpha > 0) {
                    const x = (i / 4) % canvas.width;
                    const y = Math.floor((i / 4) / canvas.width);
                    if (x < left) left = x;
                    if (x > right) right = x;
                    if (y < top) top = y;
                    if (y > bottom) bottom = y;
                }
            }

            // 创建新的canvas并绘制去除透明边后的图像
            const newCanvas = document.createElement('canvas');
            newCanvas.width = right - left + 1;
            newCanvas.height = bottom - top + 1;
            const newCtx = newCanvas.getContext('2d');
            newCtx.drawImage(canvas, left, top, newCanvas.width, newCanvas.height, 0, 0, newCanvas.width, newCanvas.height);

            // 返回新的图像URL
            resolve(newCanvas.toDataURL());
        };

        img.onerror = (error) => {
            reject(error);
        };
    });
}
