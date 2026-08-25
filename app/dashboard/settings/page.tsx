"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { Loader2, Camera, Bell, Mail, Check } from "lucide-react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { updateStudentProfile } from "@/lib/student-service";

type ProfileFormValues = {
  name: string;
};

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.fullName || "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user?.id) return;
    setSaving(true);
    try {
      await updateStudentProfile(user.id, values.name, avatarUrl || undefined);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-primary" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto py-10 space-y-10 pb-20"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="pt-4">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary">Profile & Settings</h1>
        <p className="text-text-secondary mt-2">Manage your account details and preferences.</p>
      </motion.div>

      {/* Profile Card */}
      <motion.section
        variants={itemVariants}
        className="bg-surface border border-border rounded-2xl p-8 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-text-primary mb-6">Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border bg-background">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Current avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <Camera className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-sm">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary mb-1">Profile Picture</p>
              <p className="text-xs text-text-muted mb-3">JPG, PNG or GIF. Max size 4MB.</p>
              <UploadButton<OurFileRouter, "avatarUploader">
                endpoint="avatarUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]?.ufsUrl) setAvatarUrl(res[0].ufsUrl);
                }}
                onUploadError={(error) => console.error("Upload error:", error)}
                appearance={{
                  button: "bg-background border border-border text-text-secondary hover:bg-background/80 text-sm font-semibold rounded-full px-4 py-2 transition-colors",
                  allowedContent: "hidden",
                }}
                content={{ button: "Upload Photo" }}
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
              Display Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="text-error text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email (read-only from Clerk) */}
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={user?.primaryEmailAddress?.emailAddress || ""}
              disabled
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-muted cursor-not-allowed opacity-60"
            />
            <p className="text-xs text-text-muted">Email cannot be changed here. Manage it in your account settings.</p>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 px-6 py-2.5 rounded-full font-semibold transition-all active:scale-[0.98]"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? "Saving…" : "Save Changes"}
            </button>

            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-success font-medium text-sm"
              >
                <Check className="w-4 h-4" />
                Saved!
              </motion.div>
            )}
          </div>
        </form>
      </motion.section>

      {/* Notification Preferences */}
      <motion.section
        variants={itemVariants}
        className="bg-surface border border-border rounded-2xl p-8 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-text-primary mb-2">Notifications</h2>
        <p className="text-text-secondary text-sm mb-6">Control what emails and alerts you receive.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-info/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-info" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Email Notifications</p>
                <p className="text-xs text-text-muted">Announcements, new classes, and updates</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                emailNotifications ? "bg-primary" : "bg-border"
              }`}
              aria-label="Toggle email notifications"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  emailNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-warning" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Class Reminders</p>
                <p className="text-xs text-text-muted">Get reminded 1 hour before live sessions</p>
              </div>
            </div>
            <button
              type="button"
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-border cursor-not-allowed opacity-50"
              disabled
              aria-label="Coming soon"
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow translate-x-1" />
            </button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
