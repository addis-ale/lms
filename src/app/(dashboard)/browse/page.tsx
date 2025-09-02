import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { headers } from "next/headers";
import { SearchParams } from "nuqs";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserView } from "@/app/modules/browser/ui/views/browser-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { loadSearchParams } from "@/lib/params";
import { auth } from "@/lib/auth";

interface Props {
  filterParams: Promise<SearchParams>;
}
const BrowsePage = async ({ filterParams }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  const filter = await loadSearchParams(filterParams);
  // TODO protected page
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
