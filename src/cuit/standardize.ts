export function standardize(cuit: string) {
  return cuit.length > 11 ? cuit.replace(/-/g, "").slice(0, 11) : cuit;
}
