import { standardize } from "../cuit";
import { readFile } from "fs/promises";
export async function search(cuit: string) {
  let response = undefined;
  const folder = cuit.slice(0, 2);
  let fileName = standardize(cuit) + ".json";
  try {
    const entry = await readFile(`./cache/${folder}/${fileName}`);
    response = entry.toString();
  } catch (e) {
    //handle error
  }
  return response;
}
