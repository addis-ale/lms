import Stripe from "stripe";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { db } from "@/db";
import { courses, purchase, StripeCustomer } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { stripe } from "@/lib/stripe";

export const paymentRoute = createTRPCRouter({
  createCheckout: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [course] = await db
        .select()
        .from(courses)
        .where(
          and(eq(courses.id, input.courseId), eq(courses.isPublished, true))
        );
      const [purchased] = await db
        .select()
        .from(purchase)
        .where(
          and(
            eq(purchase.courseId, input.courseId),
            eq(purchase.userId, ctx.auth.user.id)
          )
        );
      if (purchased) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Course already purchased",
        });
      }
      if (!course) {
        throw new TRPCError({ code: "NOT_FOUND", message: "course not found" });
      }
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description!,
            },
            unit_amount: Math.round(+course.price! * 100),
          },
        },
      ];
      let [getStripeCustomer] = await db
        .select()
        .from(StripeCustomer)
        .where(and(eq(StripeCustomer.userId, ctx.auth.user.id)));
      if (!getStripeCustomer) {
        const customer = await stripe.customers.create({
          email: ctx.auth.user.email,
        });
        [getStripeCustomer] = await db
          .insert(StripeCustomer)
          .values({
            userId: ctx.auth.user.id,
            stripeCustomerId: customer.id,
          })
          .returning();
      }
      const session = await stripe.checkout.sessions.create({
        customer: getStripeCustomer.stripeCustomerId,
        line_items,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
        metadata: {
          courseId: course.id,
          userId: ctx.auth.user.id,
        },
      });
      return { id: session.id, url: session.url };
    }),
});
