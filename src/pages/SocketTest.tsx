import { useEffect, useState } from "react";
import { useSocketNotifications } from "@/hooks/useSocketNotifications";
import socketService from "@/services/socketService";
import { useAuthStore } from "@/store/authStore";

const SocketTestPage = () => {
  const { isConnected } = useSocketNotifications();
  const { user, isAuthenticated } = useAuthStore();
  const [logs, setLogs] = useState<string[]>([]);
  const [socketId, setSocketId] = useState<string>("");

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 20));
  };

  useEffect(() => {
    if (isConnected) {
      const socket = socketService.getSocket();
      if (socket) {
        setSocketId(socket.id || "");
        addLog(`✅ Connected with ID: ${socket.id}`);
      }
    } else {
      setSocketId("");
      addLog("❌ Disconnected");
    }
  }, [isConnected]);

  const handleTestPing = () => {
    socketService.emit("ping");
    addLog("📤 Sent ping");

    socketService.on("pong", (data: any) => {
      addLog(`📥 Received pong: ${JSON.stringify(data)}`);
    });
  };

  const handleReconnect = () => {
    if (isAuthenticated && user) {
      socketService.disconnect();
      addLog("🔌 Manually disconnected");
      setTimeout(() => {
        socketService.connect();
        addLog("🔄 Reconnecting...");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Socket.IO Test Dashboard
        </h1>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  isConnected
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isConnected ? "✅ Connected" : "❌ Disconnected"}
              </span>
            </div>
            {socketId && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Socket ID:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {socketId}
                </code>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-medium">User:</span>
              <span className="text-gray-700">
                {user ? user.email : "Not logged in"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Authenticated:</span>
              <span
                className={`font-semibold ${
                  isAuthenticated ? "text-green-600" : "text-red-600"
                }`}
              >
                {isAuthenticated ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Test Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="flex gap-3">
            <button
              onClick={handleTestPing}
              disabled={!isConnected}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Test Ping/Pong
            </button>
            <button
              onClick={handleReconnect}
              disabled={!isAuthenticated}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Reconnect
            </button>
          </div>
        </div>

        {/* Event Logs */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Event Logs</h2>
          <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No events yet. Try connecting or testing actions.
              </p>
            ) : (
              <div className="space-y-1 font-mono text-sm">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`${
                      log.includes("✅")
                        ? "text-green-400"
                        : log.includes("❌")
                        ? "text-red-400"
                        : log.includes("📥")
                        ? "text-orange-400"
                        : log.includes("📤")
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-3 text-orange-900">
            Instructions
          </h2>
          <ul className="space-y-2 text-orange-800">
            <li>✓ Make sure you're logged in to test socket features</li>
            <li>
              ✓ Open browser console to see detailed socket connection logs
            </li>
            <li>✓ Test notifications by sending from Admin panel</li>
            <li>✓ Try opening multiple tabs to test broadcast</li>
            <li>✓ Check that unread count updates in real-time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SocketTestPage;
