import { NextResponse } from "next/server";
import { dbService } from "@/lib/server/db/client";
import { ApiResponse } from "@/lib/server/types";

export async function GET() {
  try {
    const contacts = await dbService.getExtensionContacts();

    const response: ApiResponse<typeof contacts> = {
      success: true,
      data: contacts,
      meta: {
        source: "Punjab Agriculture Department & PARC Official Directories",
        asOf: "Oct 2026",
        status: "sample",
        recordCount: contacts.length,
        disclaimer:
          "Official advisory contact information for registered government extension offices and research institutes in the pilot zone.",
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to retrieve extension directory.",
        },
      },
      { status: 500 }
    );
  }
}
