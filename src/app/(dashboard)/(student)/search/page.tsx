// src/app/(dashboard)/(student)/search/page.tsx

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  BrowserView,
  BrowserViewError,
  BrowserViewLoading,
} from "@/app/modules/browser/ui/views/browser-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { loadSearchParams } from "@/lib/params";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filter = loadSearchParams(searchParams); // let your util parse it

  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(trpc.categories.getMany.queryOptions()),
    queryClient.prefetchQuery(
      trpc.browseCourse.getMany.queryOptions({
        search: filter.search,
        categoryId: filter.category,
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
}
