<a href="https://bite-map.com"><img src="https://github.com/bite-map/BiteMap/blob/main/public/logo.svg" alt="BiteMap's Logo" width="400"/></a>
# Find your next bite to eat
# The Concept
BiteMap is a progressive web app which makes information about food trucks more readily avaliable. Through user contribution we are working to build a living map of food truck activity across Tokyo and Japan.

<a href="https://bite-map.com"><img src="https://i.postimg.cc/BnkCWZDH/bitemap-screenshots.png" alt="BiteMap Screenshots" /></a>


# Find Us Here ⬇️

### [BiteMap](https://bite-map.com/)

# Running Locally
1. Download or clone this repository
2. Open in your IDE
3. Install dependencies
```console
pnpm i
```
4. Start the dev server
```console
pnpm dev
```
5. Create a `.env.local` file in the root directory
```
NEXT_PUBLIC_SUPABASE_URL=<Insert Supabase URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=e<Insert Supabase anon key>

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<Insert Google Maps API key>
```
 - If you are not sure how to obtain these details please contact a member of the team and we'll be happy to help.

6. If everything went as planned you should be up and running on http://localhost:3000/

# Our Tech Stack
BiteMap's front-end is built using React, Next.js and TypeScript. The back-end leverages Next.js's API routes and server components. For our database, authentication and storage we are using Supabase.

The map functionaility is achieved using the Google Maps and Google Places APIs.

# The Team
<a href="https://github.com/bite-map/BiteMap/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=bite-map/BiteMap" />
</a>
