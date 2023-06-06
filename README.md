# Preview

```js
const baseURL = `https://shine.asia.spin.dev`

// const viteClient = document.createElement('script')
// viteClient.type = 'module'
// viteClient.src = `${baseURL}/@vite/client`
// document.head.appendChild(viteClient)

const viteMain = document.createElement('script')
viteMain.type = 'module'
viteMain.src = `${baseURL}/src/main.ts?t=${new Date().getTime()}`
document.head.appendChild(viteMain)

```
