import { addSighting, getSighting } from "@/app/database-actions";
import { NextRequest, NextResponse } from "next/server";
import { Location } from "@/components/global-component-types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location: Location = {
    lat: Number(searchParams.get("lat")),
    lng: Number(searchParams.get("lng")),
  };
  //

  const data = await getSighting(location);

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location: Location = {
    lat: Number(searchParams.get("lat")),
    lng: Number(searchParams.get("lng")),
  };
  //

  const data = await addSighting(location);

  return NextResponse.json(data, { status: 200 });
}
