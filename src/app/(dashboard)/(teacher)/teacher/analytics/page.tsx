import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AnalyticsView } from "@/app/modules/courses/ui/views/analytics-view";
import { getQueryClient, trpc } from "@/trpc/server";

const AnalyticsPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.analytics.getAnalytics.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading</p>}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <AnalyticsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default AnalyticsPage;
