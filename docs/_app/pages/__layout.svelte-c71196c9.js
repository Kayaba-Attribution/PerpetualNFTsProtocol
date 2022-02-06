import{F as Oe,S as we,i as Ee,s as ke,e as v,t as I,k as N,G as K,c as p,a as f,h as q,d as n,m as T,H as Q,b as i,I as H,g as L,J as o,K as W,L as X,M as xe,j as $e,N as Ie,w as Ce,x as De,y as Ve,O as qe,P as Le,Q as Ne,q as z,o as F,B as Ae,v as Be,n as Me,p as Ue}from"../chunks/vendor-e23481e1.js";import{b as y}from"../chunks/paths-4b3c6e7e.js";import{w as He,a as Te,l as je,p as Se,i as We}from"../chunks/eth-56353d6b.js";const Ge=()=>{const c=Oe("__svelte__");return{page:{subscribe:c.page.subscribe},navigating:{subscribe:c.navigating.subscribe},get preloading(){return console.error("stores.preloading is deprecated; use stores.navigating instead"),{subscribe:c.navigating.subscribe}},session:c.session}},Ye={subscribe(c){return Ge().page.subscribe(c)}};function Pe(c){let e,l,t,r,a,s;return{c(){e=v("button"),l=v("div"),t=v("div"),r=I("Connect Wallet"),this.h()},l(d){e=p(d,"BUTTON",{class:!0});var _=f(e);l=p(_,"DIV",{class:!0}),f(l).forEach(n),t=p(_,"DIV",{});var h=f(t);r=q(h,"Connect Wallet"),h.forEach(n),_.forEach(n),this.h()},h(){i(l,"class","rounded-full w-[6px] h-[6px] bg-green-500 bg-red-500"),i(e,"class","flex items-center px-4 h-12 bg-white rounded shadow-button space-x-3")},m(d,_){L(d,e,_),o(e,l),o(e,t),o(t,r),a||(s=xe(e,"click",je),a=!0)},p:W,d(d){d&&n(e),a=!1,s()}}}function Re(c){let e,l,t,r,a,s,d=c[2].slice(0,6)+"",_,h,w=c[2].slice(-6)+"",E;return{c(){e=v("div"),l=v("div"),t=v("button"),r=v("div"),a=N(),s=v("div"),_=I(d),h=I("..."),E=I(w),this.h()},l(x){e=p(x,"DIV",{class:!0});var g=f(e);l=p(g,"DIV",{class:!0});var $=f(l);t=p($,"BUTTON",{class:!0});var u=f(t);r=p(u,"DIV",{class:!0}),f(r).forEach(n),a=T(u),s=p(u,"DIV",{});var b=f(s);_=q(b,d),h=q(b,"..."),E=q(b,w),b.forEach(n),u.forEach(n),$.forEach(n),g.forEach(n),this.h()},h(){i(r,"class","rounded-full w-[6px] h-[6px] bg-green-500 mr-3"),i(t,"class","flex items-center px-4 h-12 bg-white rounded"),i(l,"class","absolute z-50 flex flex-col items-center shadow-button"),i(e,"class","w-[153px] relative")},m(x,g){L(x,e,g),o(e,l),o(l,t),o(t,r),o(t,a),o(t,s),o(s,_),o(s,h),o(s,E)},p(x,g){g&4&&d!==(d=x[2].slice(0,6)+"")&&$e(_,d),g&4&&w!==(w=x[2].slice(-6)+"")&&$e(E,w)},d(x){x&&n(e)}}}function ze(c){let e,l,t,r;return{c(){e=v("button"),l=I("Wrong Network"),this.h()},l(a){e=p(a,"BUTTON",{class:!0});var s=f(e);l=q(s,"Wrong Network"),s.forEach(n),this.h()},h(){i(e,"class","flex items-center px-4 h-12 text-white font-bold bg-link bg-orange-600 rounded shadow-button space-x-3 hover:bg-orange-700 cursor-pointer")},m(a,s){L(a,e,s),o(e,l),t||(r=xe(e,"click",Se),t=!0)},p:W,d(a){a&&n(e),t=!1,r()}}}function Fe(c){let e,l,t,r,a,s,d,_,h,w,E,x,g,$,u,b,V,O,C,ee,te,A,B,se,le,M,G,ae,R,Z,j,Y,S;function re(m,k){return m[1]?ze:m[2]?Re:Pe}let J=re(c),D=J(c);return{c(){e=v("header"),l=v("div"),t=I("\xA0"),r=N(),a=v("nav"),s=K("svg"),d=K("path"),_=N(),h=v("ul"),w=v("li"),E=v("a"),x=I("Home"),g=N(),$=v("li"),u=v("a"),b=I("MY Gallery"),V=N(),O=v("li"),C=v("a"),ee=I("Museum"),te=N(),A=v("li"),B=v("a"),se=I("Loans"),le=N(),M=K("svg"),G=K("path"),ae=N(),R=v("div"),Z=N(),j=v("div"),Y=v("div"),S=v("div"),D.c(),this.h()},l(m){e=p(m,"HEADER",{class:!0});var k=f(e);l=p(k,"DIV",{class:!0});var ne=f(l);t=q(ne,"\xA0"),ne.forEach(n),r=T(k),a=p(k,"NAV",{class:!0});var P=f(a);s=Q(P,"svg",{viewBox:!0,"aria-hidden":!0,class:!0});var oe=f(s);d=Q(oe,"path",{d:!0,class:!0}),f(d).forEach(n),oe.forEach(n),_=T(P),h=p(P,"UL",{class:!0});var U=f(h);w=p(U,"LI",{class:!0});var ie=f(w);E=p(ie,"A",{"sveltekit:prefetch":!0,href:!0,class:!0});var ce=f(E);x=q(ce,"Home"),ce.forEach(n),ie.forEach(n),g=T(U),$=p(U,"LI",{class:!0});var ue=f($);u=p(ue,"A",{"sveltekit:prefetch":!0,href:!0,class:!0});var fe=f(u);b=q(fe,"MY Gallery"),fe.forEach(n),ue.forEach(n),V=T(U),O=p(U,"LI",{class:!0});var de=f(O);C=p(de,"A",{"sveltekit:prefetch":!0,href:!0,class:!0});var ve=f(C);ee=q(ve,"Museum"),ve.forEach(n),de.forEach(n),te=T(U),A=p(U,"LI",{class:!0});var pe=f(A);B=p(pe,"A",{"sveltekit:prefetch":!0,href:!0,class:!0});var he=f(B);se=q(he,"Loans"),he.forEach(n),pe.forEach(n),U.forEach(n),le=T(P),M=Q(P,"svg",{viewBox:!0,"aria-hidden":!0,class:!0});var _e=f(M);G=Q(_e,"path",{d:!0,class:!0}),f(G).forEach(n),_e.forEach(n),P.forEach(n),ae=T(k),R=p(k,"DIV",{class:!0});var ye=f(R);ye.forEach(n),k.forEach(n),Z=T(m),j=p(m,"DIV",{class:!0});var me=f(j);Y=p(me,"DIV",{class:!0});var be=f(Y);S=p(be,"DIV",{class:!0});var ge=f(S);D.l(ge),ge.forEach(n),be.forEach(n),me.forEach(n),this.h()},h(){i(l,"class","corner svelte-t2wq17"),i(d,"d","M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z"),i(d,"class","svelte-t2wq17"),i(s,"viewBox","0 0 2 3"),i(s,"aria-hidden","true"),i(s,"class","svelte-t2wq17"),i(E,"sveltekit:prefetch",""),i(E,"href",""+(y+"/")),i(E,"class","svelte-t2wq17"),i(w,"class","svelte-t2wq17"),H(w,"active",c[0].url.pathname===y+"/"),i(u,"sveltekit:prefetch",""),i(u,"href",""+(y+"/wallet")),i(u,"class","svelte-t2wq17"),i($,"class","svelte-t2wq17"),H($,"active",c[0].url.pathname===y+"/wallet"),i(C,"sveltekit:prefetch",""),i(C,"href",""+(y+"/museum")),i(C,"class","svelte-t2wq17"),i(O,"class","svelte-t2wq17"),H(O,"active",c[0].url.pathname===y+"/museum"),i(B,"sveltekit:prefetch",""),i(B,"href",""+(y+"/loans")),i(B,"class","svelte-t2wq17"),i(A,"class","svelte-t2wq17"),H(A,"active",c[0].url.pathname===y+"/loans"),i(h,"class","svelte-t2wq17"),i(G,"d","M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z"),i(G,"class","svelte-t2wq17"),i(M,"viewBox","0 0 2 3"),i(M,"aria-hidden","true"),i(M,"class","svelte-t2wq17"),i(a,"class","svelte-t2wq17"),i(R,"class","corner svelte-t2wq17"),i(e,"class","svelte-t2wq17"),i(S,"class","flex col-span-full col-end-12 col-start-8 justify-end space-x-8"),i(Y,"class","grid px-4 lg:px-0 grid-cols-4 lg:grid-cols-12 gap-x-3 lg:gap-x-5"),i(j,"class","relative")},m(m,k){L(m,e,k),o(e,l),o(l,t),o(e,r),o(e,a),o(a,s),o(s,d),o(a,_),o(a,h),o(h,w),o(w,E),o(E,x),o(h,g),o(h,$),o($,u),o(u,b),o(h,V),o(h,O),o(O,C),o(C,ee),o(h,te),o(h,A),o(A,B),o(B,se),o(a,le),o(a,M),o(M,G),o(e,ae),o(e,R),L(m,Z,k),L(m,j,k),o(j,Y),o(Y,S),D.m(S,null)},p(m,[k]){k&1&&H(w,"active",m[0].url.pathname===y+"/"),k&1&&H($,"active",m[0].url.pathname===y+"/wallet"),k&1&&H(O,"active",m[0].url.pathname===y+"/museum"),k&1&&H(A,"active",m[0].url.pathname===y+"/loans"),J===(J=re(m))&&D?D.p(m,k):(D.d(1),D=J(m),D&&(D.c(),D.m(S,null)))},i:W,o:W,d(m){m&&n(e),m&&n(Z),m&&n(j),D.d()}}}function Ze(c,e,l){let t,r,a;return X(c,Ye,s=>l(0,t=s)),X(c,He,s=>l(1,r=s)),X(c,Te,s=>l(2,a=s)),[t,r,a]}class Je extends we{constructor(e){super();Ee(this,e,Ze,Fe,ke,{})}}function Ke(c){let e,l;return{c(){e=v("h2"),l=I("PLEASE CONNECT YOUR WALLET TO CONTINUE"),this.h()},l(t){e=p(t,"H2",{class:!0});var r=f(e);l=q(r,"PLEASE CONNECT YOUR WALLET TO CONTINUE"),r.forEach(n),this.h()},h(){i(e,"class","text-2xl font-bold")},m(t,r){L(t,e,r),o(e,l)},p:W,i:W,o:W,d(t){t&&n(e)}}}function Qe(c){let e;const l=c[1].default,t=Ie(l,c,c[2],null);return{c(){t&&t.c()},l(r){t&&t.l(r)},m(r,a){t&&t.m(r,a),e=!0},p(r,a){t&&t.p&&(!e||a&4)&&qe(t,l,r,r[2],e?Ne(l,r[2],a,null):Le(r[2]),null)},i(r){e||(z(t,r),e=!0)},o(r){F(t,r),e=!1},d(r){t&&t.d(r)}}}function Xe(c){let e,l,t,r,a,s,d,_,h,w,E;const x=[Qe,Ke],g=[];function $(u,b){return u[0]?0:1}return l=$(c),t=g[l]=x[l](c),{c(){e=v("main"),t.c(),r=N(),a=v("footer"),s=v("p"),d=I("GITHUB"),_=N(),h=v("style"),w=I(`main {
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
    }`)},l(u){e=p(u,"MAIN",{});var b=f(e);t.l(b),b.forEach(n),r=T(u),a=p(u,"FOOTER",{});var V=f(a);s=p(V,"P",{});var O=f(s);d=q(O,"GITHUB"),O.forEach(n),V.forEach(n),_=T(u),h=p(u,"STYLE",{});var C=f(h);w=q(C,`main {
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
    }`),C.forEach(n)},m(u,b){L(u,e,b),g[l].m(e,null),L(u,r,b),L(u,a,b),o(a,s),o(s,d),L(u,_,b),L(u,h,b),o(h,w),E=!0},p(u,b){let V=l;l=$(u),l===V?g[l].p(u,b):(Me(),F(g[V],1,1,()=>{g[V]=null}),Ue(),t=g[l],t?t.p(u,b):(t=g[l]=x[l](u),t.c()),z(t,1),t.m(e,null))},i(u){E||(z(t),E=!0)},o(u){F(t),E=!1},d(u){u&&n(e),g[l].d(),u&&n(r),u&&n(a),u&&n(_),u&&n(h)}}}function et(c){let e,l,t;e=new Je({props:{$$slots:{default:[Xe]},$$scope:{ctx:c}}});const r=c[1].default,a=Ie(r,c,c[2],null);return{c(){Ce(e.$$.fragment),l=N(),a&&a.c()},l(s){De(e.$$.fragment,s),l=T(s),a&&a.l(s)},m(s,d){Ve(e,s,d),L(s,l,d),a&&a.m(s,d),t=!0},p(s,[d]){const _={};d&5&&(_.$$scope={dirty:d,ctx:s}),e.$set(_),a&&a.p&&(!t||d&4)&&qe(a,r,s,s[2],t?Ne(r,s[2],d,null):Le(s[2]),null)},i(s){t||(z(e.$$.fragment,s),z(a,s),t=!0)},o(s){F(e.$$.fragment,s),F(a,s),t=!1},d(s){Ae(e,s),s&&n(l),a&&a.d(s)}}}function tt(c,e,l){let t;X(c,Te,s=>l(0,t=s));let{$$slots:r={},$$scope:a}=e;return Be(()=>{try{We()}catch{}}),c.$$set=s=>{"$$scope"in s&&l(2,a=s.$$scope)},[t,r,a]}class rt extends we{constructor(e){super();Ee(this,e,tt,et,ke,{})}}export{rt as default};
