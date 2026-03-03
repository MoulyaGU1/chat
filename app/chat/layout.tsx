import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
