import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  courseMediaUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    video: { maxFileSize: "128MB", maxFileCount: 1 },
    pdf: { maxFileSize: "32MB", maxFileCount: 1 }
  })
    .middleware(async () => {
      const user = await auth();
      if (!user.userId) throw new Error("Unauthorized");
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  avatarUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await auth();
      if (!user.userId) throw new Error("Unauthorized");
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar upload complete for userId:", metadata.userId);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
