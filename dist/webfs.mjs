var P = Object.defineProperty;
var _ = (t, e, n) => e in t ? P(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var u = (t, e, n) => (_(t, typeof e != "symbol" ? e + "" : e, n), n);
const I = 65, B = 97, q = 90, k = 122, K = 46, L = 58, T = 47, z = 92;
function v(t, e = "") {
  if (!t)
    throw new Error(e);
}
function y(t) {
  return t === 47;
}
function $(t) {
  return y(t) || t === 92;
}
function m(t) {
  if (typeof t != "string")
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(t)}`
    );
}
function M(t) {
  return t >= 97 && t <= 122 || t >= 65 && t <= 90;
}
function x(t, e, n = 0) {
  let o = !1, r = t.length;
  for (let i = t.length - 1; i >= n; --i)
    if (e(t.charCodeAt(i))) {
      if (o) {
        n = i + 1;
        break;
      }
    } else
      o || (o = !0, r = i + 1);
  return t.slice(n, r);
}
function R(t, e) {
  if (t.length <= 1)
    return t;
  let n = t.length;
  for (let o = t.length - 1; o > 0 && e(t.charCodeAt(o)); o--)
    n = o;
  return t.slice(0, n);
}
function j(t, e) {
  if (e.length >= t.length)
    return t;
  const n = t.length - e.length;
  for (let o = e.length - 1; o >= 0; --o)
    if (t.charCodeAt(n + o) !== e.charCodeAt(o))
      return t;
  return t.slice(0, -e.length);
}
function H(t, e, n, o) {
  let r = "", i = 0, s = -1, c = 0, a;
  for (let l = 0, d = t.length; l <= d; ++l) {
    if (l < d)
      a = t.charCodeAt(l);
    else {
      if (o(a))
        break;
      a = 47;
    }
    if (o(a)) {
      if (!(s === l - 1 || c === 1))
        if (s !== l - 1 && c === 2) {
          if (r.length < 2 || i !== 2 || r.charCodeAt(r.length - 1) !== 46 || r.charCodeAt(r.length - 2) !== 46) {
            if (r.length > 2) {
              const f = r.lastIndexOf(n);
              f === -1 ? (r = "", i = 0) : (r = r.slice(0, f), i = r.length - 1 - r.lastIndexOf(n)), s = l, c = 0;
              continue;
            } else if (r.length === 2 || r.length === 1) {
              r = "", i = 0, s = l, c = 0;
              continue;
            }
          }
          e && (r.length > 0 ? r += `${n}..` : r = "..", i = 2);
        } else
          r.length > 0 ? r += n + t.slice(s + 1, l) : r = t.slice(s + 1, l), i = l - s - 1;
      s = l, c = 0;
    } else
      a === 46 && c !== -1 ? ++c : c = -1;
  }
  return r;
}
function p(t) {
  if (m(t), t.length === 0)
    return ".";
  const e = y(t.charCodeAt(0)), n = y(
    t.charCodeAt(t.length - 1)
  );
  return t = H(t, !e, "/", y), t.length === 0 && !e && (t = "."), t.length > 0 && n && (t += "/"), e ? `/${t}` : t;
}
function W(...t) {
  if (t.length === 0)
    return ".";
  let e;
  for (let n = 0, o = t.length; n < o; ++n) {
    const r = t[n];
    m(r), r.length > 0 && (e ? e += `/${r}` : e = r);
  }
  return e ? p(e) : ".";
}
function U(t, e = "") {
  if (m(t), t.length === 0)
    return t;
  if (typeof e != "string")
    throw new TypeError(
      `Suffix must be a string. Received ${JSON.stringify(e)}`
    );
  const n = x(t, y), o = R(
    n,
    y
  );
  return e ? j(o, e) : o;
}
function C(t) {
  if (t.length === 0)
    return ".";
  let e = -1, n = !1;
  for (let o = t.length - 1; o >= 1; --o)
    if (y(t.charCodeAt(o))) {
      if (n) {
        e = o;
        break;
      }
    } else
      n = !0;
  return e === -1 ? y(t.charCodeAt(0)) ? "/" : "." : R(
    t.slice(0, e),
    y
  );
}
function Z(t) {
  m(t);
  let e = -1, n = 0, o = -1, r = !0, i = 0;
  for (let s = t.length - 1; s >= 0; --s) {
    const c = t.charCodeAt(s);
    if (y(c)) {
      if (!r) {
        n = s + 1;
        break;
      }
      continue;
    }
    o === -1 && (r = !1, o = s + 1), c === 46 ? e === -1 ? e = s : i !== 1 && (i = 1) : e !== -1 && (i = -1);
  }
  return e === -1 || o === -1 || // We saw a non-dot character immediately before the dot
  i === 0 || // The (right-most) trimmed path component is exactly '..'
  i === 1 && e === o - 1 && e === n + 1 ? "" : t.slice(e, o);
}
class E {
  constructor(e, n, o, r, i, s, c) {
    u(this, "isFile", !0);
    u(this, "isDirectory", !1);
    u(this, "isSymlink", !1);
    u(this, "size", 0);
    u(this, "mtime", /* @__PURE__ */ new Date());
    u(this, "atime", /* @__PURE__ */ new Date());
    u(this, "birthtime", /* @__PURE__ */ new Date());
    e !== void 0 && (this.isFile = e), n !== void 0 && (this.isDirectory = n), o !== void 0 && (this.isSymlink = o), r !== void 0 && (this.size = r), i !== void 0 && (this.mtime = i), s !== void 0 && (this.atime = s), c !== void 0 && (this.birthtime = c);
  }
}
class b extends E {
  constructor(n, o, r, i) {
    r.isFile && (r.isDirectory = !1, r.isSymlink = !1), r.isDirectory && (r.isFile = !1, r.isSymlink = !1), r.isSymlink && (r.isFile = !1, r.isDirectory = !1);
    super(r.isFile, r.isDirectory, r.isSymlink, r.size, r.mtime, r.atime, r.birthtime);
    u(this, "path");
    u(this, "parentPath");
    u(this, "content");
    // icon: string;
    // type: string;
    u(this, "id");
    this.path = n, this.parentPath = C(n), this.content = o, this.id = i, i === void 0 && delete this.id;
  }
}
class N {
  constructor() {
    u(this, "db");
    u(this, "_ready", null);
    u(this, "_watchMap", /* @__PURE__ */ new Map());
    const e = window.indexedDB.open("FileSystemDB", 1);
    e.onerror = () => {
      console.error("Failed to open database");
    }, e.onsuccess = () => {
      var n;
      this.db = e.result, (n = this._ready) == null || n.call(this, this);
    }, e.onupgradeneeded = () => {
      this.db = e.result;
      const n = this.db.createObjectStore(
        "files",
        { keyPath: "id", autoIncrement: !0 }
      );
      n.createIndex("parentPath", "parentPath"), n.createIndex("path", "path", { unique: !0 });
      let o = new b(
        "/",
        "",
        {
          isDirectory: !0
        }
      );
      o.parentPath = "", n.add(
        o
      );
    };
  }
  serializeFileSystem() {
    return new Promise((e, n) => {
      const i = this.db.transaction("files", "readonly").objectStore("files").getAll();
      i.onerror = () => {
        n("Failed to read file");
      }, i.onsuccess = () => {
        e(i.result);
      };
    });
  }
  deserializeFileSystem(e) {
    return new Promise((n, o) => {
      const i = this.db.transaction("files", "readwrite").objectStore("files"), s = i.clear();
      s.onerror = () => {
        o("Failed to clear file");
      }, s.onsuccess = () => {
        e.forEach((c) => {
          i.add(c);
        }), n(void 0);
      };
    });
  }
  whenReady() {
    return this.db ? Promise.resolve(this) : new Promise((e, n) => {
      this._ready = e;
    });
  }
  registerWatcher(e, n) {
    this._watchMap.set(e, n);
  }
  commitWatch(e, n) {
    this._watchMap.forEach((o, r) => {
      r.test(e) && o(e, n);
    });
  }
  removeFileSystem() {
    window.indexedDB.deleteDatabase("FileSystemDB");
  }
  /**
   * 读取指定路径的文件内容
   * @param path 文件路径
   * @returns 文件内容
   */
  async readFile(e) {
    const r = this.db.transaction("files", "readonly").objectStore("files").index("path"), i = IDBKeyRange.only(e), s = r.get(i);
    return new Promise((c, a) => {
      s.onerror = () => {
        a("Failed to read file");
      }, s.onsuccess = () => {
        const l = s.result;
        c(l ? l.content : null);
      };
    });
  }
  /**
   * 写入文件内容到指定路径 不存在则创建，存在则覆盖
   * @param path 文件路径
   * @param content 文件内容
   */
  async writeFile(e, n) {
    let o = C(e);
    if (!await this.exists(o))
      return Promise.reject("Cannot write file to a non-exist path:" + e);
    let i = await this.stat(e);
    const c = this.db.transaction("files", "readwrite").objectStore("files");
    if (i) {
      const a = c.put(
        new b(
          e,
          n.content,
          {
            isFile: !0
          },
          i.id
        )
      );
      return new Promise((l, d) => {
        a.onerror = () => {
          console.error("Failed to write file"), d("Failed to write file");
        }, a.onsuccess = () => {
          this.commitWatch(e, n.content), l();
        };
      });
    } else {
      const a = c.add(
        new b(
          e,
          n.content,
          {
            isFile: !0
          }
        )
      );
      return new Promise((l, d) => {
        a.onerror = () => {
          console.error("Failed to write file"), d("Failed to write file");
        }, a.onsuccess = () => {
          this.commitWatch(e, n.content), l();
        };
      });
    }
  }
  async appendFile(e, n) {
    const r = this.db.transaction("files", "readwrite").objectStore("files"), i = r.index("path"), s = IDBKeyRange.only(e), c = i.get(s);
    return new Promise((a, l) => {
      c.onerror = () => {
        console.error("Failed to read file"), l("Failed to read file");
      }, c.onsuccess = () => {
        const d = c.result;
        if (d) {
          d.content += n;
          const f = r.put(d);
          f.onerror = () => {
            console.error("Failed to write file"), l("Failed to write file");
          }, f.onsuccess = () => {
            this.commitWatch(e, d.content), a();
          };
        } else
          console.error("File not found"), l("File not found");
      };
    });
  }
  /**
  * 读取指定路径下的所有文件和文件夹
  * @param path 目录路径
  * @returns 文件和文件夹列表
  */
  async readdir(e) {
    const r = this.db.transaction("files", "readonly").objectStore("files").index("parentPath"), i = IDBKeyRange.only(e), s = r.getAll(i);
    return new Promise((c, a) => {
      s.onerror = () => {
        console.error("Failed to read directory"), a("Failed to read directory");
      }, s.onsuccess = () => {
        const l = s.result;
        c(l);
      };
    });
  }
  async exists(e) {
    try {
      const r = this.db.transaction("files", "readonly").objectStore("files").index("path"), i = IDBKeyRange.only(e), s = r.getAll(i);
      return new Promise((c, a) => {
        s.onerror = () => {
          console.error("Failed to read file"), a("Failed to read file");
        }, s.onsuccess = () => {
          const l = s.result;
          c(!!l.length);
        };
      });
    } catch {
      return !1;
    }
  }
  async stat(e) {
    const r = this.db.transaction("files", "readonly").objectStore("files").index("path"), i = IDBKeyRange.only(e), s = r.get(i);
    return new Promise((c, a) => {
      s.onerror = () => {
        console.error("Failed to read file"), a("Failed to read file");
      }, s.onsuccess = () => {
        const l = s.result;
        c(l);
      };
    });
  }
  /**
   * 删除指定路径的文件
   * @param path 文件路径
   */
  async unlink(e) {
    const o = this.db.transaction("files", "readwrite").objectStore("files"), r = o.index("path"), i = IDBKeyRange.only(e), s = r.get(i);
    return new Promise((c, a) => {
      s.onerror = () => {
        console.error("Failed to delete file"), a("Failed to delete file");
      }, s.onsuccess = () => {
        let l = s.result;
        l ? l.isDirectory ? a("Cannot delete a directory") : (o.delete(s.result.id), this.commitWatch(e, l.content), c()) : a("File not found");
      };
    });
  }
  async rename(e, n) {
    const r = this.db.transaction("files", "readwrite").objectStore("files"), i = r.index("path"), s = IDBKeyRange.only(e), c = i.get(s);
    return new Promise((a, l) => {
      c.onerror = () => {
        l("Failed to read file");
      }, c.onsuccess = () => {
        const d = c.result;
        if (d) {
          let f = function(h, S, g) {
            h.isDirectory ? (r.index("parentPath").openCursor(IDBKeyRange.only(h.path)).onsuccess = (F) => {
              let A = F.target.result;
              if (A) {
                let w = A.value, D = W(S, w.path.split("/").slice(-1)[0]);
                f(
                  w,
                  D,
                  S
                ), A.continue();
              }
            }, h.path = S, h.parentPath = g, r.put(h)) : (h.path = S, h.parentPath = g, r.put(h));
          };
          f(d, n, n.split("/").slice(0, -1).join("/"));
        }
        this.commitWatch(e, d.content), a();
      };
    });
  }
  /**
   * 删除指定路径的文件夹及其内容
   * @param path 文件夹路径
   */
  async rmdir(e) {
    const o = this.db.transaction("files", "readwrite").objectStore("files"), r = o.index("path"), i = IDBKeyRange.only(e), s = r.get(i);
    return new Promise((c, a) => {
      s.onerror = () => {
        a("Failed to read file");
      }, s.onsuccess = () => {
        const l = s.result;
        if (l) {
          let d = function(f) {
            f.isDirectory && (o.index("parentPath").openCursor(IDBKeyRange.only(f.path)).onsuccess = (h) => {
              let S = h.target.result;
              if (S) {
                let g = S.value;
                d(g), S.continue();
              }
            }), o.index("path").openCursor(IDBKeyRange.only(f.path)).onsuccess = (h) => {
              let S = h.target.result;
              S && (o.delete(S.value.id), S.continue());
            };
          };
          d(l);
        }
        this.commitWatch(e, l.content), c();
      };
    });
  }
  /**
   * 创建新的文件夹
   * @param path 文件夹路径
   */
  async mkdir(e) {
    let n = e.split("/").slice(0, -1).join("/");
    if (n === "" && (n = "/"), !await this.exists(n))
      return console.error("Cannot create directory to a non-exist path:" + n), Promise.reject("Cannot create directory to a non-exist path:" + n);
    if (await this.exists(e))
      return Promise.resolve();
    const c = this.db.transaction("files", "readwrite").objectStore("files").add(
      new b(
        e,
        "",
        {
          isDirectory: !0
        }
      )
    );
    return new Promise((a, l) => {
      c.onerror = () => {
        console.error("Failed to create directory"), l("Failed to create directory");
      }, c.onsuccess = () => {
        this.commitWatch(e, ""), a();
      };
    });
  }
}
export {
  z as CHAR_BACKWARD_SLASH,
  L as CHAR_COLON,
  K as CHAR_DOT,
  T as CHAR_FORWARD_SLASH,
  B as CHAR_LOWERCASE_A,
  k as CHAR_LOWERCASE_Z,
  I as CHAR_UPPERCASE_A,
  q as CHAR_UPPERCASE_Z,
  b as WebFile,
  N as WebFileSystem,
  v as assert,
  m as assertPath,
  U as basename,
  C as dirname,
  Z as extname,
  $ as isPathSeparator,
  y as isPosixPathSeparator,
  M as isWindowsDeviceRoot,
  W as join,
  x as lastPathSegment,
  p as normalize,
  H as normalizeString,
  j as stripSuffix,
  R as stripTrailingSeparators
};
