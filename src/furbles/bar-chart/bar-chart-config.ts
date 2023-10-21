import { Assignment } from 'src/model/charts'
import { Categorized, CategoryValues } from 'src/model/creatures'
import { Rectangle, RectanglePlace } from 'src/model/geometry'
import { getLongestCategorySize } from 'src/util/get-longest-category-size'
import { makePlaceAssignmentOptions } from 'src/util/make-place-assignment-options'

interface Props {
  bounds:      Rectangle
  categorized: Categorized<CategoryValues>[]
  horizontal?: boolean
  proportion?: number
}

export interface BarChartConfig {
  categorized: CategorizedBarPlaces[]
  options:     Assignment<RectanglePlace, CategoryValues>[]
  radius:      number
}

export interface CategorizedBarPlaces {
  places:    Rectangle[]
  options:   Assignment<RectanglePlace, CategoryValues>[]
  rectangle: Rectangle
  values:    Partial<CategoryValues>
}

export function makeCategoryBars(props: Props): BarChartConfig {
  const { bounds, categorized, proportion = 0.8 } = props

  const dWidth = Math.abs(bounds.right - bounds.left) / categorized.length
  const padding = (dWidth * (1 - proportion)) / 2
  const dHeight = Math.abs(bounds.bottom - bounds.top) / getLongestCategorySize(categorized)
  const radius = Math.min(dWidth - padding * 2, dHeight) / 2

  const bars = categorized.map(toCategoryBar)
  const options = bars.flatMap(b => b.options)

  return { categorized: bars, options, radius }


  function toCategoryBar(categorized: Categorized<CategoryValues>, i: number): CategorizedBarPlaces {
    const { creatures, values } = categorized
    const { bottom } = bounds

    const height = (dHeight * creatures.length)
    const left = dWidth * i + padding
    const right = dWidth * (i + 1) - padding
    const x = (left + right) / 2
    const places = creatures.map(getPlace)
    const options = makePlaceAssignmentOptions({ creatures, places, categories: values })
    const rectangle = { left, right, top: bottom - height, bottom }

    return { places, values, rectangle, options }

    function getPlace(_: unknown, index: number): RectanglePlace {
      const y = bottom - dHeight * index - dHeight / 2
      return { bottom: y + dHeight / 2, left, right, top: y - dHeight / 2, x, y }
    }
  }
}
