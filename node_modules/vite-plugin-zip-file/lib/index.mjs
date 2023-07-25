import r from "path";
import n from "fs";
import { createRequire as P } from "node:module";
const Z = P(import.meta.url), i = r.sep, b = {
  enabled: !0,
  folderPath: "",
  outPath: "",
  zipName: ""
}, F = (h) => {
  let y = {
    ...b,
    ...h
  }, { enabled: p, folderPath: s, outPath: c, zipName: e } = y;
  if (p = Boolean(p), !s || !c)
    throw new Error("config.folderPath and config.outPath is required.");
  s = r.resolve(s), c = r.resolve(c), e = e || s.split(i).pop() + ".zip";
  const S = () => {
    const g = Z("jszip"), f = new g(), u = function(o, t, l = "") {
      const z = n.readdirSync(t);
      l += t.split(i).pop() + i, z.forEach((m) => {
        const a = r.join(t, i, m);
        n.statSync(a).isDirectory() ? u(o, a, l) : o.file(l + m, n.readFileSync(a));
      });
    }, d = (o = e) => {
      const t = r.join(c, i + o);
      n.existsSync(t) && n.unlinkSync(t);
    }, v = function() {
      u(f, s), f.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9
        }
      }).then((o) => {
        d(e), n.writeFileSync(r.join(c, i, e), o);
      });
    };
    d(e), v();
  };
  return {
    name: "vite-plugin-zip-file",
    apply: "build",
    closeBundle() {
      !p || S();
    }
  };
};
export {
  F as viteZip
};
