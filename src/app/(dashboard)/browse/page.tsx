import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserView } from "@/app/modules/browser/ui/views/browser-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/app/modules/browser/params";
interface Props {
  categoryParams: Promise<SearchParams>;
}
const BrowsePage = async ({ categoryParams }: Props) => {
  const category = await loadSearchParams(categoryParams);
  // TODO filter with category
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
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
