import { get } from "lodash-es"
import { RenderAppList } from "./libs/shopify/gql-data-parser.ts"
import { PartnersUtils } from "./libs/shopify/partners-utils.ts"

const partnersUtils = new PartnersUtils(
    // @ts-ignore
    document.querySelector(`meta[name="csrf-token"]`).getAttribute('content'),

    // @ts-ignore
    window.RailsData.current_organization.id,
)


// 请求 Apps 数据
let { data } = await partnersUtils.getAppsInfo()
const appList = RenderAppList(data)

/**
 * 处理选中的安装 App 事件
 */
function handleSelectInstallApp(this: HTMLSelectElement) {
  const [AppID, shopID] = [this.value, this.getAttribute('data-shop-id')]

  partnersUtils.generateSignedInstallUrl(Number(AppID), Number(shopID)).then(({ data }) => {
    const signedInstallUrl = get(data, 'generateSignedInstallUrl.signedInstallUrl')
    if (!signedInstallUrl) {
      alert(JSON.stringify(get(data, 'generateSignedInstallUrl.userErrors')))
      return
    }

    window.open(signedInstallUrl, '_blank')
  })
}

// 渲染到列表上
document.querySelectorAll("a[aria-describedby]").forEach(ele => {
  const shopID = ele.getAttribute('aria-describedby') as string

  const $formEle = ele.parentElement?.querySelector(`form[action$="login_development"]`)

  const $selectElement = document.createElement('select')
  $selectElement.setAttribute('data-shop-id', shopID)
  $selectElement.style.width = `90px`

  let firstHitOption = document.createElement('option')
  firstHitOption.innerText = "Install App"
  firstHitOption.selected = true
  $selectElement.add(firstHitOption)

  appList.forEach(item => {
    let htmlOptionElement = document.createElement('option')
    htmlOptionElement.value = item.id
    htmlOptionElement.innerText = item.title
    $selectElement.add(htmlOptionElement)
  })

  $selectElement.addEventListener('change', handleSelectInstallApp)

  // 插入 select
  $formEle?.parentNode?.appendChild($selectElement)
})
