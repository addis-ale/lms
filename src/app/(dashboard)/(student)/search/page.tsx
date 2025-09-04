import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { SearchParams } from "nuqs";
import { ErrorBoundary } from "react-error-boundary";
import {
  BrowserView,
  BrowserViewError,
  BrowserViewLoading,
} from "@/app/modules/browser/ui/views/browser-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { loadSearchParams } from "@/lib/params";

type PageProps = {
  searchParams: Promise<SearchParams>;
};
const BrowsePage = async ({ searchParams }: PageProps) => {
  const { search, category } = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();
  await Promise.all([
    void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions()),
    void queryClient.prefetchQuery(
      trpc.browseCourse.getMany.queryOptions({
        search: search,
        categoryId: category,
      })
    ),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<BrowserViewLoading />}>
        <ErrorBoundary fallback={<BrowserViewError />}>
          <BrowserView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default BrowsePage;
