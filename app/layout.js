import { Inter } from "next/font/google";
import "./globals.css";
import Drawer from "./components/navbar/Drawer";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { SignInButton, UserButton } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  manifest: "./manifest.json",
  title: "54 BelRD",
  description: "54 Belmont Road finances app.",
};

export default async function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      secretKey={process.env.CLERK_SECRET_KEY}
    >
      <html lang="en" className="bg-white">
        <head>
          <link rel="manifest" href="./manifest.json" />
          <script
            src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
            defer
          ></script>
          <script>
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(
            {async function (OneSignal) {
              await OneSignal.init({
                appId: "69778e3f-6742-4ea4-9dd3-ea721a4e4158",
              });
            }}
            );
          </script>
        </head>

        <body className="bg-white">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <div className="align-top">
              <Drawer content={children} />
            </div>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
