import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserView } from "@/app/modules/browser/ui/views/browser-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/lib/params";

interface Props {
  filterParams: Promise<SearchParams>;
}
const BrowsePage = async ({ filterParams }: Props) => {
  const filter = await loadSearchParams(filterParams);
  // TODO filter with category
  const queryClient = getQueryClient();
  await Promise.all([
    void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions()),
    void queryClient.prefetchQuery(
      trpc.browseCourse.getMany.queryOptions({
        search: filter.search,
        categoryId: filter.category,
      })
    ),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>loading</p>}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <BrowserView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default BrowsePage;
