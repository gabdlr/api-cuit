import { writeFile, mkdir } from "node:fs/promises";
import { parseResponse, standardize } from "../cuit";
import { StoreEntry } from "./entry.model";
export function save(searchResult: string) {
  const result = parseResponse(searchResult);
  const cuit = result.sociedad.cuit;
  const path = cuit.slice(0, 2);

  const fileName = standardize(cuit);
  const currentDate = new Date();
  const newEntry: StoreEntry = {
    expirationDate: new Date(currentDate.setMonth(currentDate.getMonth() + 3)),
    entry: result,
  };
  mkdir(`./cache/${path}`).finally(() =>
    writeFile(`./cache/${path}/${fileName}.json`, JSON.stringify(newEntry))
  );
}
