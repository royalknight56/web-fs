var P = Object.defineProperty;
var p = (c, e, t) => e in c ? P(c, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[e] = t;
var y = (c, e, t) => (p(c, typeof e != "symbol" ? e + "" : e, t), t);
function S(c) {
  return c === 47;
}
function x(c) {
  if (typeof c != "string")
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(c)}`
    );
}
function R(c, e, t, a) {
  let n = "", s = 0, o = -1, i = 0, l;
  for (let r = 0, d = c.length; r <= d; ++r) {
    if (r < d)
      l = c.charCodeAt(r);
    else {
      if (a(l))
        break;
      l = 47;
    }
    if (a(l)) {
      if (!(o === r - 1 || i === 1))
        if (o !== r - 1 && i === 2) {
          if (n.length < 2 || s !== 2 || n.charCodeAt(n.length - 1) !== 46 || n.charCodeAt(n.length - 2) !== 46) {
            if (n.length > 2) {
              const u = n.lastIndexOf(t);
              u === -1 ? (n = "", s = 0) : (n = n.slice(0, u), s = n.length - 1 - n.lastIndexOf(t)), o = r, i = 0;
              continue;
            } else if (n.length === 2 || n.length === 1) {
              n = "", s = 0, o = r, i = 0;
              continue;
            }
          }
          e && (n.length > 0 ? n += `${t}..` : n = "..", s = 2);
        } else
          n.length > 0 ? n += t + c.slice(o + 1, r) : n = c.slice(o + 1, r), s = r - o - 1;
      o = r, i = 0;
    } else
      l === 46 && i !== -1 ? ++i : i = -1;
  }
  return n;
}
function A(c) {
  if (x(c), c.length === 0)
    return ".";
  const e = S(c.charCodeAt(0)), t = S(
    c.charCodeAt(c.length - 1)
  );
  return c = R(c, !e, "/", S), c.length === 0 && !e && (c = "."), c.length > 0 && t && (c += "/"), e ? `/${c}` : c;
}
function D(...c) {
  if (c.length === 0)
    return ".";
  let e;
  for (let t = 0, a = c.length; t < a; ++t) {
    const n = c[t];
    x(n), n.length > 0 && (e ? e += `/${n}` : e = n);
  }
  return e ? A(e) : ".";
}
class b {
  constructor(e, t, a, n, s, o) {
    y(this, "path");
    y(this, "parentPath");
    y(this, "content");
    y(this, "icon");
    y(this, "type");
    y(this, "id");
    this.path = e, this.parentPath = t, this.content = a, this.icon = n, this.type = s, this.id = o, o === void 0 && delete this.id;
  }
}
class I {
  constructor() {
    y(this, "db");
    y(this, "_ready", null);
    y(this, "_watchMap", /* @__PURE__ */ new Map());
    const e = window.indexedDB.open("FileSystemDB", 1);
    e.onerror = () => {
      console.error("Failed to open database");
    }, e.onsuccess = () => {
      var t;
      this.db = e.result, (t = this._ready) == null || t.call(this, this);
    }, e.onupgradeneeded = () => {
      this.db = e.result;
      const t = this.db.createObjectStore(
        "files",
        { keyPath: "id", autoIncrement: !0 }
      );
      t.createIndex("parentPath", "parentPath"), t.createIndex("path", "path", { unique: !0 }), t.add(
        new b(
          "/",
          "",
          "",
          "dir",
          "dir"
        )
      );
    };
  }
  async initFileSystem() {
    await this.whenReady();
  }
  serializeFileSystem() {
    return new Promise((e, t) => {
      const s = this.db.transaction("files", "readonly").objectStore("files").getAll();
      s.onerror = () => {
        t("Failed to read file");
      }, s.onsuccess = () => {
        e(s.result);
      };
    });
  }
  deserializeFileSystem(e) {
    return new Promise((t, a) => {
      const s = this.db.transaction("files", "readwrite").objectStore("files"), o = s.clear();
      o.onerror = () => {
        a("Failed to clear file");
      }, o.onsuccess = () => {
        e.forEach((i) => {
          s.add(i);
        }), t(void 0);
      };
    });
  }
  whenReady() {
    return this.db ? Promise.resolve(this) : new Promise((e, t) => {
      this._ready = e;
    });
  }
  registerWatcher(e, t) {
    this._watchMap.set(e, t);
  }
  commitWatch(e, t) {
    this._watchMap.forEach((a, n) => {
      n.test(e) && a(e, t);
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
    const n = this.db.transaction("files", "readonly").objectStore("files").index("path"), s = IDBKeyRange.only(e), o = n.get(s);
    return new Promise((i, l) => {
      o.onerror = () => {
        l("Failed to read file");
      }, o.onsuccess = () => {
        const r = o.result;
        i(r ? r.content : null);
      };
    });
  }
  /**
   * 写入文件内容到指定路径 不存在则创建，存在则覆盖
   * @param path 文件路径
   * @param content 文件内容
   */
  async writeFile(e, t) {
    let a = e.split("/").slice(0, -1).join("/");
    if (a === "" && (a = "/"), !await this.exists(a))
      return Promise.reject("Cannot write file to a non-exist path:" + e);
    let s = await this.stat(e);
    const i = this.db.transaction("files", "readwrite").objectStore("files");
    if (s) {
      const l = i.put(
        new b(
          e,
          s.parentPath,
          t.content,
          t.icon || s.icon,
          t.type || s.type,
          s.id
        )
      );
      return new Promise((r, d) => {
        l.onerror = () => {
          console.error("Failed to write file"), d("Failed to write file");
        }, l.onsuccess = () => {
          this.commitWatch(e, t.content), r();
        };
      });
    } else {
      const l = i.add(
        new b(
          e,
          a,
          t.content,
          t.icon,
          t.type
        )
      );
      return new Promise((r, d) => {
        l.onerror = () => {
          console.error("Failed to write file"), d("Failed to write file");
        }, l.onsuccess = () => {
          this.commitWatch(e, t.content), r();
        };
      });
    }
  }
  async appendFile(e, t) {
    const n = this.db.transaction("files", "readwrite").objectStore("files"), s = n.index("path"), o = IDBKeyRange.only(e), i = s.get(o);
    return new Promise((l, r) => {
      i.onerror = () => {
        console.error("Failed to read file"), r("Failed to read file");
      }, i.onsuccess = () => {
        const d = i.result;
        if (d) {
          d.content += t;
          const u = n.put(d);
          u.onerror = () => {
            console.error("Failed to write file"), r("Failed to write file");
          }, u.onsuccess = () => {
            this.commitWatch(e, d.content), l();
          };
        } else
          console.error("File not found"), r("File not found");
      };
    });
  }
  /**
  * 读取指定路径下的所有文件和文件夹
  * @param path 目录路径
  * @returns 文件和文件夹列表
  */
  async readdir(e) {
    const n = this.db.transaction("files", "readonly").objectStore("files").index("parentPath"), s = IDBKeyRange.only(e), o = n.getAll(s);
    return new Promise((i, l) => {
      o.onerror = () => {
        console.error("Failed to read directory"), l("Failed to read directory");
      }, o.onsuccess = () => {
        const r = o.result;
        i(r);
      };
    });
  }
  async exists(e) {
    try {
      const n = this.db.transaction("files", "readonly").objectStore("files").index("path"), s = IDBKeyRange.only(e), o = n.getAll(s);
      return new Promise((i, l) => {
        o.onerror = () => {
          console.error("Failed to read file"), l("Failed to read file");
        }, o.onsuccess = () => {
          const r = o.result;
          i(!!r.length);
        };
      });
    } catch {
      return !1;
    }
  }
  async stat(e) {
    const n = this.db.transaction("files", "readonly").objectStore("files").index("path"), s = IDBKeyRange.only(e), o = n.get(s);
    return new Promise((i, l) => {
      o.onerror = () => {
        console.error("Failed to read file"), l("Failed to read file");
      }, o.onsuccess = () => {
        const r = o.result;
        i(r);
      };
    });
  }
  /**
   * 删除指定路径的文件
   * @param path 文件路径
   */
  async unlink(e) {
    const a = this.db.transaction("files", "readwrite").objectStore("files"), n = a.index("path"), s = IDBKeyRange.only(e), o = n.get(s);
    return new Promise((i, l) => {
      o.onerror = () => {
        console.error("Failed to delete file"), l("Failed to delete file");
      }, o.onsuccess = () => {
        let r = o.result;
        r ? r.type === "dir" ? l("Cannot delete a directory") : (a.delete(o.result.id), this.commitWatch(e, r.content), i()) : l("File not found");
      };
    });
  }
  async rename(e, t) {
    const n = this.db.transaction("files", "readwrite").objectStore("files"), s = n.index("path"), o = IDBKeyRange.only(e), i = s.get(o);
    return new Promise((l, r) => {
      i.onerror = () => {
        r("Failed to read file");
      }, i.onsuccess = () => {
        const d = i.result;
        if (d) {
          let u = function(f, h, g) {
            f.type === "dir" ? (n.index("parentPath").openCursor(IDBKeyRange.only(f.path)).onsuccess = (F) => {
              let m = F.target.result;
              if (m) {
                let w = m.value, j = D(h, w.path.split("/").slice(-1)[0]);
                u(
                  w,
                  j,
                  h
                ), m.continue();
              }
            }, f.path = h, f.parentPath = g, n.put(f)) : (f.path = h, f.parentPath = g, n.put(f));
          };
          u(d, t, t.split("/").slice(0, -1).join("/"));
        }
        this.commitWatch(e, d.content), l();
      };
    });
  }
  /**
   * 删除指定路径的文件夹及其内容
   * @param path 文件夹路径
   */
  async rmdir(e) {
    const a = this.db.transaction("files", "readwrite").objectStore("files"), n = a.index("path"), s = IDBKeyRange.only(e), o = n.get(s);
    return new Promise((i, l) => {
      o.onerror = () => {
        l("Failed to read file");
      }, o.onsuccess = () => {
        const r = o.result;
        if (r) {
          let d = function(u) {
            u.type === "dir" && (a.index("parentPath").openCursor(IDBKeyRange.only(u.path)).onsuccess = (f) => {
              let h = f.target.result;
              if (h) {
                let g = h.value;
                d(g), h.continue();
              }
            }), a.index("path").openCursor(IDBKeyRange.only(u.path)).onsuccess = (f) => {
              let h = f.target.result;
              h && (a.delete(h.value.id), h.continue());
            };
          };
          d(r);
        }
        this.commitWatch(e, r.content), i();
      };
    });
  }
  /**
   * 创建新的文件夹
   * @param path 文件夹路径
   */
  async mkdir(e) {
    let t = e.split("/").slice(0, -1).join("/");
    if (t === "" && (t = "/"), !await this.exists(t))
      return console.error("Cannot create directory to a non-exist path:" + t), Promise.reject("Cannot create directory to a non-exist path:" + t);
    if (await this.exists(e))
      return Promise.resolve();
    const i = this.db.transaction("files", "readwrite").objectStore("files").add(
      new b(
        e,
        t,
        "",
        "dir",
        "dir"
      )
    );
    return new Promise((l, r) => {
      i.onerror = () => {
        console.error("Failed to create directory"), r("Failed to create directory");
      }, i.onsuccess = () => {
        this.commitWatch(e, ""), l();
      };
    });
  }
}
export {
  b as WebFile,
  I as WebFileSystem
};
