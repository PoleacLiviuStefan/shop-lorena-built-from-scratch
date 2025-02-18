"use client";
import React, { useState, useEffect } from "react";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAllCourses } from "@/sanity/lib/courses/getCoursesDatesClient";

interface FormData {
  user_nume: string;
  user_prenume: string;
  user_telefon: string;
  user_email: string;
  user_adresa: string;
  mentiuni_speciale: string;
}

interface CourseInterval {
  startDate: string;
  endDate: string;
}

interface Course {
  name: string;
  courseIntervals: CourseInterval[];
}

interface CourseWithFormattedDates {
  name: string;
  dates: string[];
}

let stripePromise: Promise<Stripe | null>;

const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      "pk_live_51MroBpCV1XqGrlRbJMZ8BZ6cFMqZjpa5yCxEknMWc2ioPxrO2V9VhGZm77CMOtYF1vo6hzw85kbC64bJwvIkg2OG00SxxOnm59"
      //"pk_test_51MroBpCV1XqGrlRbp1l5l1QjwkrjcuXGwkb1MIdSw1LKpE8Z7WA2n1VNVkYv5JmQk7YQPLHUXGxtPAJ2vKdtsy3r00DlCrZk4y"
    );
  }
  return stripePromise;
};

const Buy = () => {
  const [curs, setCurs] = useState<string | null>(null);
  const [coursesWithDates, setCoursesWithDates] = useState<CourseWithFormattedDates[]>([]);
  const [formData, setFormData] = useState<FormData>({
    user_nume: "",
    user_prenume: "",
    user_telefon: "",
    user_email: "",
    user_adresa: "",
    mentiuni_speciale: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pret, setPret] = useState<string>("0");
  const [pretCursSelectat, setPretCursSelectat] = useState<string | null>(null);

  const formatDateInterval = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatDay = (date: Date) => date.getDate();
    const formatMonth = (date: Date) => {
      const months = [
        "Ianuarie",
        "Februarie",
        "Martie",
        "Aprilie",
        "Mai",
        "Iunie",
        "Iulie",
        "August",
        "Septembrie",
        "Octombrie",
        "Noiembrie",
        "Decembrie",
      ];
      return months[date.getMonth()];
    };

    return `${formatDay(start)}-${formatDay(end)} ${formatMonth(start)}`;
  };

  const fetchCourseData = async () => {
    try {
      const courses = await getAllCourses();
      const formattedCourses: CourseWithFormattedDates[] = courses.map((course: Course) => ({
        name: course.name,
        dates: course.courseIntervals.map((interval: CourseInterval) =>
          formatDateInterval(interval.startDate, interval.endDate)
        ),
      }));

      setCoursesWithDates(formattedCourses);

      // Dacă există un curs salvat în localStorage, îl selectăm și setăm prima perioadă
      const savedCurs = localStorage.getItem("cumparaCurs");
      if (savedCurs) {
        setCurs(savedCurs);
        const selectedCourse = formattedCourses.find(course => course.name === savedCurs);
        if (selectedCourse && selectedCourse.dates.length > 0) {
          setSelectedPeriod(selectedCourse.dates[0]);
        }
      }
    } catch (error) {
      console.error("Error in fetchCourseData:", error);
    }
  };

  useEffect(() => {
    fetchCourseData();
    if (typeof window !== "undefined") {
      const savedCurs = localStorage.getItem("cumparaCurs");
      if (savedCurs) {
        setCurs(savedCurs);
      }
    }
  }, []);

  // Când se schimbă cursul, actualizăm automat perioada selectată
  useEffect(() => {
    if (curs) {
      const selectedCourse = coursesWithDates.find(course => course.name === curs);
      if (selectedCourse && selectedCourse.dates.length > 0) {
        setSelectedPeriod(selectedCourse.dates[0]);
      }
    }
  }, [curs, coursesWithDates]);

  useEffect(() => {
    // Setăm prețul și ID-ul Stripe în funcție de cursul selectat
    switch (curs) {
      case "Curs De Baza (Avans)":
        setPretCursSelectat("price_1OvQTLCV1XqGrlRbSm2Z4L2u");
        //price_1Qo2ImCV1XqGrlRbBSReXZ9x
        setPret("500");
        break;
      case "Curs De Baza (Integral)":
        setPretCursSelectat("price_1NLYDyCV1XqGrlRb5rvUy2mg");
        setPret("2000");
        break;
      case "Curs De Baza Premium (Avans)":
        setPretCursSelectat("price_1QN0ujCV1XqGrlRbTIf5x2ge");
        setPret("500");
        break;
      case "Curs De Baza + Kit Inclus (Integral)":
        setPretCursSelectat("price_1NLYDyCV1XqGrlRb5rvUy2mg");
        setPret("2500");
        break;
      case "Curs De Efecte Speciale 1 Zi (Avans)":
        setPretCursSelectat("price_1OvQFxCV1XqGrlRbqdtyocuT");
        setPret("500");
        break;
      case "Curs De Efecte Speciale 1 Zi (Integral)":
        setPretCursSelectat("price_1OK4WBCV1XqGrlRb9wvbpoGI");
        setPret("1500");
        break;
      case "Curs De Perfectionare 2 Zile (Avans)":
        setPretCursSelectat("price_1MsiOmCV1XqGrlRbcY0edoc9");
        setPret("500");
        break;
      case "Curs De Perfectionare 2 Zile (Integral)":
        setPretCursSelectat("price_1MsWpOCV1XqGrlRb0dtRQlWZ");
        setPret("2500");
        break;
      case "Curs VIP De Baza 2 Zile (Avans)":
        setPretCursSelectat("price_1MsB5TCV1XqGrlRbX7G01gnH");
        setPret("500");
        break;
      case "Curs VIP De Baza 2 Zile (Integral)":
        setPretCursSelectat("price_1MsWtECV1XqGrlRbgsXhEIve");
        setPret("3500");
        break;
      case "Curs VIP De Baza 3 Zile Fara Kit (Integral)":
        setPretCursSelectat("price_1MsWv7CV1XqGrlRb4eSCbORv");
        setPret("3500");
        break;
      case "Curs VIP De Baza 3 Zile + Kit Inclus (Integral)":
        setPretCursSelectat("price_1MsWv7CV1XqGrlRb4eSCbORv");
        setPret("4000");
        break;
      case "Curs Efecte Speciale 1 Zi (Integral)":
        setPretCursSelectat("price_1MsWwhCV1XqGrlRbdhr200nv");
        setPret("950");
        break;
      default:
        setPretCursSelectat("price_1QtzrKCV1XqGrlRb6FFzxefI");
        //price_1Qo2ImCV1XqGrlRbBSReXZ9x
        setPret("500");
        break;
    }
  }, [curs]);

  const redirectToCheckout = async () => {
    setLoading(true);
    const stripe = await getStripe();
    if (!stripe) {
      console.error("Stripe.js nu a fost încărcat corect.");
      setLoading(false);
      return;
    }
    if (!pretCursSelectat) {
      console.error("Prețul cursului selectat nu este valid.");
      setLoading(false);
      return;
    }
    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: pretCursSelectat, quantity: 1 }],
        mode: "payment",
        // successUrl: "http://localhost:3000/cursuri/succes",
        // cancelUrl: "http://localhost:3000/cursuri/esuat",
        successUrl: "https://www.lorenalash.ro/cursuri/succes",
        cancelUrl: "https://www.lorenalash.ro/cursuri/esuat",
      });
      if (error) {
        console.error("Eroare la redirecționarea către Checkout:", error.message);
      }
    } catch (err) {
      console.error("A apărut o eroare neașteptată:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formElements = form.elements as HTMLFormControlsCollection;

    const newFormData: Record<string, string> = {};

    Object.keys(formData).forEach((key) => {
      const element = formElements.namedItem(key) as HTMLInputElement;
      if (element) {
        newFormData[key] = element.value;
        localStorage.setItem(key, element.value);
      }
    });

    setFormData((prev) => ({
      ...prev,
      ...newFormData,
    }));

    sessionStorage.setItem("payment_intent", "processing");
    console.log("selectedPeriod", selectedPeriod);
    if (selectedPeriod) {
      localStorage.setItem("selected_period", selectedPeriod);
    }

    try {
      await redirectToCheckout();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("A apărut o eroare necunoscută.");
      }
    }
  };

  return (
    <div className="relative w-full h-full flex justify-center items-center py-[10rem] bg-gray-200 z-20 font-montSerrat">
      <div className="flex flex-col px-[2rem] py-[2rem] bg-white rounded-[15px] w-[90%] lg:w-[40rem] h-full shadow-xl">
        <form onSubmit={sendForm} className="flex lg:flex-row flex-col lg:flex-wrap lg:justify-between w-full">
          <div className="flex flex-col my-[.5rem]">
            <label>Nume</label>
            <input
              name="user_nume"
              type="text"
              className="border-[#0b2a24] p-2 border-[1px] w-full lg:w-[15rem] h-[2rem] text-[14px]"
              required
            />
          </div>
          <div className="flex flex-col my-[.5rem]">
            <label>Prenume</label>
            <input
              name="user_prenume"
              type="text"
              className="border-[#0b2a24] p-2 border-[1px] w-full lg:w-[15rem] h-[2rem] text-[14px]"
              required
            />
          </div>
          <div className="flex flex-col my-[.5rem]">
            <label>Telefon</label>
            <input
              name="user_telefon"
              type="text"
              minLength={10}
              className="border-[#0b2a24] p-2 border-[1px] w-full lg:w-[15rem] h-[2rem] text-[14px]"
              required
            />
          </div>
          <div className="flex flex-col my-[.5rem]">
            <label>Email</label>
            <input
              name="user_email"
              type="email"
              className="border-[#0b2a24] p-2 border-[1px] w-full lg:w-[15rem] h-[2rem] text-[14px]"
              required
            />
          </div>
          <div className="flex flex-col my-[.5rem]">
            <label>Adresa</label>
            <input
              name="user_adresa"
              type="text"
              className="border-[#0b2a24] p-2 border-[1px] w-full lg:w-[15rem] h-[2rem] text-[14px]"
              required
            />
          </div>
          <div className="flex flex-col my-[.5rem]">
            <label>Tip Curs</label>
            <select
              name="tip_curs"
              value={curs || ""}
              onChange={(e) => {
                const selectedCourseName = e.target.value;
                setCurs(selectedCourseName);
                localStorage.setItem("cumparaCurs", selectedCourseName);
              }}
              className="border-[#0b2a24] border-[1px] w-full lg:w-[15rem] h-[2rem] text-[14px]"
            >
              {coursesWithDates.map((course, index) => (
                <option key={index} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col my-[.5rem]">
            <label>Perioada Cursului</label>
            <select
              name="period"
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                localStorage.setItem("selected_period", e.target.value);
              }}
              className="border-[#0b2a24] border-[1px] w-full lg:w-[15rem] h-[2rem] text-[14px]"
            >
              {coursesWithDates
                .find((course) => course.name === curs)
                ?.dates.map((date, index) => (
                  <option key={index} value={date}>
                    {date}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col my-[.5rem]">
            <label>Mentiuni Speciale</label>
            <textarea
              name="mentiuni_speciale"
              className="border-[#0b2a24] border-[1px] p-2 w-full lg:w-[36rem] h-[10rem]"
            />
          </div>
          <div className="flex flex-col items-center w-full mt-[2rem]">
            <h3 className="text-[18px] lg:text-[24px] font-bold">COMANDA TA:</h3>
            <div className="relative flex justify-between w-full font-bold text-[20px] mt-[2rem]">
              <h4>Produs</h4>
              <h4 className="mb-[.5rem]">Total</h4>
              <span className="absolute bottom-0 bg-black opacity-[15%] w-full h-[1px]" />
            </div>
            <div className={`flex  justify-between w-full font-bold mt-[.5rem]`}>
              <h3>{curs} (AVANS)</h3>
              <h4 className="flex whitespace-nowrap">500 lei</h4>
            </div>
            {/* <div className={`flex ${curs && !curs.includes("Avans") ? "" : "hidden"} justify-between w-full font-bold mt-[.5rem]`}>
              <h4>{curs}</h4>
              <h4>{pret} lei</h4>
            </div> */}
            <h4>*Plata online prin card bancar</h4>
            <button
              type="submit"
              className="font-bold px-[3rem] py-[1rem] mt-[1rem] bg-[#0b2a24] rounded-[8px] text-white"
              disabled={loading}
            >
              {!loading ? "PLASEAZA COMANDA" : "ASTEPTATI..."}
            </button>
          </div>
          <input
            name="data_vip"
            type="text"
            value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
            className="hidden"
          />
        </form>
      </div>
    </div>
  );
};

export default Buy;
