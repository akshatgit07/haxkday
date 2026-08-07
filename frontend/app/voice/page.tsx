import { IOSDevice } from "@/components/ios/IOSDevice";
import AnalystScreen from "@/components/voice-analyst/AnalystScreen";
import { caprasimo, figtree } from "@/lib/fonts";
import "@/styles/organic-theme.css";

export default function VoiceAnalystPage() {
  return (
    <div
      className={`organic-theme ${caprasimo.variable} ${figtree.variable}`}
      style={{ display: "flex", justifyContent: "center", padding: "36px 12px", background: "#e9e2d3", minHeight: "100vh" }}
    >
      <IOSDevice>
        <AnalystScreen />
      </IOSDevice>
    </div>
  );
}
