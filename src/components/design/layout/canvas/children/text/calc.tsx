

export function getEllipsePos(angleDegree, a, b) {
    // 将角度转换为弧度，并调整方向（顺时针到逆时针）
    // const angleRad = ((90 - angleDegree) * Math.PI) / 180;
    const angleRad = 2 * Math.PI / 360 * angleDegree


    // 计算椭圆上的点坐标
    const x = a * Math.cos(angleRad);
    const y = b * Math.sin(angleRad);

    console.log(x, y);

    // 返回计算得到的坐标
    return { x, y };
}



/*
    计算椭圆上的点与其近焦点生成的角度
*/
function calculateAngleToFocus(a, b, x, y) {
    // 计算焦距
    const c = Math.sqrt(a * a - b * b);

    // 焦点位置
    const focus1 = { x: c, y: 0 };
    const focus2 = { x: -c, y: 0 };

    // 计算给定点到两个焦点的距离
    const distToFocus1 = Math.sqrt((x - focus1.x) ** 2 + (y - focus1.y) ** 2);
    const distToFocus2 = Math.sqrt((x - focus2.x) ** 2 + (y - focus2.y) ** 2);

    // 确定近焦点
    const nearFocus = distToFocus1 < distToFocus2 ? focus1 : focus2;

    // 计算从点到近焦点的向量
    const vectorX = nearFocus.x - x;
    const vectorY = nearFocus.y - y;

    // 计算角度（以y轴正方向为0度，顺时针）
    let angle = Math.atan2(vectorX, -vectorY);

    // 将角度转换为度数，并调整到0-360度范围
    angle = (angle * 180 / Math.PI + 360) % 360;

    return angle;
}


export function findEllipseDistancePoint(a, b, x1, y1, d) {
    
}


/*
   圆形路径位置
*/

export function findRoundDistancePoint(r, x1, y1, d) {

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