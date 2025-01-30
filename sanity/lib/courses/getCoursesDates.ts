import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllCourses = async () => {
  const ALL_COURSES_QUERY = defineQuery(`
    *[_type == "course"] {
      "name": courseName,
      courseIntervals[] {
        startDate,
        endDate
      }
    }
  `);

  try {
    const courses = await sanityFetch({
      query: ALL_COURSES_QUERY,
    });

    console.log("Fetched courses:", courses); // Verificăm rezultatele
    return courses?.data || []; // Returnăm un array gol dacă nu sunt date
  } catch (error) {
    console.error("Error fetching all courses: ", error);
    return [];
  }
};
