import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isTeacher } from "@/lib/teacher";

interface Props {
  children: React.ReactNode;
}
const Layout = async ({ children }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !isTeacher(session.user.id)) {
    redirect("/");
  }
  return <>{children}</>;
};
export default Layout;
