import mqtt, { MqttClient } from "mqtt";

const BROKER_URL = "wss://s66a1a0e.ala.us-east-1.emqxsl.com:8084/mqtt";
const USERNAME = "homeGuard";
const PASSWORD = "gurrKash67cutwater";

export function connectMQTT(
  onTelemetry: (data: { state: string; distance_cm: number }) => void
): MqttClient {
  const client = mqtt.connect(BROKER_URL, {
    username: USERNAME,
    password: PASSWORD,
    clean: true,
    reconnectPeriod: 2000,
  });

  client.on("connect", () => {
    console.log("MQTT Connected!");
    client.subscribe("alarm/telemetry");
  });

  client.on("message", (topic, message) => {
    if (topic === "alarm/telemetry") {
      try {
        onTelemetry(JSON.parse(message.toString()));
      } catch (err) {
        console.error("Error parsing telemetry:", err);
      }
    }
  });

  client.on("error", (err) => {
    console.error("MQTT Error:", err);
  });

  return client;
}

export function sendCommand(client: MqttClient, cmd: "ARM" | "DISARM") {
  client.publish("alarm/cmd", cmd);
}
