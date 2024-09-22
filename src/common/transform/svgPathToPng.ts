

export function transformSvgPathToPngDataUrl(svgUrl, width, height) {
    return new Promise((resolve, reject) => {

        const img = new Image();

        img.crossOrigin = '*'

        img.onload = function () {
            // 创建一个 Canvas 元素
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            // 获取 Canvas 的上下文
            const ctx = canvas.getContext('2d');

            // 在 Canvas 上绘制图像
            ctx.drawImage(img, 0, 0, width, height);

            // 将 Canvas 转换为 PNG 数据 URL
            const pngDataUrl = canvas.toDataURL('image/png');

            resolve(pngDataUrl);
        };

        // 处理加载错误
        img.onerror = function () {
            reject(new Error('Failed to load SVG image'));
        };

        img.src = svgUrl;
    });
}

