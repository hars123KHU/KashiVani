import { NextResponse } from "next/server";
import { AIDoctorAgents } from "@/shared/list";

export async function POST(req: Request) {
  try {
    const { notes } = await req.json();

    if (!notes || typeof notes !== "string") {
      return NextResponse.json(AIDoctorAgents);
    }

    const query = notes.toLowerCase();
    const words = query.split(/\s+/);

    const matched = AIDoctorAgents.filter((agent) =>
      agent.keywords?.some((keyword: string) =>
        words.some((word) =>
          keyword.toLowerCase().includes(word.toLowerCase())
        )
      )
    );

    return NextResponse.json(
      matched.length > 0 ? matched : AIDoctorAgents
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to suggest agents" },
      { status: 500 }
    );
  }
}
