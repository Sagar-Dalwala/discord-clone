// // import { redirect } from "next/navigation";

// // import { db } from "@/lib/db";
// // import { currentProfile } from "@/lib/current-profile";
// // import { ChatHeader } from "@/components/chat/chat-header";
// // import { ChatInput } from "@/components/chat/chat-input";

// // interface ChannelIdPageProps {
// //   params: {
// //     serverId: string;
// //     channelId: string;
// //   };
// // }

// // const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
// //   const profile = await currentProfile();

// //   if (!profile) {
// //     redirect("/sign-in");
// //     return null;
// //   }

// //   const channel = await db.channel.findUnique({
// //     where: {
// //       id: params.channelId,
// //     },
// //   });

// //   const member = await db.member.findFirst({
// //     where: {
// //       serverId: params.serverId,
// //       profileId: profile.id,
// //     },
// //   });

// //   if (!channel || !member) {
// //     redirect("/");
// //     return null;
// //   }

// //   return (
// //     <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
// //       <ChatHeader
// //         name={channel.name}
// //         serverId={params.serverId}
// //         type='channel'
// //       />
// //       <div className='flex-1 overflow-y-auto'>Future Messages</div>
// //       <ChatInput
// //         name={channel.name}
// //         type='channel'
// //         apiUrl='/api/socket/messages'
// //         query={{
// //           channelId: channel.id,
// //           serverId: channel.serverId,
// //         }}
// //       />
// //     </div>
// //   );
// // };

// // export default ChannelIdPage;

// import { redirect } from "next/navigation";
// import { channelType as ChannelType } from "@prisma/client";

// import { db } from "@/lib/db";
// import { currentProfile } from "@/lib/current-profile";

// import { ChatHeader } from "@/components/chat/chat-header";
// import { ChatInput } from "@/components/chat/chat-input";
// import { ChatMessages } from "@/components/chat/chat-messages";
// import { MediaRoom } from "@/components/media-room";

// interface ChannelIdPageProps {
//   params: {
//     serverId: string;
//     channelId: string;
//   };
// }

// const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
//   const profile = await currentProfile();

//   if (!profile) {
//     redirect("/sign-in");
//     return null;
//   }

//   const channel = await db.channel.findUnique({
//     where: {
//       id: params.channelId,
//     },
//   });

//   const member = await db.member.findFirst({
//     where: {
//       serverId: params.serverId,
//       profileId: profile.id,
//     },
//   });

//   if (!channel || !member) {
//     redirect("/");
//     return null;
//   }

//   return (
//     <div className='bg-white dark:bg-[#313338] flex flex-col h-screen'>
//       <ChatHeader
//         name={channel.name}
//         serverId={params.serverId}
//         type='channel'
//       />
//       <div className='flex flex-col flex-1 overflow-y-auto'>
//         {channel.type === ChannelType.TEXT && (
//           <>
//             <ChatMessages
//               name={channel.name}
//               member={member}
//               chatId={channel.id}
//               type='channel'
//               apiUrl='/api/messages'
//               socketUrl='/api/socket/messages'
//               socketQuery={{
//                 channelId: channel.id,
//                 serverId: channel.serverId,
//               }}
//               paramKey='channelId'
//               paramValue={channel.id}
//             />

//             <ChatInput
//               name={channel.name}
//               type='channel'
//               apiUrl='/api/socket/messages'
//               query={{
//                 channelId: channel.id,
//                 serverId: channel.serverId,
//               }}
//             />
//           </>
//         )}

//         {channel.type === ChannelType.AUDIO && (
//           <MediaRoom 
//             chatId={channel.id}
//             video={false}
//             audio={true}
//           />
//         )}
//         {channel.type === ChannelType.VIDEO && (
//           <MediaRoom 
//             chatId={channel.id}
//             video={true}
//             audio={true}
//           />
//         )}

//       </div>
//     </div>
//   );
// };

// export default ChannelIdPage;

import { redirect } from "next/navigation";
import { channelType as ChannelType } from "@prisma/client";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  try {
    const profile = await currentProfile();

    if (!profile) {
      redirect("/sign-in");
      return null;
    }

    const channel = await db.channel.findUnique({
      where: {
        id: params.channelId,
      },
    });

    if (!channel) {
      console.error(`Channel not found: ${params.channelId}`);
      redirect("/");
      return null;
    }

    const member = await db.member.findFirst({
      where: {
        serverId: params.serverId,
        profileId: profile.id,
      },
    });

    if (!member) {
      console.error(`Member not found for server: ${params.serverId}, profile: ${profile.id}`);
      redirect("/");
      return null;
    }

    return (
      <div className='bg-white dark:bg-[#313338] flex flex-col h-screen'>
        <ChatHeader
          name={channel.name}
          serverId={params.serverId}
          type='channel'
        />
        <div className='flex flex-col flex-1 overflow-y-auto'>
          {channel.type === ChannelType.TEXT && (
            <>
              <ChatMessages
                name={channel.name}
                member={member}
                chatId={channel.id}
                type='channel'
                apiUrl='/api/messages'
                socketUrl='/api/socket/messages'
                socketQuery={{
                  channelId: channel.id,
                  serverId: channel.serverId,
                }}
                paramKey='channelId'
                paramValue={channel.id}
              />
              <ChatInput
                name={channel.name}
                type='channel'
                apiUrl='/api/socket/messages'
                query={{
                  channelId: channel.id,
                  serverId: channel.serverId,
                }}
              />
            </>
          )}

          {channel.type === ChannelType.AUDIO && (
            <MediaRoom 
              chatId={channel.id}
              video={false}
              audio={true}
            />
          )}
          {channel.type === ChannelType.VIDEO && (
            <MediaRoom 
              chatId={channel.id}
              video={true}
              audio={true}
            />
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in ChannelIdPage:", error);
    redirect("/error");
    return null;
  }
};

export default ChannelIdPage;
