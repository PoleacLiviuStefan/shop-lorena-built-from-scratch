// lib/sanity/tokenOperations.ts
import { client } from '../client';

async function saveTokenToDatabase(tokenData: { token: string; expiresAt: string }) {
  try {
    // Verificăm dacă există deja un document token
    const existingToken = await client.fetch(
      `*[_type == "fanCourierToken"][0]`
    );

    if (existingToken) {
      // Actualizăm documentul existent
      await client
        .patch(existingToken._id)
        .set({
          token: tokenData.token,
          expiresAt: tokenData.expiresAt
        })
        .commit();
    } else {
      // Creăm un document nou
      await client.create({
        _type: 'fanCourierToken',
        token: tokenData.token,
        expiresAt: tokenData.expiresAt
      });
    }

    console.log('Token saved successfully to Sanity');
  } catch (error) {
    console.error('Error saving token to Sanity:', error);
    throw error;
  }
}

async function getTokenFromDatabase() {
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

export { saveTokenToDatabase, getTokenFromDatabase };