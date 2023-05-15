(function(u,f){typeof exports=="object"&&typeof module!="undefined"?f(exports):typeof define=="function"&&define.amd?define(["exports"],f):(u=typeof globalThis!="undefined"?globalThis:u||self,f(u["web-fs"]={}))})(this,function(u){"use strict";var q=Object.defineProperty;var W=(u,f,m)=>f in u?q(u,f,{enumerable:!0,configurable:!0,writable:!0,value:m}):u[f]=m;var g=(u,f,m)=>(W(u,typeof f!="symbol"?f+"":f,m),m);function F(l){return l===47}function j(l){if(typeof l!="string")throw new TypeError(`Path must be a string. Received ${JSON.stringify(l)}`)}function P(l,e,t,c){let n="",s=0,o=-1,i=0,a;for(let r=0,d=l.length;r<=d;++r){if(r<d)a=l.charCodeAt(r);else{if(c(a))break;a=47}if(c(a)){if(!(o===r-1||i===1))if(o!==r-1&&i===2){if(n.length<2||s!==2||n.charCodeAt(n.length-1)!==46||n.charCodeAt(n.length-2)!==46){if(n.length>2){const h=n.lastIndexOf(t);h===-1?(n="",s=0):(n=n.slice(0,h),s=n.length-1-n.lastIndexOf(t)),o=r,i=0;continue}else if(n.length===2||n.length===1){n="",s=0,o=r,i=0;continue}}e&&(n.length>0?n+=`${t}..`:n="..",s=2)}else n.length>0?n+=t+l.slice(o+1,r):n=l.slice(o+1,r),s=r-o-1;o=r,i=0}else a===46&&i!==-1?++i:i=-1}return n}function R(l){if(j(l),l.length===0)return".";const e=F(l.charCodeAt(0)),t=F(l.charCodeAt(l.length-1));return l=P(l,!e,"/",F),l.length===0&&!e&&(l="."),l.length>0&&t&&(l+="/"),e?`/${l}`:l}function A(...l){if(l.length===0)return".";let e;for(let t=0,c=l.length;t<c;++t){const n=l[t];j(n),n.length>0&&(e?e+=`/${n}`:e=n)}return e?R(e):"."}class S{constructor(e,t,c,n,s,o){g(this,"path");g(this,"parentPath");g(this,"content");g(this,"icon");g(this,"type");g(this,"id");this.path=e,this.parentPath=t,this.content=c,this.icon=n,this.type=s,this.id=o,o===void 0&&delete this.id}}class D{constructor(){g(this,"db");g(this,"_ready",null);g(this,"_watchMap",new Map);const e=window.indexedDB.open("FileSystemDB",1);e.onerror=()=>{console.error("Failed to open database")},e.onsuccess=()=>{var t;this.db=e.result,(t=this._ready)==null||t.call(this,this)},e.onupgradeneeded=()=>{this.db=e.result;const t=this.db.createObjectStore("files",{keyPath:"id",autoIncrement:!0});t.createIndex("parentPath","parentPath"),t.createIndex("path","path",{unique:!0}),t.add(new S("/","","","dir","dir"))}}async initFileSystem(){await this.whenReady()}serializeFileSystem(){return new Promise((e,t)=>{const s=this.db.transaction("files","readonly").objectStore("files").getAll();s.onerror=()=>{t("Failed to read file")},s.onsuccess=()=>{e(s.result)}})}deserializeFileSystem(e){return new Promise((t,c)=>{const s=this.db.transaction("files","readwrite").objectStore("files"),o=s.clear();o.onerror=()=>{c("Failed to clear file")},o.onsuccess=()=>{e.forEach(i=>{s.add(i)}),t(void 0)}})}whenReady(){return this.db?Promise.resolve(this):new Promise((e,t)=>{this._ready=e})}registerWatcher(e,t){this._watchMap.set(e,t)}commitWatch(e,t){this._watchMap.forEach((c,n)=>{n.test(e)&&c(e,t)})}removeFileSystem(){window.indexedDB.deleteDatabase("FileSystemDB")}async readFile(e){const n=this.db.transaction("files","readonly").objectStore("files").index("path"),s=IDBKeyRange.only(e),o=n.get(s);return new Promise((i,a)=>{o.onerror=()=>{a("Failed to read file")},o.onsuccess=()=>{const r=o.result;i(r?r.content:null)}})}async writeFile(e,t){let c=e.split("/").slice(0,-1).join("/");if(c===""&&(c="/"),!await this.exists(c))return Promise.reject("Cannot write file to a non-exist path:"+e);let s=await this.stat(e);const i=this.db.transaction("files","readwrite").objectStore("files");if(s){const a=i.put(new S(e,s.parentPath,t.content,t.icon||s.icon,t.type||s.type,s.id));return new Promise((r,d)=>{a.onerror=()=>{console.error("Failed to write file"),d("Failed to write file")},a.onsuccess=()=>{this.commitWatch(e,t.content),r()}})}else{const a=i.add(new S(e,c,t.content,t.icon,t.type));return new Promise((r,d)=>{a.onerror=()=>{console.error("Failed to write file"),d("Failed to write file")},a.onsuccess=()=>{this.commitWatch(e,t.content),r()}})}}async appendFile(e,t){const n=this.db.transaction("files","readwrite").objectStore("files"),s=n.index("path"),o=IDBKeyRange.only(e),i=s.get(o);return new Promise((a,r)=>{i.onerror=()=>{console.error("Failed to read file"),r("Failed to read file")},i.onsuccess=()=>{const d=i.result;if(d){d.content+=t;const h=n.put(d);h.onerror=()=>{console.error("Failed to write file"),r("Failed to write file")},h.onsuccess=()=>{this.commitWatch(e,d.content),a()}}else console.error("File not found"),r("File not found")}})}async readdir(e){const n=this.db.transaction("files","readonly").objectStore("files").index("parentPath"),s=IDBKeyRange.only(e),o=n.getAll(s);return new Promise((i,a)=>{o.onerror=()=>{console.error("Failed to read directory"),a("Failed to read directory")},o.onsuccess=()=>{const r=o.result;i(r)}})}async exists(e){try{const n=this.db.transaction("files","readonly").objectStore("files").index("path"),s=IDBKeyRange.only(e),o=n.getAll(s);return new Promise((i,a)=>{o.onerror=()=>{console.error("Failed to read file"),a("Failed to read file")},o.onsuccess=()=>{const r=o.result;i(!!r.length)}})}catch{return!1}}async stat(e){const n=this.db.transaction("files","readonly").objectStore("files").index("path"),s=IDBKeyRange.only(e),o=n.get(s);return new Promise((i,a)=>{o.onerror=()=>{console.error("Failed to read file"),a("Failed to read file")},o.onsuccess=()=>{const r=o.result;i(r)}})}async unlink(e){const c=this.db.transaction("files","readwrite").objectStore("files"),n=c.index("path"),s=IDBKeyRange.only(e),o=n.get(s);return new Promise((i,a)=>{o.onerror=()=>{console.error("Failed to delete file"),a("Failed to delete file")},o.onsuccess=()=>{let r=o.result;r?r.type==="dir"?a("Cannot delete a directory"):(c.delete(o.result.id),this.commitWatch(e,r.content),i()):a("File not found")}})}async rename(e,t){const n=this.db.transaction("files","readwrite").objectStore("files"),s=n.index("path"),o=IDBKeyRange.only(e),i=s.get(o);return new Promise((a,r)=>{i.onerror=()=>{r("Failed to read file")},i.onsuccess=()=>{const d=i.result;if(d){let h=function(y,b,w){y.type==="dir"?(n.index("parentPath").openCursor(IDBKeyRange.only(y.path)).onsuccess=C=>{let x=C.target.result;if(x){let p=x.value,I=A(b,p.path.split("/").slice(-1)[0]);h(p,I,b),x.continue()}},y.path=b,y.parentPath=w,n.put(y)):(y.path=b,y.parentPath=w,n.put(y))};h(d,t,t.split("/").slice(0,-1).join("/"))}this.commitWatch(e,d.content),a()}})}async rmdir(e){const c=this.db.transaction("files","readwrite").objectStore("files"),n=c.index("path"),s=IDBKeyRange.only(e),o=n.get(s);return new Promise((i,a)=>{o.onerror=()=>{a("Failed to read file")},o.onsuccess=()=>{const r=o.result;if(r){let d=function(h){h.type==="dir"&&(c.index("parentPath").openCursor(IDBKeyRange.only(h.path)).onsuccess=y=>{let b=y.target.result;if(b){let w=b.value;d(w),b.continue()}}),c.index("path").openCursor(IDBKeyRange.only(h.path)).onsuccess=y=>{let b=y.target.result;b&&(c.delete(b.value.id),b.continue())}};d(r)}this.commitWatch(e,r.content),i()}})}async mkdir(e){let t=e.split("/").slice(0,-1).join("/");if(t===""&&(t="/"),!await this.exists(t))return console.error("Cannot create directory to a non-exist path:"+t),Promise.reject("Cannot create directory to a non-exist path:"+t);if(await this.exists(e))return Promise.resolve();const i=this.db.transaction("files","readwrite").objectStore("files").add(new S(e,t,"","dir","dir"));return new Promise((a,r)=>{i.onerror=()=>{console.error("Failed to create directory"),r("Failed to create directory")},i.onsuccess=()=>{this.commitWatch(e,""),a()}})}}u.WebFile=S,u.WebFileSystem=D,Object.defineProperty(u,Symbol.toStringTag,{value:"Module"})});
