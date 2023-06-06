import {PartnersUtils} from "./libs/shopify/partners-utils.ts"
import {ShopifyHandleStores} from "./libs/shopify/handle/stores.ts";

const partnersUtils = new PartnersUtils(
  // @ts-ignore
  document.querySelector(`meta[name="csrf-token"]`).getAttribute('content'),

  // @ts-ignore
  window.RailsData.current_organization.id,
)

window.addEventListener('load', () => {
  // TODO 判断路由加载
  ShopifyHandleStores(partnersUtils)
})