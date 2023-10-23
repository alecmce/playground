import { Brush, DrawingApi, Fill } from 'src/model/drawing'
import { Point } from 'src/model/geometry'

export enum HANDS {
  RIGHT = 'right',
  LEFT = 'left',
  BOTH = 'both'
}

interface DrawHandsProps {
  brush:     Brush
  fill:      Fill
  hands:     HANDS
  position:  Point
  radius:    number
  rotations: [left: number, right: number]
}

interface DrawHands {
  (props: DrawHandsProps): void
}

const BACKGROUND = new Path2D('M1868.84,1101.38C1856.28,1114.87 1845.12,1122.83 1835.38,1127.08C1802.49,1141.42 1785.77,1113.51 1786,1113.54C1765.35,1128.82 1736.78,1137.7 1700.73,1115.84C1661.17,1091.86 1685.58,1076.32 1636.47,1060.47C1613.83,1053.16 1568.08,1048.82 1531.54,1026.61C1492.23,1002.72 1470.38,979.616 1486.63,948.153C1498.88,924.458 1537.25,924.789 1563.24,946.917C1581.68,962.623 1594.54,962.774 1604.49,951.097C1617.99,935.244 1600.33,925.953 1582.42,913.769C1549,891.027 1511.83,868.393 1533.05,827.288C1556.36,782.109 1604.91,810.019 1629.88,854.526C1641.18,874.672 1667.67,894.236 1677.3,879.841C1686.99,865.361 1666.59,858.641 1644.7,815.331C1628.76,783.785 1639.21,739.102 1674.77,730.545C1719.92,719.679 1734.4,801.704 1748.59,829.79C1782.05,895.979 1792.6,890.871 1816.35,855.529C1845.06,812.811 1912.96,789.12 1934.78,832.299C1960.05,882.304 1926.14,879.641 1895.94,913.486C1867.07,945.837 1904.17,963.47 1882.98,999.179C1882.67,1000.43 1911.55,1020.03 1898.35,1057.85C1893.98,1070.37 1885.01,1084.88 1868.84,1101.38')
const OUTLINE_1 = new Path2D('M1886.05,1005.58C1902.87,1017.32 1905.62,1025.14 1906.42,1040.92C1907.19,1055.99 1890.54,1081.46 1881.12,1096.41C1872.25,1110.47 1849.42,1131.51 1833.59,1135.89C1812.82,1141.64 1796.92,1136.18 1785.75,1114.07')
const OUTLINE_2 = new Path2D('M1873.45,1011.94C1865.45,1029.49 1838.72,1072.56 1786,1113.54C1765.72,1129.3 1736.78,1137.7 1700.73,1115.84C1661.17,1091.86 1685.58,1076.32 1636.47,1060.47C1613.83,1053.16 1568.08,1048.82 1531.54,1026.61C1492.23,1002.72 1470.38,979.616 1486.63,948.153C1498.88,924.458 1537.25,924.789 1563.24,946.917C1581.68,962.623 1594.54,962.774 1604.49,951.097C1617.99,935.244 1600.33,925.953 1582.42,913.769C1549,891.027 1511.83,868.393 1533.05,827.288C1556.36,782.109 1604.91,810.019 1629.88,854.526C1641.18,874.672 1667.67,894.236 1677.3,879.841C1686.99,865.361 1666.59,858.641 1644.7,815.331C1628.76,783.785 1639.21,739.102 1674.77,730.545C1719.92,719.679 1734.4,801.704 1748.59,829.79C1782.05,895.979 1792.6,890.871 1816.35,855.529C1845.06,812.811 1912.96,789.12 1934.78,832.299C1960.05,882.304 1926.14,879.641 1895.94,913.486C1863.83,949.47 1903.4,953.04 1873.45,1011.94')
const SCALAR = 10

export function makeDrawHands(props: DrawingApi): DrawHands {
  const { context, applyFill, applyBrush } = props

  return function drawHands(props: DrawHandsProps): void {
    const { brush, fill, position: { x, y }, rotations: [left, right], radius } = props
    const scaledBrush = { ...brush, width: brush.width * SCALAR }

    context.save()
    applyRightTransform()
    applyFill({ fill, draw: BACKGROUND })
    applyBrush({ brush: scaledBrush, draw: OUTLINE_1 })
    applyBrush({ brush: scaledBrush, draw: OUTLINE_2 })
    applyLeftTransform()
    applyFill({ fill, draw: BACKGROUND })
    applyBrush({ brush: scaledBrush, draw: OUTLINE_1 })
    applyBrush({ brush: scaledBrush, draw: OUTLINE_2 })
    context.restore()

    function applyRightTransform(): void {
      context.resetTransform()
      context.translate(x, y)
      context.rotate(right)
      context.translate(radius, -17.5)
      context.transform(-0.0794201, -0.0362209, -0.0362209, 0.0794201, 190.573, 6.34785)
    }

    function applyLeftTransform(): void {
      context.resetTransform()
      context.translate(x, y)
      context.rotate(left)
      context.translate(-radius, -17.5)
      context.transform(-1, 0, 0, 1, 0, 0)
      context.transform(-0.0794201, -0.0362209, -0.0362209, 0.0794201, 190.573, 6.34785)
    }
  }
}
