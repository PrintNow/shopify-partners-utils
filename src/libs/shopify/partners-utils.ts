class PartnersUtils {
  /** @type {string} */
  CSRFToken

  /** @type {number} */
  organizationID

  constructor(CSRFToken: string, organizationID: string) {
    this.CSRFToken = CSRFToken
    this.organizationID = organizationID
  }

  get baseGQLURL() {
    return `https://partners.shopify.com/${ this.organizationID }/api/graphql`
  }

  /**
   * 封装 fetch 请求
   *
   * @param {{}} bodyObject
   * @return {Promise<Response>}
   */
  baseFetch(bodyObject: object) {
    return fetch(this.baseGQLURL, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        "x-csrf-token": this.CSRFToken
      },
      body: JSON.stringify(bodyObject)
    }).then(respond => respond.json())
  }

  /**
   * 创建新的店铺
   *
   * @param {string} subdomain 店铺域名
   * @param {string|null} storeName 店铺名
   * @return {Promise<Response>}
   */
  createNewStore(subdomain: string, storeName: string | null = null) {
    return this.baseFetch({
      operationName: "ShopCreateMutation",
      variables: {
        input: {
          storeType: "PARTNER_TEST_STORE",
          developerPreviewHandle: null,
          storeName: storeName ?? `Store name - ${ new Date().getTime() }`,
          address: {
            countryCode: "CN"
          },
          subdomain: subdomain,
          signupSourceDetails: "build_store_for_client",
          dataGenerationType: "STATIC_DATA"
        }
      },
      query: `mutation ShopCreateMutation($input: ShopCreateInput!) {
        shopCreate(input: $input) {
          redirectUrl
          userErrors {
            field
            message
            __typename
          }
          __typename
        }
      }`
    })
  }

  /**
   * 生成安装 App 链接
   *
   * @param {number} appId
   * @param {number} shopId
   * @return {Promise<Response>}
   */
  generateSignedInstallUrl(appId: number | string, shopId: number | string) {
    return this.baseFetch({
      operationName: "GenerateSignedInstallUrl",
      variables: {
        input: {
          appId: appId,
          shopId: shopId
        }
      },
      query: `mutation GenerateSignedInstallUrl($input: GenerateSignedInstallUrlInput!) {
        generateSignedInstallUrl(input: $input) {
        signedInstallUrl
        userErrors {
          message
          __typename
        }
        __typename
        }
      }`
    })
  }

  /**
   * 获取 App 列表信息
   */
  getAppsInfo() {
    return this.baseFetch({
      operationName: "AppsInfo",
      variables: {
        canViewFinancials: true,
        searchTerm: "",
        after: "0"
      },
      query: "query AppsInfo($after: String, $before: String, $first: Int, $searchTerm: String, $canViewFinancials: Boolean = false) {\n  apps(\n    after: $after\n    before: $before\n    first: $first\n    searchTerm: $searchTerm\n    includeAppRequiredChanges: true\n  ) {\n    edges {\n      cursor\n      node {\n        id\n        title\n        appType\n        currentState\n        apiHealth {\n          breakingState\n          lastCallAt\n          migrationDeadline\n          __typename\n        }\n        currentInstalls\n        overallRating\n        published\n        developedByPartner\n        totalEarningsAllTime @include(if: $canViewFinancials) {\n          amount\n          currencyCode\n          __typename\n        }\n        webhookMetrics {\n          summary {\n            subscriptionFailurePercentage\n            numberOfRemovedSubscriptions\n            __typename\n          }\n          __typename\n        }\n        appRequiredChanges {\n          fixBy\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n      __typename\n    }\n    __typename\n  }\n  apiSummaries {\n    lastCallAt\n    migrationDeadline\n    breakingState\n    __typename\n  }\n  hasApps\n}\n"
    })
  }
}

export { PartnersUtils }
