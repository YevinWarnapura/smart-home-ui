import { useEffect, useRef, useState } from "react";
import mqtt from "mqtt";

interface TelemetryData {
  state: string;
  distance_cm: number;
  temperature?: number;
  humidity?: number;
}

export default function TelemetryPanel() {
  const client = useRef<mqtt.MqttClient | null>(null);

  const [connected, setConnected] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    state: "DISARMED",
    distance_cm: -1,
    temperature: undefined,
    humidity: undefined,
  });

  useEffect(() => {
    const url = "wss://s66a1a0e.ala.us-east-1.emqxsl.com:8084/mqtt";

    const c = mqtt.connect(url, {
      username: "homeGuard",
      password: "gurrKash67cutwater",
      reconnectPeriod: 1000,
    });

    client.current = c;

    c.on("connect", () => {
      console.log("Telemetry Connected");
      setConnected(true);
      c.subscribe("alarm/telemetry");
    });

    c.on("message", (topic, payload) => {
      if (topic === "alarm/telemetry") {
        try {
          const data = JSON.parse(payload.toString());
          setTelemetry((prev) => ({
            ...prev,
            ...data, // merges: state, distance, temp, humidity
          }));
        } catch (err) {
          console.error("Telemetry JSON error", err);
        }
      }
    });

    return () => {
      c.end();
    };
  }, []);

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-[340px] text-center mt-4">
      <h2 className="text-2xl font-semibold mb-4">Telemetry</h2>

      {!connected && (
        <p className="text-yellow-300 text-sm mb-3">Connecting to MQTT...</p>
      )}

      {/* Alarm State */}
      <div className="mb-6">
        <p className="text-gray-400 text-sm mb-1">Alarm State:</p>
        <p
          className={`text-xl font-bold ${
            telemetry.state === "ARMED"
              ? "text-red-400"
              : telemetry.state === "EXIT_DELAY"
              ? "text-yellow-400"
              : "text-green-400"
          }`}
        >
          {telemetry.state}
        </p>
      </div>

      {/* Distance */}
      <div className="mb-6">
        <p className="text-gray-400 text-sm mb-1">Motion Sensor (cm):</p>
        <p className="text-lg">{telemetry.distance_cm}</p>
      </div>

      {/* Temperature */}
      <div className="mb-6">
        <p className="text-gray-400 text-sm mb-1">Temperature:</p>
        <p className="text-lg">
          {telemetry.temperature !== undefined ? telemetry.temperature + "°C" : "-"}
        </p>
      </div>

      {/* Humidity */}
      <div>
        <p className="text-gray-400 text-sm mb-1">Humidity:</p>
        <p className="text-lg">
          {telemetry.humidity !== undefined ? telemetry.humidity + "%" : "-"}
        </p>
      </div>
    </div>
  );
}
