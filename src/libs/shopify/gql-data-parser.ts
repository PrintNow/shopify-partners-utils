import { get } from "lodash-es"
import { AppsInfoType, RenderAppListReturnType } from "./gql-data-parser.type.ts"

export function RenderAppList(data: AppsInfoType): RenderAppListReturnType[] {
  if (!data.hasApps) {
    console.warn('暂无 App，不继续执行')
    return []
  }

  /** @type {{cursor: string, node: {id: number, title: string}}[]} */
  const appEdges = get(data, 'apps.edges');
  const initData: RenderAppListReturnType[] = []

  return appEdges
      .reduce((previousValue, currentValue) => {
        const { id, title, currentInstalls } = currentValue.node
        previousValue.push({ id, title, currentInstalls })

        return previousValue
      }, initData)

      // 根据安装次数降序排序
      .sort((a, b) => {
        if (b.currentInstalls > a.currentInstalls) {
          return 1
        }

        if (b.currentInstalls < a.currentInstalls) {
          return -1
        }

        return 0
      })
}
