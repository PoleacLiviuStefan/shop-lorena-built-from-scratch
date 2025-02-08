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

let stripePromise: Promise<Stripe | null>;

const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      "pk_live_51MroBpCV1XqGrlRbJMZ8BZ6cFMqZjpa5yCxEknMWc2ioPxrO2V9VhGZm77CMOtYF1vo6hzw85kbC64bJwvIkg2OG00SxxOnm59"
    );
    //pk_test_51MroBpCV1XqGrlRbp1l5l1QjwkrjcuXGwkb1MIdSw1LKpE8Z7WA2n1VNVkYv5JmQk7YQPLHUXGxtPAJ2vKdtsy3r00DlCrZk4y
  }
  return stripePromise;
};

const Buy = () => {
  const [curs, setCurs] = useState<string | null>(null);
  // const [coursesInfo, setCoursesInfo] = useState([])
  const [formData, setFormData] = useState<FormData>({
    user_nume: "",
    user_prenume: "",
    user_telefon: "",
    user_email: "",
    user_adresa: "",
    mentiuni_speciale: "",
  });
  const [indexSelectedCourse, setIndexSelectedCourse] = useState(3);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [perioadeCurs, setPerioadeCurs] = useState<string[][]>([
    [], // CURS DE BAZA - poziția 0
    [], // CURS DE EFECTE SPECIALE - poziția 1
    [], // Empty
    [], // CURS DE BAZA PREMIUM - poziția 3
  ]);
  const [pret, setPret] = useState(() => {
    switch (curs) {
      case "Curs De Baza (Integral)":
        return "2000";
      case "Curs De Baza + Kit Inclus (Integral)":
        return "2500";
      case "Curs De Efecte Speciale 1 Zi (Integral)":
        return "1500";
      case "Curs De Perfectionare 2 Zile (Integral)":
        return "2500";
      case "Curs VIP De Baza 2 Zile Fara Kit (Integral)":
        return "3000";
      case "Curs VIP De Baza 2 Zile (Integral)":
        return "3500";
      case "Curs VIP De Baza 3 Zile Fara Kit (Integral)":
        return "3500";
      case "Curs VIP De Baza 3 Zile + Kit Inclus (Integral)":
        return "4000";
      case "Curs Efecte Speciale 1 Zi (Integral)":
        return "950";
      default:
        return "0";
    }
  });

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
      const newPerioadeCurs = [...perioadeCurs];
      console.log("periode curs: ", newPerioadeCurs);
      courses.forEach((course: Course) => {
        const formattedDates = course.courseIntervals.map(
          (interval: CourseInterval) =>
            formatDateInterval(interval.startDate, interval.endDate)
        );

        switch (course.name) {
          case "CURS DE BAZA":
            newPerioadeCurs[0] = formattedDates;
            setSelectedPeriod(formattedDates[0]);
            break;
          case "CURS DE EFECTE SPECIALE":
            newPerioadeCurs[1] = formattedDates;
            setSelectedPeriod(formattedDates[0]);
            break;
          case "CURS DE BAZA PREMIUM":
            newPerioadeCurs[3] = formattedDates;
            setSelectedPeriod(formattedDates[0]);
            break;
        }
      });

      setPerioadeCurs(newPerioadeCurs);
    } catch (error) {
      console.error("Error in fetchCourseData:", error);
    }
  };
  useEffect(() => {
    fetchCourseData();
    if (typeof window !== "undefined") {
      // Setează cursul
      const savedCurs = localStorage.getItem("cumparaCurs");
      setCurs(savedCurs);
      setPretCursSelectat(savedCurs);

      // Setează indexSelectedCourse
      setIndexSelectedCourse(
        savedCurs === "Curs De Baza (Avans)"
          ? 0
          : savedCurs === "Curs De Baza (Integral)"
            ? 0
            : savedCurs === "Curs De Baza + Kit Inclus (Integral)"
              ? 0
              : savedCurs === "Curs De Efecte Speciale 1 Zi (Avans)"
                ? 1
                : savedCurs === "Curs De Efecte Speciale 1 Zi (Integral)"
                  ? 1
                  : savedCurs === "Curs De Perfectionare 2 Zile (Avans)"
                    ? 1
                    : savedCurs === "Curs De Perfectionare 2 Zile (Integral)"
                      ? 1
                      : savedCurs === "Curs VIP De Baza 2 Zile (Avans)"
                        ? -1
                        : savedCurs ===
                            "Curs VIP De Efecte Speciale 1 Zi (Avans)"
                          ? -1
                          : savedCurs ===
                              "Curs VIP De Baza 2 Zile Fara Kit (Integral)"
                            ? -1
                            : savedCurs ===
                                "Curs VIP De Baza 2 Zile + Kit Inclus (Integral)"
                              ? -1
                              : savedCurs === "Curs VIP De Baza 3 Zile (Avans)"
                                ? -1
                                : savedCurs ===
                                    "Curs VIP De Baza 3 Zile Fara Kit (Integral)"
                                  ? -1
                                  : savedCurs ===
                                      "Curs VIP De Baza 3 Zile + Kit Inclus (Integral)"
                                    ? -1
                                    : savedCurs ===
                                        "Curs Efecte Speciale 1 Zi (Avans)"
                                      ? 2
                                      : savedCurs ===
                                          "Curs De Baza Premium (Avans)"
                                        ? 3
                                        : 3
      );
    }
  }, []);

  useEffect(() => {
    setSelectedPeriod(perioadeCurs[indexSelectedCourse][0]);
  }, [indexSelectedCourse]);

  const redirectToCheckout = async () => {
    setLoading(true);

    // Obține instanța Stripe
    const stripe = await getStripe();

    // Verifică dacă Stripe a fost încărcat corect
    if (!stripe) {
      console.error("Stripe.js nu a fost încărcat corect.");
      setLoading(false);
      return;
    }

    // Asigură-te că 'pretCursSelectat' nu este null sau undefined
    if (!pretCursSelectat) {
      console.error("Prețul cursului selectat nu este valid.");
      setLoading(false);
      return;
    }

    try {
      // Redirecționează către Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: pretCursSelectat, quantity: 1 }],
        mode: "payment",
        successUrl: "https://www.lorenalash.ro/cursuri/succes", //live- https://www.lorenalash.ro/cursuri/succes  http://localhost:3000/cursuri/succes
        cancelUrl: "https://www.lorenalash.ro/cursuri/esuat", //live - https://www.lorenalash.ro/cursuri/esuat
      });

      // Gestionează eventualele erori de la Stripe
      if (error) {
        console.error(
          "Eroare la redirecționarea către Checkout:",
          error.message
        );
      }
    } catch (err) {
      // Gestionează erorile neașteptate
      console.error("A apărut o eroare neașteptată:", err);
    } finally {
      // Resetează starea de încărcare
      setLoading(false);
    }
  };

  useEffect(() => {
    switch (curs) {
      case "Curs De Baza (Avans)":
        setPretCursSelectat("price_1OvQTLCV1XqGrlRbSm2Z4L2u");
        // price_1Qo2ImCV1XqGrlRbBSReXZ9x - test
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
        setPretCursSelectat("price_1NLYDyCV1XqGrlRb5rvUy2mg"); // Adaugă ID-ul corect pentru cursul respectiv
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
        setPretCursSelectat("price_1MsWv7CV1XqGrlRb4eSCbORv"); // Adaugă ID-ul corect pentru curs
        setPret("4000");
        break;
      case "Curs Efecte Speciale 1 Zi (Integral)":
        setPretCursSelectat("price_1MsWwhCV1XqGrlRbdhr200nv");
        setPret("950");
        break;
      default:
        setPretCursSelectat("");
        setPret("0");
        break;
    }
  }, [curs]);

  // const item = {
  //   price: pretCursSelectat,
  //   quantity: 1,
  // }

  // const checkoutOptions = {
  //   lineItems: [item],
  //   mode: "payment",
  //   successUrl: `https://lorenalash.ro/success`, //http://localhost:3000/success
  //   cancelUrl: `https://lorenalash.ro/cancel`, //http://localhost:3000/cancel
  // }

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

    // Folosim localStorage în loc de sessionStorage
    sessionStorage.setItem("payment_intent", "processing");
    console.log("selectedPeriod", selectedPeriod);
    // Salvăm și perioada selectată dacă există
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

  useEffect(() => {
    console.log("selectedPeriod: ", selectedPeriod);
  }, [selectedPeriod]);

  return (
    <div className="relative w-full h-full flex justify-center items-center py-[10rem] bg-gray-200 z-20 font-montSerrat">
      <div className="flex flex-col px-[2rem] py-[2rem]  bg-white rounded-[15px] w-[90%] lg:w-[40rem] h-full shadow-xl ">
        <form
          onSubmit={sendForm}
          className="flex lg:flex-row flex-col lg:flex-wrap lg:justify-between  w-full "
        >
          <div className="flex flex-col  my-[.5rem]">
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
              className="border-[#0b2a24] p-2  border-[1px] w-full lg:w-[15rem] h-[2rem] text-[14px]"
              required
            />
          </div>
          <div className="flex flex-col my-[.5rem]">
            <label>Telefon</label>
            <input
              name="user_telefon"
              type="text"
              minLength={10}
              className="border-[#0b2a24] p-2  border-[1px] w-full lg:w-[15rem] h-[2rem] text-[14px]"
              required
            />
          </div>
          <div className="flex flex-col my-[.5rem]">
            <label>Email</label>
            <input
              name="user_email"
              type="email"
              className="border-[#0b2a24] p-2  border-[1px] w-full lg:w-[15rem] h-[2rem] text-[14px]"
              required
            />
          </div>

          <div className="flex flex-col my-[.5rem]">
            <label>Adresa</label>
            <input
              name="user_adresa"
              type="text"
              className="border-[#0b2a24] p-2  border-[1px] w-full lg:w-[15rem] h-[2rem] text-[14px]"
              required
            />
          </div>

          <div className="flex flex-col my-[.5rem]">
            <label>Tip Curs</label>
            <select
              name="tip_curs"
              value={curs ?? ""}
              onChange={(e) => {
                const selectedValue = e.target.value;
                setCurs(selectedValue);
                if (typeof window !== "undefined") {
                  localStorage.setItem("cumparaCurs", selectedValue);
                }
                setIndexSelectedCourse(
                  e.target.value === "Curs De Baza (Avans)"
                    ? 0
                    : e.target.value === "Curs De Baza (Integral)"
                      ? 0
                      : e.target.value ===
                          "Curs De Baza + Kit Inclus (Integral)"
                        ? 0
                        : e.target.value ===
                            "Curs De Efecte Speciale 1 Zi (Avans)"
                          ? 1
                          : e.target.value ===
                              "Curs De Efecte Speciale 1 Zi (Integral)"
                            ? 1
                            : e.target.value ===
                                "Curs De Perfectionare 2 Zile (Avans)"
                              ? 1
                              : e.target.value ===
                                  "Curs De Perfectionare 2 Zile (Integral)"
                                ? 1
                                : e.target.value ===
                                    "Curs VIP De Baza 2 Zile (Avans)"
                                  ? -1
                                  : e.target.value ===
                                      "Curs VIP De Efecte Speciale 1 Zi (Avans)"
                                    ? -1
                                    : e.target.value ===
                                        "Curs VIP De Efecte Speciale 2 Zile (Avans)"
                                      ? -1
                                      : e.target.value ===
                                          "Curs VIP De Baza 2 Zile Fara Kit (Integral)"
                                        ? -1
                                        : e.target.value ===
                                            "Curs VIP De Baza 2 Zile + Kit Inclus (Integral)"
                                          ? -1
                                          : e.target.value ===
                                              "Curs VIP Efecte Speciale 1 Zi (Avans)"
                                            ? -1
                                            : e.target.value ===
                                                "Curs VIP De Baza 3 Zile Fara Kit (Integral)"
                                              ? -1
                                              : e.target.value ===
                                                  "Curs VIP De Baza 3 Zile + Kit Inclus (Integral)"
                                                ? -1
                                                : e.target.value ===
                                                    "Curs Efecte Speciale 1 Zi (Avans)"
                                                  ? 2
                                                  : e.target.value ===
                                                      "Curs De Baza Premium (Avans)"
                                                    ? 3
                                                    : 3
                );
              }}
              className="border-[#0b2a24]  border-[1px] w-full lg:w-[15rem] h-[2rem] text-[14px]"
            >
              <option
                value="Curs De Baza (Avans)"
                defaultValue={
                  curs === "Curs De Baza (Avans)" ? "selected" : undefined
                }
              >
                CURS DE BAZA (AVANS)
              </option>

              <option
                value="Curs De Baza Premium (Avans)"
                defaultValue={
                  curs === "Curs De Baza Premium (Avans)"
                    ? "selected"
                    : undefined
                }
              >
                CURS DE BAZA PREMIUM(AVANS)
              </option>
              {/*
              <option
                value="Curs De Baza (Integral)"
                onClick={() => setCurs("Curs De Baza (Integral)")}
              >
                CURS DE BAZA FARA KIT (INTEGRAL)
              </option>
              */}

              <option
                value="Curs De Efecte Speciale 1 Zi (Avans)"
                defaultValue={
                  curs === "Curs De Perfectionare" ? "selected" : undefined
                }
              >
                CURS DE EFECTE SPECIALE 1 ZI (AVANS)
              </option>

              {/*
              <option
                value="Curs De Efecte Speciale 1 Zi (Integral)"
                onClick={() => setCurs("Curs De Efecte Speciale 1 Zi (Integral)")}
              >
                CURS DE PERFECTIONARE & EFECTE SPECIALE 1 ZI (INTEGRAL)
              </option>
              */}

              <option
                value="Curs VIP De Baza 2 Zile (Avans)"
                defaultValue={
                  curs === "Curs VIP De Baza" ? "selected" : undefined
                }
              >
                CURS VIP DE BAZA 2 ZILE (AVANS)
              </option>

              {/*
              <option
                value="Curs VIP De Baza 2 Zile Fara Kit (Integral)"
                onClick={() =>
                  setCurs("Curs VIP De Baza 2 Zile Fara Kit (Integral)")
                }
              >
                CURS VIP DE BAZA 2 ZILE FARA KIT (INTEGRAL)
              </option>
              */}
              {/*
              <option
                value="Curs VIP Efecte Speciale 1 Zi (Avans)"
                onClick={() => setCurs("Curs VIP Efecte Speciale 1 Zi (Avans)")}
              >
                CURS VIP DE EFECTE SPECIALE 1 ZI (AVANS)
              </option>
*/}

              <option value="Curs VIP De Efecte Speciale 2 Zile (Avans)">
                CURS VIP DE EFECTE SPECIALE 2 ZILE (AVANS)
              </option>

              {/*
              <option
                value="Curs VIP De Baza 3 Zile Fara Kit (Integral)"
                onClick={() =>
                  setCurs("Curs VIP De Baza 3 Zile Fara Kit (Integral)")
                }
              >
                CURS VIP DE BAZA 3 ZILE FARA KIT (INTEGRAL)
              </option>
              */}
              {/*
              <option
                value="Curs Efecte Speciale 1 Zi (Avans)"
                onClick={() => setCurs("Curs Efecte Speciale 1 Zi (Avans)")}
                selected={
                  localStorage.getItem("cumparaCurs") ===
                    "Curs Efecte Speciale" && "selected"
                }
              >
                CURS FOXY 1 ZI (AVANS)
              </option>
              */}
              {/*
              <option
                value="Curs Efecte Speciale 1 Zi (Integral)"
                onClick={() => setCurs("Curs Efecte Speciale 1 Zi (Integral)")}
              >
                CURS FOXY 1 ZI (INTEGRAL)
              </option>
              */}
            </select>
          </div>
          <div className="flex flex-col my-[.5rem]">
            <label>
              {indexSelectedCourse === -1
                ? "Alege ziua in care vrei sa participi"
                : "Perioada Cursului"}
            </label>

            <select
              name="tip_curs"
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                if (typeof window !== "undefined") {
                  localStorage.setItem("selectedPeriod", e.target.value);
                }
              }}
              className={`border-[#0b2a24] border-[1px] w-full lg:w-[15rem] h-[2rem] text-[14px] ${
                (curs === "Curs VIP De Baza" || indexSelectedCourse === -1) &&
                "hidden"
              }`}
            >
              {indexSelectedCourse >= 0 &&
                perioadeCurs[indexSelectedCourse].map((val, index) => (
                  <option key={`period-${index}`} value={val}>
                    {val}
                  </option>
                ))}
            </select>
            <div
              onClick={() => console.log(selectedDate)}
              className={` h-[35px] ${
                curs !== "Curs VIP De Baza" &&
                indexSelectedCourse !== -1 &&
                "hidden"
              }`}
            >
              <DatePicker
                className="border-[#0b2a24] p-2  border-[1px] w-full lg:w-[15rem] h-[2rem] text-[14px]"
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat="yyyy/MM/dd"
                minDate={new Date()}
                filterDate={(date) => date.getDay() !== 0}
              />
            </div>
          </div>
          <div className="flex flex-col w-full  my-[.5rem]">
            <label>Mentiuni Speciale</label>
            <textarea
              name="mentiuni_speciale"
              className="border-[#0b2a24] border-[1px] p-2 w-full lg:w-[36rem] h-[10rem]"
            />
          </div>

          <div className="flex flex-col items-center w-full mt-[2rem]">
            <h3 className=" text-[18px] lg:text-[24px] font-bold">
              COMANDA TA:
            </h3>
            <div className="relative flex justify-between w-full font-bold text-[20px] mt-[2rem] ">
              <h4>Produs</h4>
              <h4 className="mb-[.5rem]">Total</h4>
              <span className="absolute bottom-0 bg-black opacity-[15%] w-full h-[1px]" />
            </div>
            <div
              className={`flex ${
                curs && curs.includes("Avans") ? "" : "hidden"
              } justify-between w-full font-bold mt-[.5rem]`}
            >
              <h3> {curs}</h3>
              <h4>500 lei</h4>
            </div>
            <div
              className={`flex ${
                curs && !curs.includes("Avans") ? "" : "hidden"
              }  justify-between w-full font-bold mt-[.5rem]`}
            >
              <h4>{curs} </h4>
              <h4>{pret} lei</h4>
            </div>

            <h4>*Plata online prin card bancar</h4>
            <button
              value="Send"
              type="submit"
              className="font-bold px-[3rem] py-[1rem] mt-[1rem] bg-[#0b2a24] rounded-[8px] text-white"
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
