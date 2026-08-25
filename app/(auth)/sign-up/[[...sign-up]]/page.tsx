import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <SignUp />
    </div>
  );
}
