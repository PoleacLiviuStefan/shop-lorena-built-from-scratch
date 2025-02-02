"use client";
"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
// Aceasta este o Client Component
function InteractiveList() {
    return (React.createElement("ul", { className: 'w-[10rem] mt-[1rem] lg:mt-0' },
        React.createElement("li", { className: 'font-bold' }, "Navigare"),
        React.createElement("li", { className: 'mt-[1rem] cursor-pointer text-[14px]' },
            React.createElement(link_1["default"], { href: "/" }, "ACASA")),
        React.createElement("li", { className: 'cursor-pointer text-[14px]' },
            React.createElement(link_1["default"], { href: "/magazin" }, "MAGAZIN")),
        React.createElement("li", { className: 'cursor-pointer text-[14px]' },
            React.createElement(link_1["default"], { href: "/cursuri" }, "CURSURI PROFESIONALE")),
        React.createElement("li", { className: 'cursor-pointer text-[14px]' },
            React.createElement(link_1["default"], { href: "/contact" }, "CONTACT")),
        React.createElement("li", { className: 'cursor-pointer text-[14px]' },
            React.createElement(link_1["default"], { href: "/suport" }, "SUPORT"))));
}
exports["default"] = InteractiveList;
