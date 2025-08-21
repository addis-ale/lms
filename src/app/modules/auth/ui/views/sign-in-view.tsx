"use client";
import { z } from "zod";
import { OctagonAlert } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Image from "next/image";
type FieldName = "email" | "password";
const formFields: Array<{
  name: FieldName;
  formLabel: string;
  inputType: string;
  inputPlaceholder: string;
}> = [
  {
    name: "email",
    formLabel: "Email",
    inputType: "email",
    inputPlaceholder: "Enter your email",
  },
  {
    name: "password",
    formLabel: "Password",
    inputType: "password",
    inputPlaceholder: "Enter your password",
  },
];
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is Required" }),
});

export const SignInView = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome Back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your account
                  </p>
                </div>
                {formFields.map((item) => (
                  <div className="grid gap-3" key={item.name}>
                    <FormField
                      control={form.control}
                      name={item.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{item.formLabel}</FormLabel>
                          <FormControl>
                            <Input
                              type={item.inputType}
                              placeholder={item.inputPlaceholder}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                {true && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlert className="h-4 w-4 !text-destructive" />
                    <AlertTitle>Error</AlertTitle>
                  </Alert>
                )}
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
                <div className=" relative text-center text-sm after:flex after:items-center after:absolute after:inset-0 after:top-1/2 after:border-border after:border-t after:z-0">
                  <span className="px-2 z-10 bg-card text-muted-foreground relative">
                    Or continue with
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant={"outline"} type="button" className="w-full">
                    <FaGoogle />
                  </Button>
                  <Button variant={"outline"} type="button" className="w-full">
                    <FaGithub />
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos; have an account?{" "}
                  <Link
                    href={"/sign-up"}
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <Image
              src="/logo.svg"
              alt="logo"
              className="h-[92px] w-[92px]"
              width={92}
              height={92}
            />
            <p className="text-2xl font-semibold text-white">SkillUp</p>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to out <a href="">Terms of Service</a>{" "}
        and <a href="">Privacy Policy</a>
      </div>
    </div>
  );
};
