import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  HomeView,
  HomeViewError,
  HomeViewLoading,
} from "../../modules/home/ui/views/home-view";

export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.dashboardCourse.getMany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<HomeViewLoading />}>
        <ErrorBoundary fallback={<HomeViewError />}>
          <HomeView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
