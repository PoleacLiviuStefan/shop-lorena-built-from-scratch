"use strict";
exports.__esModule = true;
var image_1 = require("next/image");
var link_1 = require("next/link");
var react_1 = require("react");
var curs_de_baza_jpg_1 = require("../public/Imagini/cursuri/curs_de_baza.jpg");
var curs_de_baza_premium_jpg_1 = require("../public/Imagini/cursuri/curs_de_baza_premium.jpg");
var curs_de_efecte_speciale_jpg_1 = require("../public/Imagini/cursuri/curs_de_efecte_speciale.jpg");
var cursVip_jpeg_1 = require("../public/Imagini/cursuri/cursVip.jpeg");
var HomeCoursesPreview = function () {
    return (react_1["default"].createElement("div", { className: "grid grid-cols-2 gap-6 justify-items-center py-4" },
        react_1["default"].createElement(link_1["default"], { href: "/cursuri/curs-de-baza", className: "relative flex flex-col items-center" },
            react_1["default"].createElement(image_1["default"], { src: curs_de_baza_jpg_1["default"], alt: "Curs de baz\u0103", className: "w-[300px] h-auto" }),
            react_1["default"].createElement("div", { className: "flex items-center justify-center absolute bottom-0  bg-black text-white  h-[50px] z-10 w-full " },
                react_1["default"].createElement("h2", { className: "text-[16px] lg:text-[22px] font-extrabold text-center " }, "Curs De Baza"))),
        react_1["default"].createElement(link_1["default"], { href: "/cursuri/curs-de-baza-premium", className: "relative" },
            react_1["default"].createElement(image_1["default"], { src: curs_de_baza_premium_jpg_1["default"], alt: "Curs de baz\u0103 premium", className: "relative w-[300px] h-auto" }),
            react_1["default"].createElement("div", { className: "flex items-center justify-center absolute bottom-0  bg-black text-white  h-[50px] z-10 w-full " },
                react_1["default"].createElement("h2", { className: "text-[16px] lg:text-[22px] font-extrabold text-center" }, "Curs De Baza Premium"))),
        react_1["default"].createElement(link_1["default"], { href: "/cursuri/curs-de-efecte-speciale", className: "relative" },
            react_1["default"].createElement(image_1["default"], { src: curs_de_efecte_speciale_jpg_1["default"], alt: "Curs de efecte speciale", className: "w-[300px] h-auto" }),
            react_1["default"].createElement("div", { className: "flex items-center justify-center absolute bottom-0  bg-black text-white  h-[50px] z-10 w-full " },
                react_1["default"].createElement("h2", { className: "text-[16px] lg:text-[22px] font-extrabold text-center" }, "Curs De Efecte Speciale"))),
        react_1["default"].createElement(link_1["default"], { href: "/cursuri/curs-VIP", className: "relative" },
            react_1["default"].createElement(image_1["default"], { src: cursVip_jpeg_1["default"], alt: "Curs VIP", className: "w-[300px] h-auto" }),
            react_1["default"].createElement("div", { className: "flex items-center justify-center absolute bottom-0  bg-black text-white  h-[50px] z-10 w-full " },
                react_1["default"].createElement("h2", { className: "text-[16px] lg:text-[22px] font-extrabold text-center" }, "Curs VIP")))));
};
exports["default"] = HomeCoursesPreview;
