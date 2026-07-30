import { Caprasimo, Figtree } from "next/font/google";

import { IOSDevice } from "@/components/ios/IOSDevice";
import AnalystScreen from "@/components/voice-analyst/AnalystScreen";
import "@/components/voice-analyst/tokens.css";

const caprasimo = Caprasimo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caprasimo",
});

const figtree = Figtree({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-figtree",
});

export default function VoiceAnalystPage() {
  return (
    <div
      className={`${caprasimo.variable} ${figtree.variable}`}
      style={{ display: "flex", justifyContent: "center", padding: "36px 12px", background: "#e9e2d3", minHeight: "100vh" }}
    >
      <IOSDevice>
        <AnalystScreen />
      </IOSDevice>
    </div>
  );
}
