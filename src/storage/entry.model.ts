import { sociedad } from "../cuit/sociedad.model";
export interface StoreEntry {
  expirationDate: Date | string;
  entry: sociedad;
}
