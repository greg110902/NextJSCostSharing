"use client";

import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";

export default function PushClient() {
  const [pushInit, setPushInit] = useState(false);
  useEffect(() => {
    try {
      OneSignal.init({ appId: "69778e3f-6742-4ea4-9dd3-ea721a4e4158" }).then(
        () => {
          setPushInit(true);
        }
      );
    } catch {
      console.log("Failed to init OneSignal");
    }
  });

  if (pushInit) {
    return <>{OneSignal.Slidedown.promptPush()}</>;
  }
}
