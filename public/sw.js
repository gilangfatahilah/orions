if(!self.define){let s,e={};const a=(a,i)=>(a=new URL(a+".js",i).href,e[a]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=a,s.onload=e,document.head.appendChild(s)}else s=a,importScripts(a),e()})).then((()=>{let s=e[a];if(!s)throw new Error(`Module ${a} didn’t register its module`);return s})));self.define=(i,c)=>{const n=s||("document"in self?document.currentScript.src:"")||location.href;if(e[n])return;let t={};const r=s=>a(s,n),o={module:{uri:n},exports:t,require:r};e[n]=Promise.all(i.map((s=>o[s]||r(s)))).then((s=>(c(...s),t)))}}define(["./workbox-e9849328"],(function(s){"use strict";importScripts(),self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"8b9992dd9824834be1e724c607434ceb"},{url:"/_next/static/Z22Jw1VpEC_zsv3ib8vc8/_buildManifest.js",revision:"de438d7e3c74195ad5e78aec38be9fc5"},{url:"/_next/static/Z22Jw1VpEC_zsv3ib8vc8/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1361-3b1378a9139444c9.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/147b5626-b0d946746f455bb7.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/148-a16ea8559fbc6e74.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/1652a8c9.14c44d9b4879a5d5.js",revision:"14c44d9b4879a5d5"},{url:"/_next/static/chunks/220-f990476aef28186b.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/2430-909bea8e459f9b8f.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/2476-0d33a8b414942f9e.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/2532-3d08c02568789557.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/262-1134d0eba04faec1.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/3042-d0906d172975607b.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/3050.61522eaeebec2e3a.js",revision:"61522eaeebec2e3a"},{url:"/_next/static/chunks/3117-02cc9a62d590269c.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/3134-5e13db5f2408c7e1.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/3954-ce44e4fd258d7c11.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/4490-4056fe312e1f94c8.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/488-da5da0d4eacb91b9.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/5178-ec10a55c027a85d0.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/5191-d394029db6348469.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/5353-a13f791b7d1596dc.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/5696-33ea7fe7faaec85c.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/5749-c5970412f7a67eb8.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/6217-e88e877d442c2ece.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/6738.8b4705f2a618fddc.js",revision:"8b4705f2a618fddc"},{url:"/_next/static/chunks/6744-5a543abe8e36079e.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/7140-e153c6b92d7a8267.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/7184.3bc81af3de69bc38.js",revision:"3bc81af3de69bc38"},{url:"/_next/static/chunks/7269-7d9842796c007036.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/72fb73c1-9a9ddde7d1ffffba.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/74-72d0a6bb38206a0d.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/75-ad395c751ff64375.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/76-28238cbeae63957d.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/821-e4bb94f5393bfae5.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/8233-d283fa2eaba1404e.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/8347-8e06888815d38a80.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/84fbfe7f-4388d085f9fa11d2.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/8808-00ccc99a163e788f.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/8858-87cada49e50a2284.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/9187-ac63c335f0368a4e.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/9670-47f421d8afb391e7.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/9763-4f86bae0f8639829.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/a54823bb-63cefd3c91ba167e.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/aabac777-c8200fec90f1d89a.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(auth)/(signin)/page-3f6dd63ea0b78712.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/category/%5Bid%5D/page-287a87dead91c583.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/category/create/page-cbf14e02fbc26293.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/category/page-5a71fc416ebc4993.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/item/%5Bid%5D/page-478b49703ba95c76.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/item/create/page-ab89a736aca10cfa.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/item/page-9846d9e96cac0ef5.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/kanban/page-72fd532c0b906f3d.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/layout-1ee3531354c706a2.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/outlet/%5Bid%5D/page-367640a7268b74be.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/outlet/create/page-fcfe85b45bf19917.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/outlet/page-7429cd7bd7d8ed08.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/page-7874b8bab1a2e32d.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/report/page-32d95e89330c4c1e.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/setting/page-ae938bff69f26fd4.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/stock/page-84e2e3f56c0f88fa.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/supplier/%5Bid%5D/page-e11e08bd04b2f30c.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/supplier/create/page-5d1cd32d1f01ff50.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/supplier/page-e006c1e5df8b3a76.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/transaction/page-cbff42a2c2f92944.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/user/%5Bid%5D/page-a9d2f8f1f53faa01.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/user/create/page-6962338f0f376179.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/user/page-efdc1701add5e5dc.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/_not-found/page-f9c7bf0989f578dd.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/layout-ab3c12c232ce577f.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/not-found-aa0b5cdb190d6c71.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/offline/page-083e183303208b2e.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/reset-password/%5Bid%5D/page-dee8ec1114edc3f3.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/reset-password/page-b198e472b1f39f84.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/app/unauthorized/page-3c49b4deac2fe88b.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/c132bf7d-5beb6feaa23f44f5.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/dd65fad0-bf75d8ef670cabc0.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/e76dea90-7ed8fd3b754805e8.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/f204187f-73aa94d168f575f0.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/framework-20afca218c33ed8b.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/main-app-c2a34e54f91c7bb9.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/main-f5b95f3a715d0af0.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/pages/_app-ffea6178c0c92ef8.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/pages/_error-4659dd3827b8a592.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-f31ba54e3bec4bdb.js",revision:"Z22Jw1VpEC_zsv3ib8vc8"},{url:"/_next/static/css/6111ab7dc201048d.css",revision:"6111ab7dc201048d"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/media/google.a0008721.svg",revision:"d677415d7c9c5baea125e867d6d78c2f"},{url:"/background/auth-page.svg",revision:"54b0cc93f18b2b579d763ba4f2980517"},{url:"/fonts/open-sans/OpenSans-Bold.ttf",revision:"0a191f83602623628320f3d3c667a276"},{url:"/fonts/open-sans/OpenSans-Regular.ttf",revision:"931aebd37b54b3e5df2fedfce1432d52"},{url:"/fonts/roboto/Roboto-Bold.ttf",revision:"2e9b3d16308e1642bf8549d58c60f5c9"},{url:"/fonts/roboto/Roboto-Regular.ttf",revision:"327362a7c8d487ad3f7970cc8e2aba8d"},{url:"/logo/avatar.webp",revision:"a5a2ef3f5837d62c47ced758ee5bb7cc"},{url:"/logo/google.svg",revision:"d677415d7c9c5baea125e867d6d78c2f"},{url:"/logo/logo-clear.svg",revision:"3049b3df6dcf05452d4cff9c74bb574a"},{url:"/logo/logo-dark.svg",revision:"b4fc998d42a6111ba7a68dfe50409a9c"},{url:"/logo/logo.svg",revision:"4efd00b9b5459eebc8046765e389db0f"},{url:"/logo/orion-192.png",revision:"70948e6d3a34a8b1883d9937aadc4321"},{url:"/logo/orion-384.png",revision:"bf79326e4a37b5e9efbbb8f538960ccc"},{url:"/logo/orion-512.png",revision:"98397148fffd2bbfc3c49308fa66318a"},{url:"/logo/orion.png",revision:"c6d9c14ba3e6cb8142f7fef84d1bbe60"},{url:"/manifest.json",revision:"c49692eab8e928447e24eef980f27d91"}],{ignoreURLParametersMatching:[]}),s.cleanupOutdatedCaches(),s.registerRoute("/",new s.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:s,response:e,event:a,state:i})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),s.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new s.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),s.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new s.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),s.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new s.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),s.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new s.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new s.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\/_next\/image\?url=.+$/i,new s.StaleWhileRevalidate({cacheName:"next-image",plugins:[new s.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:mp3|wav|ogg)$/i,new s.CacheFirst({cacheName:"static-audio-assets",plugins:[new s.RangeRequestsPlugin,new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:mp4)$/i,new s.CacheFirst({cacheName:"static-video-assets",plugins:[new s.RangeRequestsPlugin,new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:js)$/i,new s.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:css|less)$/i,new s.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new s.StaleWhileRevalidate({cacheName:"next-data",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:json|xml|csv)$/i,new s.NetworkFirst({cacheName:"static-data-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>{if(!(self.origin===s.origin))return!1;const e=s.pathname;return!e.startsWith("/api/auth/")&&!!e.startsWith("/api/")}),new s.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>{if(!(self.origin===s.origin))return!1;return!s.pathname.startsWith("/api/")}),new s.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>!(self.origin===s.origin)),new s.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
