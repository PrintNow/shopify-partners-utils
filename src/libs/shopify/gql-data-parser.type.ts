export  type AppsInfoType = {
  hasApps: boolean
  apps: {
    edges: {
      cursor: string
      node: {
        id: string
        title: string
        appType: string
        currentInstalls: number
        developedByPartner: boolean
      }
    }[]
  }
}

export  type RenderAppListReturnType = {
  id: string
  title: string
  currentInstalls: number
}
