import https from "node:https";
import { standardize } from "./standardize";
export function search(numeroCuit: string) {
  numeroCuit = standardize(numeroCuit);
  const url = `https://argentina.gob.ar/justicia/registro-nacional-sociedades?cuit=${numeroCuit}&razon=`;
  function getData(url: string, resolve: Function, reject: Function) {
    https
      .get(url, (res) => {
        const data: Uint8Array[] = [];
        if (res.statusCode === 301) {
          return getData(res.headers.location!, resolve, reject);
        }
        res.on("data", (chunk) => data.push(chunk));
        res.on("end", () => resolve(Buffer.concat(data).toString()));
      })
      .on("error", () =>
        reject(new Error("Error al intentar hacer la conexión"))
      );
  }

  return new Promise<string>((resolve, reject) =>
    getData(url, resolve, reject)
  );
}
