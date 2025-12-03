import { useEffect, useRef, useState } from "react";
import mqtt from "mqtt";

export default function AlarmControl() {
  const client = useRef<mqtt.MqttClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [alarmState, setAlarmState] = useState("DISARMED");
  const [locked, setLocked] = useState(false);

  // -------------------------------
  // MQTT CONNECTION
  // -------------------------------
  useEffect(() => {
    const url = "wss://s66a1a0e.ala.us-east-1.emqxsl.com:8084/mqtt";

    const options: mqtt.IClientOptions = {
      username: "homeGuard",
      password: "gurrKash67cutwater",
      reconnectPeriod: 1000,
    };

    const c = mqtt.connect(url, options);
    client.current = c;

    c.on("connect", () => {
      setConnected(true);
      console.log("Connected to MQTT");
      c.subscribe("alarm/telemetry");
    });

    c.on("message", (topic, payload) => {
      if (topic === "alarm/telemetry") {
        try {
          const data = JSON.parse(payload.toString());
          setAlarmState(data.state);
          setLocked(data.state === "ARMED");
        } catch (err) {
          console.error("JSON parse error:", err);
        }
      }
    });

    return () => {
      c.end();
    };
  }, []);

  // -------------------------------
  // PUBLISH ARM/DISARM
  // -------------------------------
  const toggleAlarm = () => {
    if (!client.current) return;

    const cmd = locked ? "DISARM" : "ARM";
    client.current.publish("alarm/cmd", cmd);

    console.log("Sent:", cmd);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-[340px] text-center">
      <h2 className="text-2xl font-semibold mb-4">Alarm Control</h2>

      <div className="mb-6">
        <p className="text-gray-400 text-sm mb-1">System Status:</p>

        <p
          className={`text-xl font-bold ${
            alarmState === "ARMED"
              ? "text-red-400"
              : alarmState === "EXIT_DELAY"
              ? "text-yellow-400"
              : "text-green-400"
          }`}
        >
          {alarmState}
        </p>
      </div>

      {/* SLIDER BUTTON */}
      <div
        className={`relative w-20 h-10 mx-auto rounded-full transition-all cursor-pointer ${
          locked ? "bg-red-500" : "bg-green-500"
        }`}
        onClick={toggleAlarm}
      >
        <div
          className={`absolute top-1 w-8 h-8 rounded-full bg-white transition-all ${
            locked ? "right-1" : "left-1"
          }`}
        ></div>
      </div>

      <p className="text-sm mt-3 text-gray-400">
        {locked ? "Tap to DISARM" : "Tap to ARM"}
      </p>

      {!connected && (
        <p className="mt-4 text-yellow-300 text-sm">Connecting to MQTT...</p>
      )}
    </div>
  );
}
