// app/cursuri/online/page.tsx
import OnlineCourseClient from '@/components/OnlineCourseClient';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { auth } from "@clerk/nextjs/server";

// Type for user metadata
type UserMetadata = {
  hasCourseAccess?: boolean;
  // hasBonusAccess?: boolean;
};

export default async function OnlineCoursePage() {
  const { userId } = await auth();

  // Get user and check for course access with proper type checking
  let hasAccess = false;
  // let hasBonusAccess =false;
  if (userId) {
    try {
      const user = await clerkClient.users.getUser(userId);
      const metadata = user.publicMetadata as UserMetadata;
      hasAccess = metadata.hasCourseAccess ?? false;
      // hasBonusAccess =metadata.hasBonusAccess ?? false;
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
  
  return <OnlineCourseClient hasAccess={hasAccess}  />;
}