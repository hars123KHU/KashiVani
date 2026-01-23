"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

type DoctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  vapiAgentId: string;
};

function AddNewSessionDialog() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] =
    useState<DoctorAgent[] | null>(null);
  const [selectedDoctor, setSelectedDoctor] =
    useState<DoctorAgent | null>(null);

  const router = useRouter();

  // 🔄 RESET EVERYTHING
  const resetDialog = () => {
    setNote("");
    setSuggestedDoctors(null);
    setSelectedDoctor(null);
    setLoading(false);
  };

  // STEP 1
  const onClickNext = async () => {
    if (!note) return;

    setLoading(true);
    try {
      const res = await axios.post("/api/suggest-doctors", {
        notes: note,
      });
      setSuggestedDoctors(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2
  const onStartConsultation = async () => {
    if (!selectedDoctor) return;

    setLoading(true);
    try {
      const res = await axios.post("/api/session-chat", {
        notes: note,
        selectedDoctor,
      });

      if (res.data?.sessionId) {
        setOpen(false);
        resetDialog();
        router.push(`/dashboard/medical-agent/${res.data.sessionId}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ❗ MANUAL CANCEL (THIS FIXES EVERYTHING)
  const onCancel = () => {
    setOpen(false);
    resetDialog();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-3">+ Explore Kashi</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
        </DialogHeader>

        {!suggestedDoctors ? (
          <div>
            <h2 className="font-semibold mb-2">
              Ask Anything about Kashi!
            </h2>
            <Textarea
              className="h-[200px]"
              placeholder="Describe your query..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        ) : (
          <div>
            <h2 className="font-semibold mb-3">Select an Agent</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {suggestedDoctors.map((doctor) => {
                const active = selectedDoctor?.id === doctor.id;
                return (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`cursor-pointer border rounded-xl p-4 shadow
                      ${
                        active
                          ? "border-blue-500"
                          : "hover:border-blue-400"
                      }`}
                  >
                    <Image
                      src={doctor.image}
                      alt={doctor.specialist}
                      width={80}
                      height={80}
                      className="rounded-full mx-auto"
                    />
                    <h3 className="font-bold text-center mt-2">
                      {doctor.specialist}
                    </h3>
                    <p className="text-xs text-center text-gray-500 mt-1 line-clamp-2">
                      {doctor.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          {!suggestedDoctors ? (
            <Button disabled={!note || loading} onClick={onClickNext}>
              Next
              {loading ? (
                <Loader2 className="ml-2 animate-spin" />
              ) : (
                <ArrowRight className="ml-2" />
              )}
            </Button>
          ) : (
            <Button
              disabled={!selectedDoctor || loading}
              onClick={onStartConsultation}
            >
              Explore Kashi
              {loading ? (
                <Loader2 className="ml-2 animate-spin" />
              ) : (
                <ArrowRight className="ml-2" />
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
