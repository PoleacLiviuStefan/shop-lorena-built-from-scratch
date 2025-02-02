import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-02-02',
  useCdn: true,
});

export const getAllCourses = async () => {
  const query = `*[_type == "course"] {
    "name": courseName,
    courseIntervals[] {
      startDate,
      endDate
    }
  }`;

  try {
    const courses = await client.fetch(query);
    console.log("Fetched courses:", courses);
    return courses || [];
  } catch (error) {
    console.error("Error fetching all courses: ", error);
    return [];
  }
};