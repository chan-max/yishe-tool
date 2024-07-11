

export function getEllipsePos(a, b, angle) {
    // 将角度转换为弧度
    const radians = (90 - angle) * Math.PI / 180;

    // 计算椭圆参数方程的 t
    const t = Math.atan2(a * Math.sin(radians), b * Math.cos(radians));

    // 计算椭圆上点的坐标
    const x = a * Math.cos(t);
    const y = b * Math.sin(t);

    return { x, y };
}


/*
 椭圆弧长计算太过复杂，使用直线距离代替
*/
export function findEllipseDistancePoint(a, b, x1, y1, d, isClockwise = true) {
    // 计算椭圆上给定点的参数 t
    let t = Math.atan2(y1 / b, x1 / a);
    if (t < 0) t += 2 * Math.PI;  // 确保 t 在 [0, 2π) 范围内

    const direction = isClockwise ? -1 : 1;
    const steps = 100;  // 迭代步数
    const stepSize = d / steps;

    for (let i = 0; i < steps; i++) {
        // 计算当前点的坐标
        const x = a * Math.cos(t);
        const y = b * Math.sin(t);

        // 计算椭圆在当前点的切线方向
        const dx = -a * Math.sin(t);
        const dy = b * Math.cos(t);

        // 计算单位切向量
        const length = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / length;
        const uy = dy / length;

        // 沿切线方向移动一小步
        const nextX = x + direction * stepSize * ux;
        const nextY = y + direction * stepSize * uy;

        // 将新点投影回椭圆上
        t = Math.atan2(nextY / b, nextX / a);
        if (t < 0) t += 2 * Math.PI;
    }

    // 计算最终点的坐标
    const x2 = a * Math.cos(t);
    const y2 = b * Math.sin(t);

    // 计算从椭圆中心到点的角度（弧度）
    let angleFromCenter = Math.atan2(y2, x2);

    // 将角度转换为度数，并调整为从y轴正方向开始的顺时针角度
    let rotationAngle = (90 - angleFromCenter * 180 / Math.PI + 360) % 360;

    // 计算文字的旋转角度，使底部指向椭圆中心
    let textRotation = rotationAngle;

    return { x: x2, y: y2, deg: textRotation };
}

/*
   圆形路径位置
*/

export function findRoundDistancePoint(r, x1, y1, d, isClockwise = true) {

    d = isClockwise ? d : -d
    // 计算起始点的角度（以y轴为0度，顺时针方向）
    let startAngle = (Math.atan2(x1, y1) * 180 / Math.PI + 360) % 360;

    // 计算圆心角（弧度）
    let centralAngle = (d / r) * (180 / Math.PI);

    // 计算新点的角度
    let newAngle = (startAngle + centralAngle) % 360;

    // 将角度转换为弧度
    let newAngleRad = newAngle * (Math.PI / 180);

    // 计算新点的坐标
    let x2 = r * Math.sin(newAngleRad);
    let y2 = r * Math.cos(newAngleRad);

    return {
        x: x2,
        y: y2,
        deg: newAngle
    };
}


// 根据角度获取坐标点 , 支持圆和椭圆
export function getRoundPos(r, deg) {
    // 将角度转换为弧度
    const radian = 2 * Math.PI / 360 * deg

    let x = r * Math.sin(radian);
    let y = r * Math.cos(radian);

    return { x: x, y: y, deg };
}