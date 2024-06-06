import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ServerSideBar } from "@/components/server/server-sidebar";

import { auth } from "@clerk/nextjs/server";

interface ServerIdLayoutProps {
  children: React.ReactNode;
  params: { serverId: string };
}

const ServerIdLayout = async ({ children, params }: ServerIdLayoutProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
    return null;
  }

  const profile = await currentProfile();

  if (!profile) {
    redirect("/sign-in"); // Ensure they sign in to create a profile
    return null;
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    // redirect("/");
    return null;
  }

  return (
    <div className='h-full'>
      <div className='hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 selection:bg-indigo-500/40'>
        <ServerSideBar serverId={params.serverId} />
      </div>
      <main className='h-full md:pl-60'>{children}</main>
    </div>
  );
};

export default ServerIdLayout;
