import {
  getAllSighConfirmationsByDayId,
  getAllSighConfirmationsByDayLocationId,
} from "@/app/database-actions";

export const calculateChanceByLocationAndDay = async (
  truckId: number,
  address: string,
  dayOfWeek: number
): Promise<number> => {
  // Fetch all confirmations for the truck on the given day
  const allConfirmations = await getAllSighConfirmationsByDayId(
    truckId,
    dayOfWeek
  );
  // console.log("All confirmations:", allConfirmations); // Debug log for all confirmations

  if (!allConfirmations || allConfirmations.length === 0) {
    // console.log("No sightings confirmations found for the specified truck and day of week");
    return 0;
  }

  // get confirmations for the location and day
  const confirmationsByLocation = await getAllSighConfirmationsByDayLocationId(
    truckId,
    address,
    dayOfWeek
  );
  // console.log(`Confirmations for ${address} on day ${dayOfWeek}:`, confirmationsByLocation); // Debug log for specific location

  if (!confirmationsByLocation || confirmationsByLocation.length === 0) {
    // console.log("No sighting confirmations at this location on the specified day.");
    return 0;
  }

  // Calculate the chance
  const percentage = confirmationsByLocation.length / allConfirmations.length;
  // console.log("Calculated chance:", percentage); // Debug log for calculated chance

  // Return the chance, max 0.9
  return Math.min(percentage, 0.9);
};
