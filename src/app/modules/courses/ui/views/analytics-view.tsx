"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataCard } from "../components/data-card";
import { Chart } from "../components/chart";

export const AnalyticsView = () => {
  const trpc = useTRPC();
  const { data: myAnalytics } = useSuspenseQuery(
    trpc.analytics.getAnalytics.queryOptions()
  );

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <DataCard
          label="Total Revenue"
          value={myAnalytics.totalRevenue}
          shouldFormat
        />
        <DataCard label="Total Sales" value={myAnalytics.totalSales} />
      </div>
      <Chart data={myAnalytics.data} />
    </div>
  );
};
