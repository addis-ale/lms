import { parseAsString, useQueryStates } from "nuqs";

export const useCategoryFilter = () => {
  return useQueryStates({
    category: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
  });
};
