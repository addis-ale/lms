"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  courseId: string;
  price: number;
}

export const CourseEnrollButton = ({ courseId, price }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const trpc = useTRPC();
  const checkout = useMutation(
    trpc.payment.createCheckout.mutationOptions({
      onSuccess: async (data) => {
        if (data?.url) {
          window.location.assign(data.url);
        } else {
          toast.error("Checkout URL not found.");
        }
      },
      onError: () => {},
    })
  );
  const onClick = async () => {
    try {
      setIsLoading(true);
      checkout.mutate({ courseId });
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size={"sm"}
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price)}{" "}
    </Button>
  );
};
