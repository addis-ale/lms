import { parseAsString, createLoader } from "nuqs/server";

export const categoryParams = {
  category: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};
export const loadSearchParams = createLoader(categoryParams);
