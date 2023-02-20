import http from "node:http";
import * as CUIT from "./cuit";
import { availabilty } from "./middleware/availability";
import { StoreEntry } from "./storage/entry.model";
import { storage } from "./storage";
const hostname = "0.0.0.0";
const users: Partial<{ [key: string]: Date }> = {};

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.statusCode = 200;
  if (req.url === "/favicon.ico") {
    return res.end();
  }
  if (req.url?.length! <= 1) {
    return res.end(JSON.stringify({ error: "Sin argumento de búsqueda" }));
  }
  let lastRequestInterval = availabilty(users, req);
  if (lastRequestInterval < 0) {
    return res.end(
      JSON.stringify({
        error: `Recurso no disponible, debe esperar ${(
          (lastRequestInterval * -1) /
          1000
        ).toFixed(0)} segundos`,
      })
    );
  }
  let validationOK = false;
  let searchResult: string;
  let response: string = JSON.stringify({ error: "Sin retorno" });
  if (req.url) {
    let cuit = req.url.slice(1);
    validationOK = CUIT.validate(cuit);
    if (validationOK) {
      const inStorageSearchResult: string | undefined = await storage.search(
        cuit
      );
      if (inStorageSearchResult) {
        let searchResult: StoreEntry = JSON.parse(inStorageSearchResult);
        const expirationDate = new Date(searchResult.expirationDate);
        if (new Date() < expirationDate) {
          response = JSON.stringify(searchResult.entry);
          return res.end(response);
        }
      }
      try {
        searchResult = await CUIT.search(cuit);
        response = JSON.stringify(CUIT.parseResponse(searchResult));
        storage.save(searchResult);
      } catch (e: any) {
        res.statusCode = 500;
        response = JSON.stringify({
          error: e.message,
        });
      }
    }
  }
  res.end(response);
});
server.listen(3000, hostname, () => {});
