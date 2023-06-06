import {get, isNull} from "lodash-es";
import {PartnersUtils} from "../partners-utils";
import {RenderAppList} from "../gql-data-parser";
import {RenderAppListReturnType} from "../gql-data-parser.type.ts";

export function ShopifyHandleStores(partnersUtils: PartnersUtils) {
  // 请求 Apps 数据
  partnersUtils.getAppsInfo().then(({data}) => {
    const appList = RenderAppList(data);

    renderToAppList(appList)
    renderOperation()
  })

  /**
   * 处理选中的安装 App 事件
   */
  function handleSelectInstallApp(this: HTMLSelectElement) {
    const [AppID, shopID] = [this.value, this.getAttribute('data-shop-id')]

    if (isNull(AppID) || !AppID) {
      console.warn('AppID 为空，停止运行')
      return
    }

    this.value = ""

    partnersUtils.generateSignedInstallUrl(Number(AppID), Number(shopID)).then(({data}) => {
      const signedInstallUrl = get(data, 'generateSignedInstallUrl.signedInstallUrl')
      if (!signedInstallUrl) {
        alert(JSON.stringify(get(data, 'generateSignedInstallUrl.userErrors')))
        return
      }

      window.open(signedInstallUrl, '_blank')
    })
  }

  function renderToAppList(appList: RenderAppListReturnType[]) {
    // 渲染到列表上
    document.querySelectorAll("a[aria-describedby]").forEach(ele => {
      const shopID = ele.getAttribute('aria-describedby') as string

      const $formEle = ele.parentElement?.querySelector(`form[action$="login_development"]`)

      const $selectElement = document.createElement('select')
      $selectElement.setAttribute('data-shop-id', shopID)
      $selectElement.style.width = `90px`
      $selectElement.style.height = `30px`
      $selectElement.style.cursor = `pointer`

      let firstHitOption = document.createElement('option')
      firstHitOption.innerText = "Install App"
      firstHitOption.value = ""
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
  }

  function createStore() {
    const subDomain = window.prompt('Please input subdomain. (e.g: my-test-store)')

    if (subDomain === '' || !subDomain) {
      console.warn('创建的店铺名字为空')
      return
    }

    alert(`正在创建 ${subDomain}.myshopify.com 店铺，点击“OK”按钮后稍等 10s 左右，请勿刷新、离开本页面！`)

    partnersUtils.createNewStore(subDomain, subDomain).then(({data}) => {
      const redirectUrl = get(data, 'shopCreate.redirectUrl')

      if (!redirectUrl || redirectUrl === '') {
        console.warn('创建店铺失败', data)
        alert('创建店铺失败')
        return
      }

      window.open(redirectUrl, '_blank')
      alert(`店铺 ${subDomain}.myshopify.com 创建成功！`)
    })
  }

  function renderOperation() {
    const $headerOperation = document.querySelector(`.Polaris-Page-Header__Row .Polaris-Page-Header__TitleWrapper`)

    if ($headerOperation === null) {
      console.warn('元素 [.Polaris-Page-Header__TitleWrapper] 查找失败')
      return
    }

    const $titleEle = $headerOperation.querySelector(`h1.Polaris-Header-Title`);

    if ($titleEle !== null) {
      // @ts-ignore
      $titleEle.style.display = 'inline-block'
      // @ts-ignore
      $titleEle.style.marginRight = `8px`
    }

    const $operationButton = document.createElement('div');
    $operationButton.style.display = 'inline-block'

    $operationButton.innerHTML = `
      <div class="Polaris-ButtonGroup Polaris-ButtonGroup--segmented" data-buttongroup-segmented="true">
          <div class="Polaris-ButtonGroup__Item">
              <button data-rerender class="Polaris-Button Polaris-Button--sizeSlim" type="button" title="Re-render App install list (can not refresh app data)">
                  <span class="Polaris-Button__Content">
                    <svg viewBox="0 0 20 20" class="Icon_Icon__Dm3QW" style="width: 20px; height: 20px;"><path d="M5 17a2 2 0 0 1-2-2v-4h6v6h-4Zm6 0v-6h6v4a2 2 0 0 1-2 2h-4Zm-8-12v4h6v-6h-4a2 2 0 0 0-2 2Zm8 1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"></path></svg>
                  </span>
              </button>
          </div>
      
          <div class="Polaris-ButtonGroup__Item">
              <button data-1click-create-store class="Polaris-Button Polaris-Button--sizeSlim" type="button" title="1-click create store">
                  <span class="Polaris-Button__Content">
                    <svg viewBox="0 0 20 20" class="Icon_Icon__Dm3QW" style="width: 20px; height: 20px;"><path d="m1.623 2.253-.609 3.583c-.104.61.376 1.164 1.007 1.164h.91c.58 0 1.11-.321 1.37-.83l.596-1.17.597 1.17c.26.509.79.83 1.37.83h1.169c.58 0 1.11-.321 1.369-.83l.598-1.17.597 1.17c.26.509.79.83 1.37.83h1.169c.58 0 1.11-.321 1.369-.83l.597-1.17.598 1.17c.259.509.789.83 1.369.83h.91c.63 0 1.11-.555 1.007-1.164l-.61-3.583a1.522 1.522 0 0 0-1.509-1.253h-13.733c-.748 0-1.387.53-1.51 1.253zm12.084 7.04a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414l1.293 1.293 3.293-3.293a1 1 0 0 1 1.414 0zm-9.707-.293h-2v8.5a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5v-8.5h-2v8h-12v-8z"></path></svg>
                  </span>
              </button>
          </div>
      </div>
    `

    $headerOperation.appendChild($operationButton)
    // @ts-ignore
    $headerOperation.querySelector('button[data-rerender]')?.addEventListener('click', renderToAppList)
    $headerOperation.querySelector('button[data-1click-create-store]')?.addEventListener('click', createStore)
  }
}