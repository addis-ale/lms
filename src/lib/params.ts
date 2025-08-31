import { parseAsString, createLoader } from "nuqs/server";

export const filterParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  category: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  teacher: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};
export const loadSearchParams = createLoader(filterParams);
