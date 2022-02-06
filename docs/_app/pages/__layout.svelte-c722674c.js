import{F as Te,S as ge,i as we,s as Ee,e as v,t as L,k as T,G as Q,c as h,a as f,h as N,d as o,m as O,H as X,b as i,I as U,g as y,J as n,K as W,L as ee,M as ke,j as xe,N as $e,w as Oe,x as Ae,y as Ce,O as qe,P as Ie,Q as Le,q as K,o as F,B as De,v as Ve,n as Me,p as Be}from"../chunks/vendor-e23481e1.js";import{w as Se,a as Ne,l as Ue,p as He,i as je}from"../chunks/eth-b4b05d56.js";const We=()=>{const c=Te("__svelte__");return{page:{subscribe:c.page.subscribe},navigating:{subscribe:c.navigating.subscribe},get preloading(){return console.error("stores.preloading is deprecated; use stores.navigating instead"),{subscribe:c.navigating.subscribe}},session:c.session}},Ye={subscribe(c){return We().page.subscribe(c)}};function Pe(c){let e,l,t,r,a,s;return{c(){e=v("button"),l=v("div"),t=v("div"),r=L("Connect Wallet"),this.h()},l(d){e=h(d,"BUTTON",{class:!0});var p=f(e);l=h(p,"DIV",{class:!0}),f(l).forEach(o),t=h(p,"DIV",{});var _=f(t);r=N(_,"Connect Wallet"),_.forEach(o),p.forEach(o),this.h()},h(){i(l,"class","rounded-full w-[6px] h-[6px] bg-green-500 bg-red-500"),i(e,"class","flex items-center px-4 h-12 bg-white rounded shadow-button space-x-3")},m(d,p){y(d,e,p),n(e,l),n(e,t),n(t,r),a||(s=ke(e,"click",Ue),a=!0)},p:W,d(d){d&&o(e),a=!1,s()}}}function Re(c){let e,l,t,r,a,s,d=c[2].slice(0,6)+"",p,_,w=c[2].slice(-6)+"",E;return{c(){e=v("div"),l=v("div"),t=v("button"),r=v("div"),a=T(),s=v("div"),p=L(d),_=L("..."),E=L(w),this.h()},l(g){e=h(g,"DIV",{class:!0});var I=f(e);l=h(I,"DIV",{class:!0});var $=f(l);t=h($,"BUTTON",{class:!0});var q=f(t);r=h(q,"DIV",{class:!0}),f(r).forEach(o),a=O(q),s=h(q,"DIV",{});var k=f(s);p=N(k,d),_=N(k,"..."),E=N(k,w),k.forEach(o),q.forEach(o),$.forEach(o),I.forEach(o),this.h()},h(){i(r,"class","rounded-full w-[6px] h-[6px] bg-green-500 bg-green-500 mr-3"),i(t,"class","flex items-center px-4 h-12 bg-white rounded"),i(l,"class","absolute z-50 flex flex-col items-center shadow-button"),i(e,"class","w-[153px] relative")},m(g,I){y(g,e,I),n(e,l),n(l,t),n(t,r),n(t,a),n(t,s),n(s,p),n(s,_),n(s,E)},p(g,I){I&4&&d!==(d=g[2].slice(0,6)+"")&&xe(p,d),I&4&&w!==(w=g[2].slice(-6)+"")&&xe(E,w)},d(g){g&&o(e)}}}function ze(c){let e,l,t,r;return{c(){e=v("button"),l=L("Wrong Network"),this.h()},l(a){e=h(a,"BUTTON",{class:!0});var s=f(e);l=N(s,"Wrong Network"),s.forEach(o),this.h()},h(){i(e,"class","flex items-center px-4 h-12 text-white font-bold bg-link bg-orange-600 rounded shadow-button space-x-3 hover:bg-orange-700 cursor-pointer")},m(a,s){y(a,e,s),n(e,l),t||(r=ke(e,"click",He),t=!0)},p:W,d(a){a&&o(e),t=!1,r()}}}function Ge(c){let e,l,t,r,a,s,d,p,_,w,E,g,I,$,q,k,Y,u,b,V,M,A,C,te,se,B,P,le,G,Z,H,R,j;function ae(m,x){return m[1]?ze:m[2]?Re:Pe}let J=ae(c),D=J(c);return{c(){e=v("header"),l=v("div"),t=L("\xA0"),r=T(),a=v("nav"),s=Q("svg"),d=Q("path"),p=T(),_=v("ul"),w=v("li"),E=v("a"),g=L("Home"),I=T(),$=v("li"),q=v("a"),k=L("MY Gallery"),Y=T(),u=v("li"),b=v("a"),V=L("Museum"),M=T(),A=v("li"),C=v("a"),te=L("Loans"),se=T(),B=Q("svg"),P=Q("path"),le=T(),G=v("div"),Z=T(),H=v("div"),R=v("div"),j=v("div"),D.c(),this.h()},l(m){e=h(m,"HEADER",{class:!0});var x=f(e);l=h(x,"DIV",{class:!0});var re=f(l);t=N(re,"\xA0"),re.forEach(o),r=O(x),a=h(x,"NAV",{class:!0});var z=f(a);s=X(z,"svg",{viewBox:!0,"aria-hidden":!0,class:!0});var ne=f(s);d=X(ne,"path",{d:!0,class:!0}),f(d).forEach(o),ne.forEach(o),p=O(z),_=h(z,"UL",{class:!0});var S=f(_);w=h(S,"LI",{class:!0});var oe=f(w);E=h(oe,"A",{"sveltekit:prefetch":!0,href:!0,class:!0});var ie=f(E);g=N(ie,"Home"),ie.forEach(o),oe.forEach(o),I=O(S),$=h(S,"LI",{class:!0});var ce=f($);q=h(ce,"A",{"sveltekit:prefetch":!0,href:!0,class:!0});var ue=f(q);k=N(ue,"MY Gallery"),ue.forEach(o),ce.forEach(o),Y=O(S),u=h(S,"LI",{class:!0});var fe=f(u);b=h(fe,"A",{"sveltekit:prefetch":!0,href:!0,class:!0});var de=f(b);V=N(de,"Museum"),de.forEach(o),fe.forEach(o),M=O(S),A=h(S,"LI",{class:!0});var ve=f(A);C=h(ve,"A",{"sveltekit:prefetch":!0,href:!0,class:!0});var he=f(C);te=N(he,"Loans"),he.forEach(o),ve.forEach(o),S.forEach(o),se=O(z),B=X(z,"svg",{viewBox:!0,"aria-hidden":!0,class:!0});var pe=f(B);P=X(pe,"path",{d:!0,class:!0}),f(P).forEach(o),pe.forEach(o),z.forEach(o),le=O(x),G=h(x,"DIV",{class:!0});var ye=f(G);ye.forEach(o),x.forEach(o),Z=O(m),H=h(m,"DIV",{class:!0});var _e=f(H);R=h(_e,"DIV",{class:!0});var me=f(R);j=h(me,"DIV",{class:!0});var be=f(j);D.l(be),be.forEach(o),me.forEach(o),_e.forEach(o),this.h()},h(){i(l,"class","corner svelte-t2wq17"),i(d,"d","M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z"),i(d,"class","svelte-t2wq17"),i(s,"viewBox","0 0 2 3"),i(s,"aria-hidden","true"),i(s,"class","svelte-t2wq17"),i(E,"sveltekit:prefetch",""),i(E,"href","/"),i(E,"class","svelte-t2wq17"),i(w,"class","svelte-t2wq17"),U(w,"active",c[0].url.pathname==="/"),i(q,"sveltekit:prefetch",""),i(q,"href","/wallet"),i(q,"class","svelte-t2wq17"),i($,"class","svelte-t2wq17"),U($,"active",c[0].url.pathname==="/wallet"),i(b,"sveltekit:prefetch",""),i(b,"href","/museum"),i(b,"class","svelte-t2wq17"),i(u,"class","svelte-t2wq17"),U(u,"active",c[0].url.pathname==="/museum"),i(C,"sveltekit:prefetch",""),i(C,"href","/loans"),i(C,"class","svelte-t2wq17"),i(A,"class","svelte-t2wq17"),U(A,"active",c[0].url.pathname==="/loans"),i(_,"class","svelte-t2wq17"),i(P,"d","M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z"),i(P,"class","svelte-t2wq17"),i(B,"viewBox","0 0 2 3"),i(B,"aria-hidden","true"),i(B,"class","svelte-t2wq17"),i(a,"class","svelte-t2wq17"),i(G,"class","corner svelte-t2wq17"),i(e,"class","svelte-t2wq17"),i(j,"class","flex col-span-full col-end-12 col-start-8 justify-end space-x-8"),i(R,"class","grid px-4 lg:px-0 grid-cols-4 lg:grid-cols-12 gap-x-3 lg:gap-x-5"),i(H,"class","relative")},m(m,x){y(m,e,x),n(e,l),n(l,t),n(e,r),n(e,a),n(a,s),n(s,d),n(a,p),n(a,_),n(_,w),n(w,E),n(E,g),n(_,I),n(_,$),n($,q),n(q,k),n(_,Y),n(_,u),n(u,b),n(b,V),n(_,M),n(_,A),n(A,C),n(C,te),n(a,se),n(a,B),n(B,P),n(e,le),n(e,G),y(m,Z,x),y(m,H,x),n(H,R),n(R,j),D.m(j,null)},p(m,[x]){x&1&&U(w,"active",m[0].url.pathname==="/"),x&1&&U($,"active",m[0].url.pathname==="/wallet"),x&1&&U(u,"active",m[0].url.pathname==="/museum"),x&1&&U(A,"active",m[0].url.pathname==="/loans"),J===(J=ae(m))&&D?D.p(m,x):(D.d(1),D=J(m),D&&(D.c(),D.m(j,null)))},i:W,o:W,d(m){m&&o(e),m&&o(Z),m&&o(H),D.d()}}}function Ke(c,e,l){let t,r,a;return ee(c,Ye,s=>l(0,t=s)),ee(c,Se,s=>l(1,r=s)),ee(c,Ne,s=>l(2,a=s)),[t,r,a]}class Fe extends ge{constructor(e){super();we(this,e,Ke,Ge,Ee,{})}}function Ze(c){let e,l;return{c(){e=v("h2"),l=L("PLEASE CONNECT YOUR WALLET TO CONTINUE"),this.h()},l(t){e=h(t,"H2",{class:!0});var r=f(e);l=N(r,"PLEASE CONNECT YOUR WALLET TO CONTINUE"),r.forEach(o),this.h()},h(){i(e,"class","text-2xl font-bold")},m(t,r){y(t,e,r),n(e,l)},p:W,i:W,o:W,d(t){t&&o(e)}}}function Je(c){let e;const l=c[1].default,t=$e(l,c,c[2],null);return{c(){t&&t.c()},l(r){t&&t.l(r)},m(r,a){t&&t.m(r,a),e=!0},p(r,a){t&&t.p&&(!e||a&4)&&qe(t,l,r,r[2],e?Le(l,r[2],a,null):Ie(r[2]),null)},i(r){e||(K(t,r),e=!0)},o(r){F(t,r),e=!1},d(r){t&&t.d(r)}}}function Qe(c){let e,l,t,r,a,s,d,p,_,w,E,g,I,$;const q=[Je,Ze],k=[];function Y(u,b){return u[0]?0:1}return l=Y(c),t=k[l]=q[l](c),{c(){e=v("main"),t.c(),r=T(),a=v("footer"),s=v("p"),d=L("visit "),p=v("a"),_=L("kit.svelte.dev"),w=L(" to learn SvelteKit"),E=T(),g=v("style"),I=L(`main {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 1rem;
      width: 100%;
      max-width: 1024px;
      margin: 0 auto;
      box-sizing: border-box;
    }

    footer {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 40px;
    }

    footer a {
      font-weight: bold;
    }

    @media (min-width: 480px) {
      footer {
        padding: 40px 0;
      }
    }`),this.h()},l(u){e=h(u,"MAIN",{});var b=f(e);t.l(b),b.forEach(o),r=O(u),a=h(u,"FOOTER",{});var V=f(a);s=h(V,"P",{});var M=f(s);d=N(M,"visit "),p=h(M,"A",{href:!0});var A=f(p);_=N(A,"kit.svelte.dev"),A.forEach(o),w=N(M," to learn SvelteKit"),M.forEach(o),V.forEach(o),E=O(u),g=h(u,"STYLE",{});var C=f(g);I=N(C,`main {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 1rem;
      width: 100%;
      max-width: 1024px;
      margin: 0 auto;
      box-sizing: border-box;
    }

    footer {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 40px;
    }

    footer a {
      font-weight: bold;
    }

    @media (min-width: 480px) {
      footer {
        padding: 40px 0;
      }
    }`),C.forEach(o),this.h()},h(){i(p,"href","https://kit.svelte.dev")},m(u,b){y(u,e,b),k[l].m(e,null),y(u,r,b),y(u,a,b),n(a,s),n(s,d),n(s,p),n(p,_),n(s,w),y(u,E,b),y(u,g,b),n(g,I),$=!0},p(u,b){let V=l;l=Y(u),l===V?k[l].p(u,b):(Me(),F(k[V],1,1,()=>{k[V]=null}),Be(),t=k[l],t?t.p(u,b):(t=k[l]=q[l](u),t.c()),K(t,1),t.m(e,null))},i(u){$||(K(t),$=!0)},o(u){F(t),$=!1},d(u){u&&o(e),k[l].d(),u&&o(r),u&&o(a),u&&o(E),u&&o(g)}}}function Xe(c){let e,l,t;e=new Fe({props:{$$slots:{default:[Qe]},$$scope:{ctx:c}}});const r=c[1].default,a=$e(r,c,c[2],null);return{c(){Oe(e.$$.fragment),l=T(),a&&a.c()},l(s){Ae(e.$$.fragment,s),l=O(s),a&&a.l(s)},m(s,d){Ce(e,s,d),y(s,l,d),a&&a.m(s,d),t=!0},p(s,[d]){const p={};d&5&&(p.$$scope={dirty:d,ctx:s}),e.$set(p),a&&a.p&&(!t||d&4)&&qe(a,r,s,s[2],t?Le(r,s[2],d,null):Ie(s[2]),null)},i(s){t||(K(e.$$.fragment,s),K(a,s),t=!0)},o(s){F(e.$$.fragment,s),F(a,s),t=!1},d(s){De(e,s),s&&o(l),a&&a.d(s)}}}function et(c,e,l){let t;ee(c,Ne,s=>l(0,t=s));let{$$slots:r={},$$scope:a}=e;return Ve(()=>{try{je()}catch{}}),c.$$set=s=>{"$$scope"in s&&l(2,a=s.$$scope)},[t,r,a]}class lt extends ge{constructor(e){super();we(this,e,et,Xe,Ee,{})}}export{lt as default};
