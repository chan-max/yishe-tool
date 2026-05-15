export function getEllipsePos(a, b, angle) {
  const radians = ((90 - angle) * Math.PI) / 180;
  const t = Math.atan2(a * Math.sin(radians), b * Math.cos(radians));
  const x = a * Math.cos(t);
  const y = b * Math.sin(t);
  return { x, y };
}

/**
 * @method 计算椭圆切线的角度值
 */
function calculateTangentAngle(a, b, x1, y1) {
  const epsilon = 1e-9;

  if (Math.abs(y1) < epsilon) {
    return x1 > 0 ? 0 : 180;
  }

  if (Math.abs(x1) < epsilon) {
    return y1 > 0 ? 90 : 270;
  }

  let k_normal = (a * a * y1) / (b * b * x1);
  let angleNormal = Math.atan2(k_normal, 1);
  let angleFromYAxis = (90 - angleNormal * (180 / Math.PI) + 360) % 360;

  if (x1 < 0) {
    angleFromYAxis += 180;
  }

  return angleFromYAxis;
}

/**
 * @method 计算椭圆上点的角度值
 */

function calculatePositionAngle(a, b, x1, y1) {
  let angleFromCenter = Math.atan2(y1, x1);
  let rotationAngle = (90 - (angleFromCenter * 180) / Math.PI + 360) % 360;
  return rotationAngle;
}

/**
 * 椭圆上沿弧长移动到目标点
 * 使用迭代逼近法：沿切线方向小步移动，然后投影回椭圆
 */
export function findEllipseDistancePoint(
  a,
  b,
  x1,
  y1,
  d,
  isClockwise = true,
  isPointingToCenter = false,
) {
  let t = Math.atan2(y1 / b, x1 / a);
  if (t < 0) t += 2 * Math.PI;

  const direction = isClockwise ? -1 : 1;

  // 根据距离和椭圆周长自适应步数
  const approxPerimeter =
    Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
  const steps = Math.max(
    20,
    Math.min(200, Math.round((Math.abs(d) / approxPerimeter) * 400)),
  );
  const stepSize = d / steps;

  for (let i = 0; i < steps; i++) {
    const x = a * Math.cos(t);
    const y = b * Math.sin(t);

    const dx = -a * Math.sin(t);
    const dy = b * Math.cos(t);

    const length = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / length;
    const uy = dy / length;

    const nextX = x + direction * stepSize * ux;
    const nextY = y + direction * stepSize * uy;

    t = Math.atan2(nextY / b, nextX / a);
    if (t < 0) t += 2 * Math.PI;
  }

  const x2 = a * Math.cos(t);
  const y2 = b * Math.sin(t);

  let angleFromCutAngle = calculateTangentAngle(a, b, x2, y2);
  let angleFromPosition = calculatePositionAngle(a, b, x2, y2);

  let textRotation = isPointingToCenter ? angleFromPosition : angleFromCutAngle;

  return { x: x2, y: y2, deg: textRotation };
}

/**
 * 圆形路径位置
 * 根据起始点、半径和弧长，计算圆上目标点的坐标和角度
 */

export function findRoundDistancePoint(r, x1, y1, d, isClockwise = true) {
  d = isClockwise ? d : -d;
  let startAngle = ((Math.atan2(x1, y1) * 180) / Math.PI + 360) % 360;

  let centralAngle = (d / r) * (180 / Math.PI);

  let newAngle = (((startAngle + centralAngle) % 360) + 360) % 360;

  let newAngleRad = newAngle * (Math.PI / 180);

  let x2 = r * Math.sin(newAngleRad);
  let y2 = r * Math.cos(newAngleRad);

  return {
    x: x2,
    y: y2,
    deg: newAngle,
  };
}

// 根据角度获取坐标点 , 支持圆和椭圆
export function getRoundPos(r, deg) {
  const radian = ((2 * Math.PI) / 360) * deg;

  let x = r * Math.sin(radian);
  let y = r * Math.cos(radian);

  return { x: x, y: y, deg };
}
