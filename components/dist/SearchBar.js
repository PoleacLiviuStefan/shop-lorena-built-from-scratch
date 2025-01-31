"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var fa6_1 = require("react-icons/fa6");
var SearchBar = function (_a) {
    var _b = _a.showSearchBar, showSearchBar = _b === void 0 ? false : _b;
    var _c = react_1.useState(""), query = _c[0], setQuery = _c[1];
    var handleSubmit = function (e) {
        e.preventDefault();
        console.log("Search query:", query);
        // Redirect to search results page
        window.location.href = "/cautari?query=" + encodeURIComponent(query);
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("form", { onSubmit: handleSubmit, className: "relative hidden lg:inline" },
            react_1["default"].createElement("input", { type: "text", value: query, onChange: function (e) { return setQuery(e.target.value); }, placeholder: "Caut\u0103 produse...", className: "w-full lg:w-[500px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" }),
            react_1["default"].createElement("button", { type: "submit", className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" },
                react_1["default"].createElement(fa6_1.FaMagnifyingGlass, null))),
        react_1["default"].createElement("div", { className: "absolute top-0 left-0 w-screen h-screen flex items-center justify-center bg-white  lg:hidden " + (showSearchBar ? "inline" : "hidden") },
            react_1["default"].createElement("form", { onSubmit: handleSubmit, className: "relative w-full px-4 " },
                react_1["default"].createElement("input", { type: "text", value: query, onChange: function (e) { return setQuery(e.target.value); }, placeholder: "Caut\u0103 produse...", className: "w-full  px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" }),
                react_1["default"].createElement("button", { type: "submit", className: "absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" },
                    react_1["default"].createElement(fa6_1.FaMagnifyingGlass, null))))));
};
exports["default"] = SearchBar;
