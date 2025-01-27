// app/cursuri/online/page.tsx
import OnlineCourseClient from '@/components/OnlineCourseClient';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnlineCoursePage() {
  const { userId } = await auth();

 
  const user = userId ? await clerkClient.users.getUser(userId) : null;
 
  // if (!userId) redirect("/");
  
  return <OnlineCourseClient hasAccess={!userId ? false : user.publicMetadata.hasCourseAccess} />;
}