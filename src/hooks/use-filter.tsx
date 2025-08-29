import { parseAsString, useQueryStates } from "nuqs";
export const useFilter = () => {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    category: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
  });
};
