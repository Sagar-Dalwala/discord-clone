// import { NextResponse } from "next/server";
// import { DirectMessage } from "@prisma/client";

// import { db } from "@/lib/db";
// import { currentProfile } from "@/lib/current-profile";

// const MESSAGE_BATCH = 10;

// export async function GET(req: Request) {
//   try {
//     const profile = await currentProfile();
//     const { searchParams } = new URL(req.url);

//     const cursor = searchParams.get("cursor");
//     const conversationId = searchParams.get("conversationId");

//     if (!profile) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     if (!conversationId) {
//       return new NextResponse("Conversation ID not found", { status: 400 });
//     }

//     let messages: DirectMessage[] = [];

//     if (cursor) {
//       messages = await db.directMessage.findMany({
//         take: MESSAGE_BATCH,
//         skip: 1,
//         cursor: {
//           id: cursor,
//         },
//         where: {
//           conversationId,
//         },
//         include: {
//           member: {
//             include: {
//               profile: true,
//             },
//           },
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       });
//     } else {
//       messages = await db.directMessage.findMany({
//         take: MESSAGE_BATCH,
//         where: {
//           conversationId,
//         },
//         include: {
//           member: {
//             include: {
//               profile: true,
//             },
//           },
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       });
//     }

//     let nextCursor = null;

//     if (messages.length === MESSAGE_BATCH) {
//       nextCursor = messages[MESSAGE_BATCH - 1].id;
//     }

//     return NextResponse.json({ items: messages, nextCursor });
//   } catch (error) {
//     console.log("error in direct-messages route: ", error);

//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { DirectMessage } from "@prisma/client";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

const MESSAGE_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID not found" }, { status: 400 });
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId: conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        where: {
          conversationId: conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.error("Error in direct-messages route: ", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
