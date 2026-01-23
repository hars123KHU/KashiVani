"use client";

import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

/**
 * ✅ Type definition for Kashivani agents
 */
export type doctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;

  // 🔑 Vapi dashboard agent ID (CRITICAL)
  vapiAgentId: string;
};

type Props = {
  doctorAgent: doctorAgent;
};

/**
 * DoctorAgentCard Component
 * Renders a Kashivani agent card and starts a voice session
 */
function DoctorAgentCard({ doctorAgent }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * ▶️ Start Kashivani Session
   */
  const onStartConsultation = async () => {
    try {
      setLoading(true);

      const result = await axios.post("/api/session-chat", {
        notes: "New Query",
        selectedDoctor: doctorAgent,
      });

      if (result.data?.sessionId) {
        router.push(
          "/dashboard/medical-agent/" + result.data.sessionId
        );
      }
    } catch (error) {
      console.error("Failed to start session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* 🖼️ Agent image */}
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={200}
        height={300}
        className="w-full h-[230px] object-cover rounded-xl"
      />

      {/* 🏷️ Agent name */}
      <h2 className="font-bold mt-1">{doctorAgent.specialist}</h2>

      {/* 📝 Description */}
      <p className="line-clamp-2 text-sm text-gray-500">
        {doctorAgent.description}
      </p>

      {/* 🚀 Start button */}
      <Button
        className="w-full mt-2"
        onClick={onStartConsultation}
        disabled={loading}
      >
        Start Consultation{" "}
        {loading ? (
          <Loader2Icon className="ml-2 animate-spin" />
        ) : (
          <IconArrowRight className="ml-2" />
        )}
      </Button>
    </div>
  );
}

export default DoctorAgentCard;
