import Link from "next/link";
import React from "react";

export default function FAQPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Frequently Asked Questions (FAQ)</h1>

      <h2 className="text-2xl font-semibold mt-4">1. What is BiteMap?</h2>
      <p>
        BiteMap is a food truck tracking app that helps users find nearby food
        trucks in real-time. By using your location, it provides information
        about food trucks, their current locations, and even the likelihood of
        them being at specific spots.
      </p>

      <h2 className="text-2xl font-semibold mt-4">
        2. What is BiteMap's goal?
      </h2>
      <p>
        The goal of BiteMap is to make it easier for food truck enthusiasts to
        discover food trucks based on their location, track their movements, and
        get real-time updates on where their favorite trucks are located.
      </p>

      <h2 className="text-2xl font-semibold mt-4">
        3. What if I find a food truck that isn't listed?
      </h2>
      <p>
        If you find a food truck that's not listed, we encourage you to add it.
        Foods trucks can only be added alongside a sighting. From the local map
        click the plus and scroll to the bottom of the truck list to add a new
        truck.
      </p>

      <h2 className="text-2xl font-semibold mt-4">
        4. What do you mean by "You are here"?
      </h2>
      <p>
        The "You are here" message appears when a food truck is extremely close
        to your current location, so you can visit it right away!
      </p>

      <h2 className="text-2xl font-semibold mt-4">
        5. How is the chance for food trucks calculated?
      </h2>
      <p>
        The chance for a food truck being at a specific location is calculated
        based on historical sightings and confirmations from other users. We use
        this data to estimate the chances of a truck appearing at a particular
        spot on a given day.
      </p>

      <h2 className="text-2xl font-semibold mt-4">6. Why food trucks?</h2>
      <p>
        We chose to focus on food trucks because they offer a unique dining
        experience that is mobile, dynamic, and highly popular in urban areas.
        Food trucks offer diverse food options and are an exciting way to
        support local businesses while exploring new and different cuisines.
      </p>

      <h2 className="text-2xl font-semibold mt-4">
        7. How does BiteMap track food trucks?
      </h2>
      <p>
        BiteMap tracks food trucks by using location data provided by the app's
        users, including real-time sightings and historical data about where
        food trucks have been. This allows us to predict when and where food
        trucks are likely to be, providing you with up-to-date information.
      </p>

      <h2 className="text-2xl font-semibold mt-4">
        8. Do I need an account to use BiteMap?
      </h2>
      <p>
        No, you do not need an account to use BiteMap. You can access the app
        and track food trucks based on your location without logging in.
        However, if you wish to add a sighting to the map, keep track of your
        favorite trucks or leave reviews an account is required.
      </p>

      <h2 className="text-2xl font-semibold mt-4">
        9. How accurate is the location data?
      </h2>
      <p>
        The accuracy of the location data depends on the GPS and geolocation
        capabilities of your device. While we strive to provide accurate and
        real-time data, the food truck locations may vary slightly depending on
        your location and the information we receive.
      </p>

      <h2 className="text-2xl font-semibold mt-4">
        10. Is BiteMap available in my city?
      </h2>
      <p>
        BiteMap is continuously expanding to include more cities. If you don't
        see food trucks listed in your area, check back soon or submit your
        local food trucks to help us grow!
      </p>

      <h2 className="text-2xl font-semibold mt-4">
        11. How can I connect with you?
      </h2>
      <p>
        You can find details to connect with the defelopers of BiteMap over on
        our GitHub page{" "}
        <Link
          className="font-semibold text-primary"
          href={"https://github.com/bite-map/BiteMap"}
        >
          BiteMap GitHub
        </Link>
        . We look forward to hearing from you!
      </p>
    </div>
  );
}
