"use client";
"use strict";
exports.__esModule = true;
var nextjs_1 = require("@clerk/nextjs");
var link_1 = require("next/link");
var image_1 = require("next/image");
var icons_1 = require("@sanity/icons");
var react_1 = require("react");
var store_1 = require("@/app/(store)/store");
var logo_png_1 = require("../public/Imagini/logo.png");
var fi_1 = require("react-icons/fi");
var CartPreview_1 = require("./CartPreview");
var SearchBar_1 = require("./SearchBar");
var HamburgerMenu_1 = require("./HamburgerMenu");
var Header = function (_a) {
    var categories = _a.categories;
    var user = nextjs_1.useUser().user;
    var itemCount = store_1["default"](function (state) {
        return state.items.reduce(function (total, item) { return total + item.quantity; }, 0);
    });
    var _b = react_1.useState(false), showCourses = _b[0], setShowCourses = _b[1];
    var _c = react_1.useState(false), showSearchBar = _c[0], setShowSearchBar = _c[1];
    var _d = react_1.useState(false), showCategories = _d[0], setShowCategories = _d[1];
    console.log("categories", categories);
    var coursesList = [
        { name: "ONLINE", href: "/cursuri/online" },
        { name: "CURS DE BAZA 1D-3D & FOXY", href: "/cursuri/curs-de-baza" },
        { name: "CURS DE BAZA PREMIUM (BAZA&EFECTE)", href: "/cursuri/curs-de-baza-premium" },
        { name: "CURS DE EFECTE SPECIALE", href: "/cursuri/curs-de-efecte-speciale" },
        { name: "CURS VIP", href: "/cursuri/curs-vip" },
    ];
    return (React.createElement("header", { className: "fixed top-0 z-50 bg-white w-full shadow-md" },
        React.createElement("div", { className: "flex flex-col flex-wrap justify-between lg:justify-center items-center gap-4 px-4 pt-4 h-[60px] lg:h-full" },
            React.createElement("div", { className: "flex items-center w-full" },
                React.createElement("div", { className: "lg:hidden flex items-center justify-between w-full" },
                    React.createElement(HamburgerMenu_1["default"], { categories: categories }),
                    React.createElement(link_1["default"], { href: "/", className: "absolute left-1/2 transform -translate-x-1/2 " },
                        React.createElement(image_1["default"], { src: logo_png_1["default"], alt: "Logo", className: "w-[75px] lg:w-[90px] " })),
                    React.createElement("div", { className: "flex items-center gap-2" },
                        user &&
                            React.createElement(link_1["default"], { href: "/comenzi", className: "flex items-center hover:opacity-50 cursor-pointer" },
                                React.createElement(icons_1.PackageIcon, { className: "text-[28px] " })),
                        React.createElement(CartPreview_1["default"], null),
                        user ? React.createElement(nextjs_1.UserButton, null) : React.createElement(nextjs_1.SignInButton, { mode: "modal" },
                            React.createElement("button", { className: "px-2 py-1 text-[14px] bg-[#FFC2EA] transition-colors rounded hover:bg-[#FC86D4]" }, "Autentificare")))),
                React.createElement("div", { className: "hidden lg:flex items-center justify-center w-full" },
                    React.createElement("div", { className: "flex flex-col items-center justify-center w-full " },
                        React.createElement("div", { className: "flex items-center justify-between lg:justify-center w-full " },
                            React.createElement(link_1["default"], { href: "/", className: "flex justify-center text-2xl font-bold text-blue-500 hover:opacity-50 cursor-pointer" },
                                React.createElement(image_1["default"], { src: logo_png_1["default"], alt: "Logo", className: "w-[95px] mr-5" })),
                            React.createElement("div", { className: "flex items-center gap-4" },
                                React.createElement(SearchBar_1["default"], null),
                                React.createElement("div", { className: "flex items-center gap-4" },
                                    React.createElement(CartPreview_1["default"], null),
                                    user &&
                                        React.createElement(link_1["default"], { href: "/comenzi", className: "flex items-center hover:opacity-50 cursor-pointer" },
                                            React.createElement("span", { className: "font-bold text-[12px] text-gray-600" }, "COMENZI"),
                                            React.createElement(icons_1.PackageIcon, { className: "text-[24px]  ml-1" })),
                                    user ? (React.createElement("div", { className: "hover:opacity-50 cursor-pointer" },
                                        user.fullName,
                                        " ",
                                        React.createElement(nextjs_1.UserButton, null))) : (React.createElement("div", { className: " cursor-pointer" },
                                        React.createElement(nextjs_1.SignInButton, { mode: "modal" },
                                            React.createElement("button", { className: "px-4 py-2 bg-[#FFC2EA] transition-colors rounded hover:bg-[#FC86D4]" }, "Autentificare"))))))),
                        React.createElement("div", { className: "flex justify-center space-x-12 " },
                            React.createElement(link_1["default"], { href: "/", className: "hover:opacity-50 cursor-pointer" }, "ACASA"),
                            React.createElement("div", { className: "relative group", onMouseEnter: function () { return setShowCategories(true); }, onMouseLeave: function () { return setShowCategories(false); } },
                                React.createElement("span", { className: "hover:opacity-50 cursor-pointer flex items-center" },
                                    "MAGAZIN",
                                    showCategories ? React.createElement(fi_1.FiChevronUp, { className: "ml-1" }) : React.createElement(fi_1.FiChevronDown, { className: "ml-1" })),
                                showCategories && (React.createElement("ul", { className: "absolute w-[250px] top-full left-0 bg-white shadow-lg px-3 py-2 z-50 " }, categories.map(function (category) { return (React.createElement("li", { key: category.href, className: "uppercase py-2" },
                                    React.createElement(link_1["default"], { href: category.href, className: "hover:opacity-50 cursor-pointer w-full block" }, category.name))); })))),
                            React.createElement("div", { className: "relative group", onMouseEnter: function () { return setShowCourses(true); }, onMouseLeave: function () { return setShowCourses(false); } },
                                React.createElement(link_1["default"], { href: "/cursuri", className: "hover:opacity-50 cursor-pointer flex items-center" },
                                    "CURSURI PROFESIONALE",
                                    showCourses ? React.createElement(fi_1.FiChevronUp, { className: "ml-1" }) : React.createElement(fi_1.FiChevronDown, { className: "ml-1" })),
                                showCourses && (React.createElement("ul", { className: "absolute w-[250px] top-full left-0 bg-white shadow-lg px-3 py-2 z-50" }, coursesList.map(function (course) { return (React.createElement("li", { key: course.href, className: "py-2" },
                                    React.createElement(link_1["default"], { href: course.href, className: "hover:opacity-50 cursor-pointer w-full block" }, course.name))); })))),
                            React.createElement(link_1["default"], { href: "/contact", className: "hover:opacity-50 cursor-pointer" }, "CONTACT"),
                            React.createElement(link_1["default"], { href: "/suport", className: "hover:opacity-50 cursor-pointer" }, "SUPORT"))))))));
};
exports["default"] = Header;
