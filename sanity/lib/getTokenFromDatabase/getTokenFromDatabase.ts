// sanity/lib.ts
import { client } from '../client'; // ajustează calea în funcție de structura ta

export async function getTokenFromDatabase() {
  try {
    const token = await client.fetch(
      `*[_type == "fanCourierToken"][0]{
        token,
        expiresAt
      }`
    );
    return token;
  } catch (error) {
    console.error('Error fetching token from Sanity:', error);
    return null;
  }
}