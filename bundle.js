(()=>{"use strict";var t,e,i,n,s={80:()=>{},834:(t,e,i)=>{i.d(e,{S:()=>x});var n=i(25),s=i(915),h=i(875);const o=Math.cos(Math.PI/10),a=Math.sin(Math.PI/10),r=Math.cos(Math.PI/5),l=Math.sin(Math.PI/5),c=.075,g=1,d=.2;function m(t,e,i,h,m){if("kite"===e.type){const r=e.rhombuses.find((t=>t.isThin)),l=b(r.points[0],r.points[2]),x=new n.E(e.x-l.x,e.y-l.y);!function(t,e,i,h,r,l){h-=Math.PI/2;const m=(t,e,i,h)=>{const o=(0,s.cG)(new n.E(e,i),h);return new n.E(o.x+t.x,o.y+t.y)},b=t=>{e.moveTo(t.x,t.y)},x=t=>{e.lineTo(t.x,t.y)},u=r(i),y=r(m(i,0,2*-a,h)),p=r(m(i,0,1,h)),f=r(m(i,-o,-a,h)),C=r(m(i,-o,1-a,h)),w=r(m(i,o,-a,h)),P=r(m(i,o,1-a,h));e.strokeStyle=l.border,e.lineWidth=g,e.fillStyle=l.thin,e.beginPath(),b(u),x(w),x(y),x(f),x(u),e.stroke(),e.fill(),e.strokeStyle=l.smallCircle,e.lineWidth=t*c,e.beginPath(),e.arc(y.x,y.y,t*d,h+Math.PI/10,h+Math.PI-Math.PI/10,!1),e.stroke(),e.strokeStyle=l.bigCircle,e.lineWidth=t*c,e.beginPath(),e.arc(u.x,u.y,t*d,h-Math.PI/10,h-Math.PI+Math.PI/10,!0),e.stroke(),e.beginPath(),e.strokeStyle=l.border,e.lineWidth=g,e.fillStyle=l.thick,b(u),x(f),x(C),x(p),x(u),e.stroke(),e.fill(),e.strokeStyle=l.bigCircle,e.lineWidth=t*c,e.beginPath(),e.arc(f.x,f.y,t*(1-d),h+Math.PI/10,h+Math.PI/2,!1),e.stroke(),e.strokeStyle=l.smallCircle,e.lineWidth=t*c,e.beginPath(),e.arc(p.x,p.y,t*d,h-Math.PI/2,h-Math.PI/2-Math.PI/5*2,!0),e.stroke(),e.beginPath(),e.strokeStyle=l.border,e.lineWidth=g,e.fillStyle=l.thick,b(u),x(w),x(P),x(p),x(u),e.stroke(),e.fill(),e.strokeStyle=l.bigCircle,e.lineWidth=t*c,e.beginPath(),e.arc(w.x,w.y,t*(1-d),h+Math.PI/2,h+Math.PI/2+Math.PI/5*2,!1),e.stroke(),e.strokeStyle=l.smallCircle,e.lineWidth=t*c,e.beginPath(),e.arc(p.x,p.y,t*d,h-Math.PI/2,h-Math.PI/10,!1),e.stroke()}(t,i,e,Math.atan2(x.y,x.x),h,m)}else if("deuce"===e.type){const o=e.rhombuses.find((t=>!t.isThin)),a=b(o.points[0],o.points[2]),x=new n.E(e.x-a.x,e.y-a.y);!function(t,e,i,h,o,a){h-=Math.PI/2;const m=(t,e,i,h)=>{const o=(0,s.cG)(new n.E(e,i),h);return new n.E(o.x+t.x,o.y+t.y)},b=t=>{e.lineTo(t.x,t.y)},x=o(i),u=o(m(i,0,2*-r,h)),y=o(m(i,-l,-r,h)),p=o(m(i,l,-r,h));var f;e.beginPath(),e.strokeStyle=a.border,e.lineWidth=g,e.fillStyle=a.thick,f=x,e.moveTo(f.x,f.y),b(p),b(u),b(y),b(x),e.stroke(),e.fill(),e.strokeStyle=a.bigCircle,e.lineWidth=t*c,e.beginPath(),e.arc(u.x,u.y,t*(1-d),h+Math.PI/2-Math.PI/5,h+Math.PI/2+Math.PI/5,!1),e.stroke(),e.strokeStyle=a.smallCircle,e.lineWidth=t*c,e.beginPath(),e.arc(x.x,x.y,t*d,h-Math.PI/2+Math.PI/5,h-Math.PI/2-Math.PI/5,!0),e.stroke()}(t,i,e,Math.atan2(x.y,x.x),h,m)}}function b(t,e,i=.5){const s=e.x-t.x,h=e.y-t.y,o=t.x+s*i,a=t.y+h*i;return new n.E(o,a)}class x{constructor(t,e,i,s,h,o,a,r,l=new n.E(0,0)){this.random=t,this.generator=e,this.colorTheme=i,this.one=s,this.pxWidth=h,this.pxHeight=o,this.smallCanvas=a,this.bigCanvas=r,this.centerUnits=l,this.bigContext=this.bigCanvas.getContext("2d",{willReadFrequently:!0}),this.smallContext=this.smallCanvas.getContext("2d",{willReadFrequently:!0}),this.bigWidthPx=this.pxWidth,this.bigHeightPx=this.pxHeight,r.width=this.pxWidth,r.height=this.pxHeight,this.bigCanvas.style.width=this.bigCanvas.width+"px",this.bigCanvas.style.height=this.bigCanvas.height+"px",a.width=3*this.pxWidth,a.height=3*this.pxHeight,this.smallCanvas.style.width=this.smallCanvas.width+"px",this.smallCanvas.style.height=this.smallCanvas.height+"px",this.smallPositionOnBigPx=new n.E(0,0),this.draw(),this.moveToBig()}convertUnitsToPx(t){const e=this.pxWidth/this.one/2,i=this.pxHeight/this.one/2,h=(0,s.UI)(t.x,this.centerUnits.x-e,this.centerUnits.x+e,0,this.pxWidth)+this.pxWidth,o=(0,s.UI)(t.y,this.centerUnits.y-i,this.centerUnits.y+i,0,this.pxHeight)+this.pxHeight;return new n.E(h,o)}drawToCanvas(t,e,i,n){const o=(0,s.KW)();this.smallContext.fillStyle="white",this.smallContext.fillRect(0,0,o.width,3*o.height);const a=this.generator.generate(t,e,i,n);(0,h.kN)(a);for(const t of Object.values(a.vertices))m(this.one,t,this.smallContext,(t=>this.convertUnitsToPx(t)),this.colorTheme);return a}draw(){const t=this.pxWidth/this.one/2,e=this.pxHeight/this.one/2;this.tiling=this.drawToCanvas(this.centerUnits.x-6*t,this.centerUnits.x+6*t,this.centerUnits.y-6*e,this.centerUnits.y+6*e)}resize(t,e){this.smallPositionOnBigPx.x-=(t-this.pxWidth)/2,this.smallPositionOnBigPx.y-=(e-this.pxHeight)/2,this.pxWidth=t,this.pxHeight=e,this.smallCanvas.width=3*t,this.smallCanvas.style.width=this.smallCanvas.width+"px",this.smallCanvas.height=3*e,this.smallCanvas.style.height=this.smallCanvas.height+"px",this.smallCanvas.style.top=-e+"px",this.smallCanvas.style.left=-t+"px",this.draw(),(async()=>{this.checkBigSize(),this.moveToBig()})()}changeOne(t){this.one=t,this.draw(),(async()=>{this.moveToBig()})()}move(t){const e=t.x/this.one,i=t.y/this.one;this.centerUnits.x+=e,this.centerUnits.y+=i,this.smallPositionOnBigPx.x+=t.x,this.smallPositionOnBigPx.y+=t.y,this.draw(),(async()=>{this.checkBigSize(),this.moveToBig()})()}moveToBig(){const t=this.smallContext.getImageData(this.pxWidth,this.pxHeight,this.pxWidth,this.pxHeight);this.bigContext.putImageData(t,this.smallPositionOnBigPx.x,this.smallPositionOnBigPx.y)}checkBigSize(){const t=0-this.smallPositionOnBigPx.x,e=this.smallPositionOnBigPx.x+this.pxWidth-this.bigWidthPx,i=0-this.smallPositionOnBigPx.y,n=this.smallPositionOnBigPx.y+this.pxHeight-this.bigHeightPx;if(t<=0&&e<=0&&i<=0&&n<=0)return;const s=this.bigContext.getImageData(0,0,this.bigWidthPx,this.bigHeightPx);t>0&&(this.bigCanvas.width+=t,this.bigCanvas.style.width=this.bigCanvas.width+"px",this.bigWidthPx+=t,this.smallPositionOnBigPx.x=0),e>0&&(this.bigCanvas.width+=e,this.bigCanvas.style.width=this.bigCanvas.width+"px",this.bigWidthPx+=e),i>0&&(this.bigCanvas.height+=i,this.bigCanvas.style.height=this.bigCanvas.height+"px",this.bigHeightPx+=i,this.smallPositionOnBigPx.y=0),n>0&&(this.bigCanvas.height+=n,this.bigCanvas.style.height=this.bigCanvas.height+"px",this.bigHeightPx+=n),this.bigContext.putImageData(s,Math.max(t,0),Math.max(i,0))}}},575:(t,e,i)=>{i.d(e,{b:()=>n});const n=[{dark:{thin:"#d9d8ff",thick:"#ffdbdb",smallCircle:"#6d6dff",bigCircle:"#ff7171",border:"rgba(0, 0, 0, 1)"},light:{thin:"#d9d8ff",thick:"#ffdbdb",smallCircle:"#6d6dff",bigCircle:"#ff7171",border:"rgba(0, 0, 0, 1)"}},{dark:{thick:"#61481C",thin:"#A47E3B",bigCircle:"#BF9742",smallCircle:"#E6B325",border:"rgba(0, 0, 0, 1)"},light:{thick:"#E93B81",thin:"#F5ABC9",bigCircle:"#FFE5E2",smallCircle:"#B6C9F0",border:"rgba(0, 0, 0, 0)"}},{dark:{thick:"#3A4750",thin:"#303841",bigCircle:"#F6C90E",smallCircle:"#EEEEEE",border:"rgba(0, 0, 0, 1)"},light:{thick:"#FAF1E6",thin:"#FAF1E6",bigCircle:"#064420",smallCircle:"#064420",border:"rgba(0, 0, 0, 0)"}},{dark:{thick:"#3E432E",thin:"#000000",bigCircle:"#616F39",smallCircle:"#A7D129",border:"rgba(0, 0, 0, 1)"},light:{thick:"#D36B00",thin:"#42032C",bigCircle:"#E6D2AA",smallCircle:"#F1EFDC",border:"rgba(0, 0, 0, 0)"}},{dark:{thick:"#3C2A21",thin:"#1A120B",bigCircle:"#D5CEA3",smallCircle:"#E5E5CB",border:"rgba(0, 0, 0, 0)"},light:{thick:"#FFD93D",thin:"#F6F1E9",bigCircle:"#FF8400",smallCircle:"#4F200D",border:"rgba(0, 0, 0, 0)"}},{dark:{thick:"#393E46",thin:"#222831",bigCircle:"#D65A31",smallCircle:"#EEEEEE",border:"rgba(0, 0, 0, 0)"},light:{thick:"#FBF2CF",thin:"#FA7070",bigCircle:"#C6EBC5",smallCircle:"#A1C298",border:"rgba(0, 0, 0, 0)"}},{dark:{thick:"#F7A440",thin:"#E1701A",bigCircle:"#F5E6CA",smallCircle:"#F6DCBF",border:"rgba(0, 0, 0, 0)"},light:{thick:"#FF8E9E",thin:"#FF597B",bigCircle:"#EEEEEE",smallCircle:"#F9B5D0",border:"rgba(0, 0, 0, 0)"}},{dark:{thick:"#52057B",thin:"#000000",bigCircle:"#BC6FF1",smallCircle:"#892CDC",border:"rgba(0, 0, 0, 1)"},light:{thick:"#F8F3D4",thin:"#00B8A9",bigCircle:"#FFDE7D",smallCircle:"#F6416C",border:"rgba(0, 0, 0, 0)"}},{dark:{thick:"#88304E",thin:"#E23E57",bigCircle:"#311D3F",smallCircle:"#522546",border:"rgba(0, 0, 0, 0)"},light:{thick:"#E8DFCA",thin:"#F5EFE6",bigCircle:"#7895B2",smallCircle:"#AEBDCA",border:"rgba(0, 0, 0, 0)"}},{dark:{thick:"#393E46",thin:"#222831",bigCircle:"#EEEEEE",smallCircle:"#00ADB5",border:"rgba(0, 0, 0, 0)"},light:{thick:"#DBE2EF",thin:"#F9F7F7",bigCircle:"#112D4E",smallCircle:"#3F72AF",border:"rgba(0, 0, 0, 0)"}},{dark:{thick:"#191919",thin:"#2D4263",bigCircle:"#C84B31",smallCircle:"#ECDBBA",border:"rgba(0, 0, 0, 0)"},light:{thick:"#96B6C5",thin:"#ADC4CE",bigCircle:"#EEE0C9",smallCircle:"#F1F0E8",border:"rgba(0, 0, 0, 0)"}}]},497:(t,e,i)=>{i.d(e,{TJ:()=>a,fE:()=>h,hq:()=>o,mj:()=>r});const n={text:"#808080 penrose1",fileName:"penrose.png",bottom:15,right:10,font:"bold 30px Arial",strokeWidth:4},s=!(!window.matchMedia||!window.matchMedia("(prefers-color-scheme: dark)").matches);function h(t,e){c(e.getImageData(0,0,t.width,t.height))}function o(t,e){const i=t.width/3,n=t.height/3;c(e.getImageData(i,n,i,n))}async function a(t,e){const i=e.getImageData(0,0,t.width,t.height),n=await g(i);await navigator.clipboard.write([new ClipboardItem({"image/png":n})])}async function r(t,e){const i=t.width/3,n=t.height/3,s=e.getImageData(i,n,i,n),h=await g(s);await navigator.clipboard.write([new ClipboardItem({"image/png":h})])}function l(t,e,i){t.font=n.font,t.textAlign="end",t.fillStyle=s?"black":"white",t.strokeStyle=s?"white":"black",t.lineWidth=n.strokeWidth,t.strokeText(n.text,e-n.right,i-n.bottom),t.fillText(n.text,e-n.right,i-n.bottom)}function c(t){const e=document.createElement("canvas");e.style.display="none",e.style.width=t.width+"px",e.style.height=t.height+"px",e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.putImageData(t,0,0),l(i,t.width,t.height);const s=e.toDataURL("image/png").replace("image/png","image/octet-stream"),h=document.createElement("a");h.style.display="none",h.href=s,h.download=n.fileName,h.click(),h.remove(),e.remove()}async function g(t){const e=t.width,i=t.height;let n=document.createElement("canvas");n.width=e,n.height=i;const s=n.getContext("2d");return s.putImageData(t,0,0),l(s,t.width,t.height),new Promise((t=>{n.toBlob(t)}))}},491:(t,e,i)=>{i.d(e,{t:()=>s});const n=["favicons/favicon1.ico","favicons/favicon2.ico"];function s(t){const e=t.nextArrayValue(n);document.getElementById("favicon").setAttribute("href",e)}},915:(t,e,i)=>{i.d(e,{KW:()=>a,Mx:()=>s,UI:()=>h,cG:()=>o});var n=i(25);function s(t,e,i){let n=0;for(let s=t;s<=e;s++)n+=i(s);return n}function h(t,e,i,n,s){let h=t-e;return h*=(s-n)/(i-e),h+=n,h}function o(t,e){return function(t,e,i){const s=t.x*i-t.y*e,h=t.x*e+t.y*i;return new n.E(s,h)}(t,Math.sin(e),Math.cos(e))}function a(){const t=document.documentElement.clientWidth,e=document.documentElement.clientHeight;return t>e?{width:t/2,height:e,horizontal:!0}:{width:t,height:e-100,horizontal:!1}}},299:(t,e,i)=>{i.a(t,(async(t,e)=>{try{var n=i(834),s=i(875),h=i(25),o=i(211),a=i(497),r=i(575),l=i(491),c=i(915);const g=document.getElementById("big"),d=g.getContext("2d",{willReadFrequently:!0}),m=document.getElementById("small"),b=m.getContext("2d",{willReadFrequently:!0});let x=(0,c.KW)();const u={left:-x.width,top:-x.height,x:0,y:0},y=!(!window.matchMedia||!window.matchMedia("(prefers-color-scheme: dark)").matches),p=await(0,o.Th)(),f=new o.kk(p);(0,l.t)(f);const C=(0,o.$z)(f),w=f.nextArrayValue(r.b)[y?"dark":"light"],P=new s.zQ(C),E=new n.S(f,P,w,50,x.width,x.height,m,g);function k(){let t=0,e=0;m.ontouchstart=i=>{1===i.touches.length&&(t=i.touches[0].clientX,e=i.touches[0].clientY)},m.ontouchmove=i=>{if(i.preventDefault(),i.stopImmediatePropagation(),i.stopPropagation(),1===i.touches.length){const n=i.touches[0].clientX-t,s=i.touches[0].clientY-e;t=i.touches[0].clientX,e=i.touches[0].clientY,u.left+=n,u.top+=s,u.x-=n,u.y-=s,m.style.top=u.top+"px",m.style.left=u.left+"px"}},m.ontouchend=t=>{t.preventDefault(),t.stopImmediatePropagation(),t.stopPropagation(),E.move(new h.E(u.x,u.y)),u.x=0,u.y=0,u.left=-x.width,u.top=-x.height,m.style.top=u.top+"px",m.style.left=u.left+"px"}}document.documentElement.clientWidth>document.documentElement.clientHeight&&document.body.classList.add("horizontal"),window.onresize=t=>{x=(0,c.KW)(),x.horizontal?document.body.classList.add("horizontal"):document.body.classList.remove("horizontal"),E.resize(x.width,x.height)},k(),m.onmousemove=async t=>{if(!t.buttons)return;t.preventDefault(),t.stopImmediatePropagation(),t.stopPropagation();const e=-t.movementX,i=-t.movementY;u.left-=e,u.top-=i,u.x+=e,u.y+=i,m.style.top=u.top+"px",m.style.left=u.left+"px"},m.onmouseup=async t=>{E.move(new h.E(u.x,u.y)),u.x=0,u.y=0,u.left=-x.width,u.top=-x.height,m.style.top=u.top+"px",m.style.left=u.left+"px"},document.getElementById("copyBig").onclick=async t=>{const e=document.getElementById("copyBig");e.innerText="copying";try{await(0,a.TJ)(g,d),e.innerText="copied"}catch(t){console.error(t),e.innerText="failed"}setTimeout((()=>{e.innerText="copy big"}),2e3)},document.getElementById("copySmall").onclick=async t=>{const e=document.getElementById("copySmall");e.innerText="copying";try{await(0,a.mj)(m,b),e.innerText="copied"}catch(t){console.error(t),e.innerText="failed"}setTimeout((()=>{e.innerText="copy small"}),2e3)},document.getElementById("downloadBig").onclick=t=>{(0,a.fE)(g,d)},document.getElementById("downloadSmall").onclick=t=>{(0,a.hq)(m,b)};const v=document.getElementById("text");v.onclick=t=>{v.classList.toggle("open")},e()}catch(I){e(I)}}),1)},875:(t,e,i)=>{i.d(e,{kN:()=>c,zQ:()=>l});var n=i(25),s=i(915);class h{constructor(t,e){this.vertices=t,this.rhombuses=e}}class o extends n.E{constructor(t,e=[]){if(5!=t.length)throw new Error("There should be 5 line numbers.");super((0,s.Mx)(0,4,(e=>t[e]*-Math.sin(2*Math.PI*e/5))),(0,s.Mx)(0,4,(e=>t[e]*Math.cos(2*Math.PI*e/5)))),this.lineNumbers=t,this.rhombuses=e,this.hash=t.join("_")}}class a extends n.E{constructor(t,e,i,n,s,h){super(t,e),this.line1Family=i,this.line2Family=n,this.line1Number=s,this.line2Number=h,this.type=(n-i)%5,this.hash=`${i}_${s}_${n}_${h}`}}class r{constructor(t,e){if(this.points=t,this.intersectionPoint=e,4!=t.length)throw new Error("There should be penrose points.");this.isThin=2===e.type||3===e.type}}class l{constructor(t){this.shifts=t}generate(t,e,i,n){window.performance.now();const s=this.getAllIntersectionPoints(t-5,e+5,i-5,n+5),o={},a=s.map((t=>this.generateRhombusFromPoint(t,o)));return new h(o,a)}getIntersectionPoint(t,e,i,s){const h=Math.tan(2*t*Math.PI/5),o=Math.tan(2*i*Math.PI/5),a=2.5*(this.shifts[t]+e)/Math.cos(2*t*Math.PI/5),r=(2.5*(this.shifts[i]+s)/Math.cos(2*i*Math.PI/5)-a)/(h-o),l=h*r+a;return new n.E(r,l)}findSectionOnLineFamily(t,e,i){const n=(i-Math.tan(2*t*Math.PI/5)*e)*Math.cos(2*t*Math.PI/5)/2.5-this.shifts[t];return Math.floor(n)}getIntersectionPoints(t,e,i,n,s,h){const o=this.findSectionOnLineFamily(s,(t+e)/2,(i+n)/2),r=this.findSectionOnLineFamily(h,(t+e)/2,(i+n)/2),l=[],c=[];for(let t=-1;t<=1;t++)for(let e=-1;e<=1;e++)c.push({l1N:o+t,l2N:r+e});for(;c.length;){const{l1N:o,l2N:r}=c.pop();if(l.find((t=>t.line1Number===o&&t.line2Number===r)))continue;const g=this.getIntersectionPoint(s,o,h,r);g.x<t||g.x>e||g.y<i||g.y>n||(l.push(new a(g.x,g.y,s,h,o,r)),c.push({l1N:o-1,l2N:r}),c.push({l1N:o+1,l2N:r}),c.push({l1N:o,l2N:r-1}),c.push({l1N:o,l2N:r+1}))}return l}getAllIntersectionPoints(t,e,i,n){const s=[];for(let h=0;h<5;h++)for(let o=h+1;o<5;o++)s.push(...this.getIntersectionPoints(t,e,i,n,h,o));return s}generateRhombusFromPoint(t,e){const i=[0,1,2,3,4].map((e=>this.findSectionOnLineFamily(e,t.x,t.y))),n=[...i],s=[...i],h=[...i],a=[...i];n[t.line1Family]=t.line1Number-1,s[t.line1Family]=t.line1Number-1,h[t.line1Family]=t.line1Number,a[t.line1Family]=t.line1Number,n[t.line2Family]=t.line2Number-1,s[t.line2Family]=t.line2Number,h[t.line2Family]=t.line2Number,a[t.line2Family]=t.line2Number-1;const l=[new o(n),new o(s),new o(h),new o(a)],c=new r(l,t);for(const t of l){let i=e[t.hash];i||(e[t.hash]=t,i=t),i.rhombuses.push(c)}return c}}function c(t){const e=(t,e)=>5===e&&0===t?"star":2===e&&1===t?"kite":1===e&&2===t?"deuce":3===e&&1===t?"jack":3===e&&2===t?"ace":4===e&&2===t?"king":3===e&&4===t?"queen":"uncomplete";for(const i of Object.values(t.vertices)){const t=i.rhombuses.filter((t=>t.isThin)).length,n=i.rhombuses.length-t;i.type=e(t,n)}}},25:(t,e,i)=>{i.d(e,{E:()=>n});class n{constructor(t,e){this.x=t,this.y=e}}},211:(t,e,i)=>{i.d(e,{$z:()=>h,Th:()=>s,kk:()=>n});class n{constructor(t=420){this.seed=t}random(){const t=1e4*Math.sin(this.seed++);return t-Math.floor(t)}next(){return this.random()}nextInRange(t,e){return t===e?t:t>e?this.nextInRange(e,t):t+this.random()*(e-t)}nextIntInRange(t,e){return t===e?t:t>e?this.nextIntInRange(e,t):Math.floor(this.nextInRange(t,e))}nextArrayValue(t){return t[this.nextIntInRange(0,t.length)]}}async function s(){const t="rgb128_penrose1_seed",e=+localStorage[t];if(e)return e;const i=await(async()=>{try{const t=await fetch("https://worldtimeapi.org/api/ip");return+(await t.json()).unixtime}catch(t){return console.error(t),null}})()||Math.floor(Date.now()/1e3),n=Math.floor(i/86400);return localStorage[t]=n,n}function h(t,e=5){const i=[0];let n=0;for(let s=0;s<e-2;s++){const e=t.nextInRange(-1,1);n+=e,i.push(e)}return i.push(-n),i}}},h={};function o(t){var e=h[t];if(void 0!==e)return e.exports;var i=h[t]={exports:{}};return s[t](i,i.exports,o),i.exports}t="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",e="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",i="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",n=t=>{t&&t.d<1&&(t.d=1,t.forEach((t=>t.r--)),t.forEach((t=>t.r--?t.r++:t())))},o.a=(s,h,o)=>{var a;o&&((a=[]).d=-1);var r,l,c,g=new Set,d=s.exports,m=new Promise(((t,e)=>{c=e,l=t}));m[e]=d,m[t]=t=>(a&&t(a),g.forEach(t),m.catch((t=>{}))),s.exports=m,h((s=>{var h;r=(s=>s.map((s=>{if(null!==s&&"object"==typeof s){if(s[t])return s;if(s.then){var h=[];h.d=0,s.then((t=>{o[e]=t,n(h)}),(t=>{o[i]=t,n(h)}));var o={};return o[t]=t=>t(h),o}}var a={};return a[t]=t=>{},a[e]=s,a})))(s);var o=()=>r.map((t=>{if(t[i])throw t[i];return t[e]})),l=new Promise((e=>{(h=()=>e(o)).r=0;var i=t=>t!==a&&!g.has(t)&&(g.add(t),t&&!t.d&&(h.r++,t.push(h)));r.map((e=>e[t](i)))}));return h.r?l:o()}),(t=>(t?c(m[i]=t):l(d),n(a)))),a&&a.d<0&&(a.d=0)},o.d=(t,e)=>{for(var i in e)o.o(e,i)&&!o.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},o.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),o(299),o(80)})();