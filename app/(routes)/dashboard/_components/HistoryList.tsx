"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import AddNewSessionDialog from "./AddNewSessionDialog";
import axios from "axios";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import HistoryTable from "./HistoryTable";
import { Button } from "@/components/ui/button";

/**
 * HistoryList Component
 *
 * - Shows first 3 sessions by default
 * - "Show more" reveals all
 * - "Show less" collapses back to 3
 */
function HistoryList() {
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
  const [showAll, setShowAll] = useState(false);

  // ⏳ Fetch history on mount
  useEffect(() => {
    getHistoryList();
  }, []);

  const getHistoryList = async () => {
    const result = await axios.get("/api/session-chat?sessionId=all");
    setHistoryList(result.data);
  };

  // 🔍 Decide visible rows
  const visibleHistory = showAll
    ? historyList
    : historyList.slice(0, 3);

  return (
    <div className="mt-10">
      {historyList.length === 0 ? (
        /* 🟦 Empty State */
        <div className="flex items-center flex-col justify-center p-7 border border-dashed rounded-2xl border-2">
          <Image
            src={"/medical-assistance.png"}
            alt="empty"
            width={150}
            height={150}
          />
          <h2 className="font-bold text-xl mt-2">
            No Recent Explorations😢
          </h2>
          <p className="text-gray-500">
            You haven’t explored Kashivani yet.
          </p>

          <AddNewSessionDialog />
        </div>
      ) : (
        /* 🟩 History Table */
        <div className="space-y-4">
          <HistoryTable historyList={visibleHistory} />

          {/* 🔘 Toggle Button */}
          {historyList.length > 3 && (
            <div className="flex justify-center">
              {!showAll ? (
                <Button
                  variant="outline"
                  onClick={() => setShowAll(true)}
                >
                  Show more
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowAll(false)}
                >
                  Show less
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HistoryList;
