'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var fi_1 = require("react-icons/fi");
var link_1 = require("next/link");
var image_1 = require("next/image");
var logo_png_1 = require("../public/Imagini/logo.png");
var fa6_1 = require("react-icons/fa6");
var SearchBar_1 = require("./SearchBar");
var menuItems = {
    ACASĂ: '/',
    MAGAZIN: '/magazin',
    'CURSURI PROFESIONALE': [
        { name: "ONLINE", href: "/cursuri/online" },
        { name: "CURS DE BAZA 1D-3D & FOXY", href: "/cursuri/curs-de-baza" },
        { name: "CURS DE BAZA PREMIUM (BAZA&EFECTE)", href: "/cursuri/curs-de-baza-premium" },
        { name: "CURS DE EFECTE SPECIALE", href: "/cursuri/curs-de-efecte-speciale" },
        { name: "CURS VIP", href: "/cursuri/curs-vip" },
    ],
    CONTACT: '/contact',
    SUPORT: '/suport'
};
function HamburgerMenu(_a) {
    var categories = _a.categories;
    var _b = react_1.useState(false), menuOpen = _b[0], setMenuOpen = _b[1];
    var _c = react_1.useState(false), dropdownOpen = _c[0], setDropdownOpen = _c[1];
    var _d = react_1.useState(false), cursuriDropdownOpen = _d[0], setCursuriDropdownOpen = _d[1];
    var _e = react_1.useState(false), showSearchModal = _e[0], setShowSearchModal = _e[1];
    // Funcție helper pentru a verifica dacă linkData este un array de MenuItem
    var isMenuItemArray = function (linkData) {
        return Array.isArray(linkData);
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        showSearchModal && (react_1["default"].createElement("div", { className: "fixed inset-0 z-50 bg-white" },
            react_1["default"].createElement("div", { className: "relative h-full" },
                react_1["default"].createElement("div", { className: "flex items-center justify-center h-full" },
                    react_1["default"].createElement(SearchBar_1["default"], { showSearchBar: showSearchModal }))))),
        react_1["default"].createElement("div", { className: "flex items-center relative z-50" },
            react_1["default"].createElement("button", { className: "text-2xl", onClick: function () { return setMenuOpen(!menuOpen); } }, menuOpen ? react_1["default"].createElement(fi_1.FiX, null) : react_1["default"].createElement(fi_1.FiMenu, null)),
            react_1["default"].createElement("button", { onClick: function () { return setShowSearchModal(!showSearchModal); }, className: "absolute left-[40px] text-xl" }, showSearchModal ? react_1["default"].createElement(fi_1.FiX, null) : react_1["default"].createElement(fa6_1.FaMagnifyingGlass, null))),
        showSearchModal && (react_1["default"].createElement("div", { className: "fixed inset-0 z-40 bg-white" },
            react_1["default"].createElement("div", { className: "relative h-full" },
                react_1["default"].createElement("button", { onClick: function () { return setShowSearchModal(false); }, className: "absolute top-4 right-4 z-50 text-[24px] border-[1px] border-gray-400 p-[4px]" },
                    react_1["default"].createElement(fi_1.FiX, null)),
                react_1["default"].createElement("div", { className: "flex items-center justify-center h-full" },
                    react_1["default"].createElement(SearchBar_1["default"], { showSearchBar: showSearchModal }))))),
        menuOpen && (react_1["default"].createElement("div", { className: "fixed inset-0 bg-black opacity-50 z-40", onClick: function () { return setMenuOpen(false); } })),
        react_1["default"].createElement("div", { className: "fixed top-0 left-0 h-full w-[320px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 " + (menuOpen ? 'translate-x-0' : '-translate-x-full') },
            react_1["default"].createElement("div", { className: "relative w-full flex items-center justify-center p-8" },
                react_1["default"].createElement(image_1["default"], { src: logo_png_1["default"], alt: "logo", className: "h-[120px] w-auto" }),
                react_1["default"].createElement("button", { onClick: function () { return setMenuOpen(false); }, className: "absolute right-4 text-[16px] border-[1px] border-gray-400 p-[4px]" },
                    react_1["default"].createElement(fi_1.FiX, null))),
            react_1["default"].createElement("ul", { className: "p-4 mt-[20px]" }, Object.entries(menuItems).map(function (_a) {
                var name = _a[0], linkData = _a[1];
                return (react_1["default"].createElement("li", { key: name, className: "relative py-2 text-black" },
                    typeof linkData === 'string' && name !== "MAGAZIN" ? (react_1["default"].createElement(link_1["default"], { href: linkData, className: "text-[16px] leading-10 hover:text-ui-fg-base", onClick: function () { return setMenuOpen(false); } }, name)) : (react_1["default"].createElement("div", { className: "flex flex-col" },
                        react_1["default"].createElement("button", { className: "flex justify-between items-center text-[16px] leading-10 hover:text-ui-fg-base", onClick: function () {
                                if (name === 'CURSURI PROFESIONALE') {
                                    setCursuriDropdownOpen(function (prev) { return !prev; });
                                }
                                else if (name === 'MAGAZIN') {
                                    setDropdownOpen(function (prev) { return !prev; });
                                }
                            } },
                            name,
                            name === 'CURSURI PROFESIONALE' ? (cursuriDropdownOpen ? react_1["default"].createElement(fi_1.FiChevronUp, null) : react_1["default"].createElement(fi_1.FiChevronDown, null)) : name === 'MAGAZIN' ? (dropdownOpen ? react_1["default"].createElement(fi_1.FiChevronUp, null) : react_1["default"].createElement(fi_1.FiChevronDown, null)) : null),
                        name === 'CURSURI PROFESIONALE' && cursuriDropdownOpen && isMenuItemArray(linkData) && (react_1["default"].createElement("ul", { className: "pl-4" }, linkData.map(function (course) { return (react_1["default"].createElement("li", { key: course.name, className: "py-2" },
                            react_1["default"].createElement(link_1["default"], { href: course.href, className: "text-[14px] hover:text-ui-fg-base", onClick: function () { return setMenuOpen(false); } }, course.name))); }))),
                        name === 'MAGAZIN' && dropdownOpen && (react_1["default"].createElement("ul", { className: "pl-4" },
                            react_1["default"].createElement("li", { className: "py-2" },
                                react_1["default"].createElement(link_1["default"], { href: "/magazin", className: "text-[14px] hover:text-ui-fg-base", onClick: function () { return setMenuOpen(false); } }, "TOATE PRODUSELE")), categories === null || categories === void 0 ? void 0 :
                            categories.map(function (category) { return (react_1["default"].createElement("li", { key: category.href, className: "py-2" },
                                react_1["default"].createElement(link_1["default"], { href: category.href, className: "text-[14px] hover:text-ui-fg-base uppercase", onClick: function () { return setMenuOpen(false); } }, category.name))); }))))),
                    react_1["default"].createElement("span", { className: "absolute left-0 bottom-0 w-full h-[1px] bg-gray-200" })));
            })))));
}
exports["default"] = HamburgerMenu;
