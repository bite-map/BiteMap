import FoodTruckProfile from "@/components/food-truck/food-truck-profile";

export default async function TruckProfile({
  params,
}: {
  params: Promise<{ truckId: string }>;
}) {
  const truckId = Number((await params).truckId);

  return (
    <>
      <FoodTruckProfile truckId={truckId} />
    </>
  );
}
