import { DrawEyes, DrawIcon, DrawIconProps, DrawPath, DrawPolygon } from 'src/model/drawing'
import { isDefined } from 'src/util/object-util'


interface Props {
  drawEyes:    DrawEyes
  drawPath:    DrawPath
  drawPolygon: DrawPolygon
}

// 0 0 64 80
const BLOB = new Path2D('M49.97,25.18c5.23-1.28,9.36-2.29,8.53-8.19-1.35631-6.46239-10.97732-3.434-14.00989.62988-2.46761,3.0084-5.60735,2.66382-3.18009-1.06979C44.92,11.06,44.21,6.96,42.5,5.12c-3.02957-2.81418-8.81576-.09947-8.17983,4.51006A18.26817,18.26817,0,0,1,32.45,19.14a1.5646,1.5646,0,0,1-1.73,1.05C29.78,19.96,29.27,18.65,29.4,16.77c.31995-4.96-1.13-6.69-1.79-7.22a5.33074,5.33074,0,0,0-5.29-2.4c-5.63978,1.01413-9.83994,8.33514-3.96017,13.59C24.65,26.23,23.71,28.64,23.67,28.74c-.26711.42213.02437.64172-.68,1.21a3.02789,3.02789,0,0,1-2.32.08995c-3.69946-1.04273-6.2461-.082-10.01,1.00005-5.69008,1.6585-7.46461,11.99574-1.62973,15.01991C13.25,48.48,15.81,44.3,17.67,41.25c.81-1.32,1.91-3.12,2.56-3.15,2.42463.00479,2.80165,2.94668,2.07006,4.97992C22.06,43.73,21.66,44,20.86,44.49c-1.52.94-3.6,2.22-4.58,7.8-.85881,5.53871,1.53287,7.55975,5.25983,7.71014A8.55685,8.55685,0,0,0,25.9,58.81c2.62-1.71,2.66-9.15,2.44-13.43.00844-.91085,1.63174-1.25572,1.92-1.08-1.38842,3.89384-.20052,6.60314,3.15012,10.13A6.71655,6.71655,0,0,0,42.29,55.77c1.39-.85,1.24-2.86,1.06-5.4.01361-1.54413-.80969-5.87664,1.06983-6.38007A4.25331,4.25331,0,0,1,47.58,44.86c.11912,2.39827-.87249,5.5748,3.57,7.37008a3.50861,3.50861,0,0,0,4.7-2.2601c1.2-2.91.35-7.31-2.54-8.62-2.827-1.39519-3.93383-2.15781-2.87006-3.67994,1.23048-.90249,4.35949.24155,5.46-1.36018A2.6025,2.6025,0,0,0,56.22,34.05C55.10069,29.96892,50.9468,30.93483,48.19,30.5A2.4973,2.4973,0,0,1,46.91,28.19C46.89,26.74,47.98,25.67,49.97,25.18Z')

export function makeDrawIcon(props: Props): DrawIcon {
  const { drawPath, drawPolygon, drawEyes } = props

  return function drawCreatureIcon(props: DrawIconProps): void {
    const { alpha, brush, center, color, eyes, eyesScale, pointer, scale, sides } = props

    const fill = isDefined(color) ? { alpha, color } : undefined

    if (isDefined(sides)) {
      drawPolygon({ brush, fill, center, polygon: sides, scale })
    } else if (isDefined(color)) {
      drawPath({ brush, center: { x: center.x - 36, y: center.y - 36 }, fill, path: BLOB })
    }

    if (isDefined(eyes)) {
      drawEyes({ brush, center, eyes, pointer, scale: eyesScale })
    }
  }
}