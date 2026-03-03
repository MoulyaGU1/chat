import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
