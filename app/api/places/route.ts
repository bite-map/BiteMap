import { NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_PLACES;
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || "3000";
    // check validation of params
    if (!lng || !lat) {
      return NextResponse.json(
        { error: "lat or lng required" },
        { status: 400 }
      );
    }
    if (!apiKey) {
      return NextResponse.json(
        { error: "cannot get api key" },
        { status: 500 }
      );
    }

    const url = new URL(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`
    );
    url.searchParams.append("location", `${lat}, ${lng}`);
    url.searchParams.append("radius", radius);
    url.searchParams.append("type", "restaurant");
    url.searchParams.append("keyword", "food truck");
    url.searchParams.append("key", apiKey);
    const urlString = url.toString();
    console.log(urlString);
    const response = await fetch(urlString);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
