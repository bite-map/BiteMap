import FoodTruckProfile from "@/components/food-truck/food-truck-profile";

export default async function TruckProfile({
  params,
}: {
  params: Promise<{ truckId: string }>;
}) {
  const truckId = Number((await params).truckId);

  return (
    <>
      <div className="md:flex md:justify-center md:items-center md:min-h-screen">
        <FoodTruckProfile truckId={truckId} />
      </div>
    </>
  );
}
