import{f as u,k as b,c as m,a as e,F as w,b as x,t as o,o as f,n as v}from"./index-swU1CFca.js";const g={class:"space-y-8"},y={class:"rounded-2xl border ui-border-strong ui-surface p-6"},h={class:"mt-4 flex flex-wrap gap-2"},k=["onClick"],A={class:"mt-4 rounded-xl border ui-border-strong bg-black/92 p-4"},C={class:"mb-2 flex items-center justify-between gap-3"},_={class:"overflow-x-auto text-sm text-white"},I={class:"rounded-2xl border ui-border-strong ui-surface p-6"},$={class:"mt-4 rounded-xl border ui-border-strong bg-black/92 p-4"},S={class:"mb-2 flex items-center justify-between gap-3"},D={class:"overflow-x-auto text-xs text-white"},F={class:"mt-4 rounded-xl border ui-border-strong bg-black/92 p-4"},M={class:"mb-2 flex items-center justify-between gap-3"},V={class:"overflow-x-auto text-xs text-white"},j={class:"rounded-2xl border ui-border-strong ui-surface p-6"},T={class:"mt-4 rounded-xl border ui-border-strong bg-black/92 p-4"},B={class:"mb-2 flex items-center justify-between gap-3"},P={class:"overflow-x-auto text-xs text-white"},i="kabzvue",E={__name:"InstallationPage",setup(z){const l=u("npm"),r=u(""),c={npm:`npm install ${i}`,pnpm:`pnpm add ${i}`,yarn:`yarn add ${i}`,bun:`bun add ${i}`},n={fontAwesomeDependencies:`{
  "@fortawesome/fontawesome-svg-core": "^7.0.1",
  "@fortawesome/free-brands-svg-icons": "^7.0.1",
  "@fortawesome/free-regular-svg-icons": "^7.0.1",
  "@fortawesome/free-solid-svg-icons": "^7.0.1",
  "@fortawesome/vue-fontawesome": "^3.1.2"
}`,fontAwesomeInstall:"npm install @fortawesome/fontawesome-svg-core@^7.0.1 @fortawesome/free-brands-svg-icons@^7.0.1 @fortawesome/free-regular-svg-icons@^7.0.1 @fortawesome/free-solid-svg-icons@^7.0.1 @fortawesome/vue-fontawesome@^3.1.2",fullMainSetup:`import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueUI, { tooltip, initTheme } from '${i}'
// import '${i}/css'
import './styles/style.css'
import VueApexCharts from 'vue3-apexcharts'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas, far, fab)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(VueApexCharts)
app.use(VueUI)
app.directive('tooltip', tooltip)

initTheme()

app.mount('#app')`},d=b(()=>c[l.value]),a=async(p,t)=>{navigator?.clipboard&&(await navigator.clipboard.writeText(t),r.value=p,window.setTimeout(()=>{r.value===p&&(r.value="")},1200))};return(p,t)=>(f(),m("div",g,[e("article",y,[t[5]||(t[5]=e("h1",{class:"text-3xl font-bold"}," Installation ",-1)),t[6]||(t[6]=e("p",{class:"mt-3 text-lg leading-8 ui-text-muted"}," Add package dependencies, then register plugin, icons, and tooltip directive. ",-1)),e("div",h,[(f(),m(w,null,x(["npm","pnpm","yarn","bun"],s=>e("button",{key:s,type:"button",class:v(["rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide",l.value===s?"ui-primary-bg border-(--ui-primary)":"ui-border-strong hover:bg-(--ui-surface-soft)"]),onClick:N=>l.value=s},o(s),11,k)),64))]),e("div",A,[e("div",C,[t[4]||(t[4]=e("p",{class:"text-xs font-semibold uppercase tracking-wide text-white/80"}," Install Command ",-1)),e("button",{type:"button",class:"rounded-md border border-white/30 px-3 py-1 text-xs font-medium text-white hover:bg-white/10",onClick:t[0]||(t[0]=s=>a("install",d.value))},o(r.value==="install"?"Copied":"Copy"),1)]),e("pre",_,[e("code",null,o(d.value),1)])])]),e("article",I,[t[9]||(t[9]=e("h2",{class:"text-2xl font-bold"}," Font Awesome Dependencies ",-1)),e("div",$,[e("div",S,[t[7]||(t[7]=e("p",{class:"text-xs font-semibold uppercase tracking-wide text-white/80"}," Install ",-1)),e("button",{type:"button",class:"rounded-md border border-white/30 px-3 py-1 text-xs font-medium text-white hover:bg-white/10",onClick:t[1]||(t[1]=s=>a("fontAwesomeInstall",n.fontAwesomeInstall))},o(r.value==="fontAwesomeInstall"?"Copied":"Copy"),1)]),e("pre",D,[e("code",null,o(n.fontAwesomeInstall),1)])]),e("div",F,[e("div",M,[t[8]||(t[8]=e("p",{class:"text-xs font-semibold uppercase tracking-wide text-white/80"}," Versions ",-1)),e("button",{type:"button",class:"rounded-md border border-white/30 px-3 py-1 text-xs font-medium text-white hover:bg-white/10",onClick:t[2]||(t[2]=s=>a("fontAwesomeDependencies",n.fontAwesomeDependencies))},o(r.value==="fontAwesomeDependencies"?"Copied":"Copy"),1)]),e("pre",V,[e("code",null,o(n.fontAwesomeDependencies),1)])])]),e("article",j,[t[11]||(t[11]=e("h2",{class:"text-2xl font-bold"}," main.js Setup ",-1)),e("div",T,[e("div",B,[t[10]||(t[10]=e("p",{class:"text-xs font-semibold uppercase tracking-wide text-white/80"}," Full setup ",-1)),e("button",{type:"button",class:"rounded-md border border-white/30 px-3 py-1 text-xs font-medium text-white hover:bg-white/10",onClick:t[3]||(t[3]=s=>a("fullMainSetup",n.fullMainSetup))},o(r.value==="fullMainSetup"?"Copied":"Copy"),1)]),e("pre",P,[e("code",null,o(n.fullMainSetup),1)])])])]))}};export{E as default};
