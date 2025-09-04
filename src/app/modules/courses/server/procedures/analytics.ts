import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { courses, purchase } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
const groupByCourse = (purchased: (typeof courses.$inferSelect)[]) => {
  const grouped: {
    [courseTitle: string]: number;
  } = {};
  purchased.forEach((pur) => {
    const courseTitle = pur.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += +pur.price!;
  });
  return grouped;
};
export const analyticsRoute = createTRPCRouter({
  getAnalytics: protectedProcedure.query(async ({ ctx }) => {
    const myCourses = await db
      .select()
      .from(courses)
      .where(
        and(eq(courses.userId, ctx.auth.user.id), eq(courses.isPublished, true))
      );
    const mycoursesIds = myCourses.map((course) => course.id);
    const purchased = await db
      .select()
      .from(purchase)
      .where(
        and(
          eq(purchase.userId, ctx.auth.user.id),
          inArray(purchase.courseId, mycoursesIds)
        )
      );
    const myPurchasedCoursesIds = purchased.map((pur) => pur.courseId);
    const purchasedCourses = myCourses.filter((course) =>
      myPurchasedCoursesIds.includes(course.id)
    );
    const groupedEarning = groupByCourse(purchasedCourses);
    const data = Object.entries(groupedEarning).map(([courseTitle, total]) => ({
      name: courseTitle,
      total,
    }));
    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchasedCourses.length;
    return { data, totalRevenue, totalSales };
  }),
});
