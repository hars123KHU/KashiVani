"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, Loader, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";

export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

type Message = {
  role: string;
  text: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const router = useRouter();

  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔒 Vapi must ALWAYS live in a ref
  const vapiRef = useRef<Vapi | null>(null);

  // 📥 Load session
  useEffect(() => {
    if (!sessionId) return;

    axios
      .get(`/api/session-chat?sessionId=${sessionId}`)
      .then((res) => setSessionDetail(res.data))
      .catch(() => toast.error("Failed to load session"));
  }, [sessionId]);

  // 🧹 Cleanup on unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, []);

  // ▶️ Start Voice Call
  const StartCall = () => {
    if (loading || callStarted || vapiRef.current) return;
    if (!sessionDetail?.selectedDoctor?.vapiAgentId) {
      toast.error("Agent not configured");
      return;
    }

    setLoading(true);

    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    vapiRef.current = vapi;

    // ✅ START CORRECT AGENT
    // @ts-ignore
    vapi.start(sessionDetail.selectedDoctor.vapiAgentId);

    vapi.on("call-start", () => {
      setCallStarted(true);
      setLoading(false);
    });

    vapi.on("call-end", () => {
      setCallStarted(false);
      vapiRef.current = null;

      // 🔥 DEV FIX — Daily leaves ghost rooms otherwise
      window.location.reload();
    });

    vapi.on("message", (message) => {
      if (message.type !== "transcript") return;

      const { role, transcriptType, transcript } = message;

      if (transcriptType === "partial") {
        setLiveTranscript(transcript);
        setCurrentRole(role);
      } else if (transcriptType === "final") {
        setMessages((prev) => [...prev, { role, text: transcript }]);
        setLiveTranscript("");
        setCurrentRole(null);
      }
    });

    vapi.on("error", (err) => {
      console.error("Vapi error:", err);
      setCallStarted(false);
      vapiRef.current = null;
      window.location.reload();
    });
  };

  // ⏹ End Call
  const endCall = async () => {
    await GenerateReport();

    if (vapiRef.current) {
      vapiRef.current.stop();
      vapiRef.current = null;
    }

    setCallStarted(false);
    toast.success("Your Kashivani report is ready ✨");
    router.replace("/dashboard");
  };

  // 🧾 Generate Report
  const GenerateReport = async () => {
    setLoading(true);

    const result = await axios.post("/api/medical-report", {
      messages,
      sessionDetail,
      sessionId,
    });

    setLoading(false);
    return result.data;
  };

  return (
    <div className="p-5 border rounded-3xl bg-secondary">
      {/* Status Bar */}
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`h-4 w-4 rounded-full ${
              callStarted ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {callStarted ? "Connected..." : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">Live</h2>
      </div>

      {sessionDetail && (
        <div className="flex items-center flex-col mt-10">
          <Image
            src={sessionDetail.selectedDoctor.image}
            alt={sessionDetail.selectedDoctor.specialist}
            width={120}
            height={120}
            className="h-[100px] w-[100px] object-cover rounded-full"
          />

          <h2 className="mt-2 text-lg">
            {sessionDetail.selectedDoctor.specialist}
          </h2>
          <p className="text-sm text-gray-400">Kashivani Voice Agent</p>

          {/* Transcript */}
          <div className="mt-12 flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72">
            {messages.slice(-4).map((msg, i) => (
              <p key={i} className="text-gray-400 p-2">
                {msg.role}: {msg.text}
              </p>
            ))}

            {liveTranscript && (
              <p className="text-lg">
                {currentRole}: {liveTranscript}
              </p>
            )}
          </div>

          {/* Controls */}
          {!callStarted ? (
            <Button className="mt-20" onClick={StartCall} disabled={loading}>
              {loading ? <Loader className="animate-spin" /> : <PhoneCall />}
              Start Call
            </Button>
          ) : (
            <Button
              variant="destructive"
              className="mt-20"
              onClick={endCall}
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : <PhoneOff />}
              Disconnect
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;
