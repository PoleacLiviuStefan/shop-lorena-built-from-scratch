'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var image_1 = require("next/image");
var lucide_react_1 = require("lucide-react");
var store_1 = require("../app/(store)/store");
var imageUrl_1 = require("@/lib/imageUrl");
var link_1 = require("next/link");
var button_1 = require("@/components/ui/button");
var CartPreview = function () {
    var _a = react_1.useState(false), isOpen = _a[0], setIsOpen = _a[1];
    var dropdownRef = react_1.useRef(null);
    var groupedItems = store_1["default"](function (state) { return state.getGroupedItems(); });
    var totalPrice = store_1["default"](function (state) { return state.getTotalPrice(); });
    var removeItem = store_1["default"](function (state) { return state.removeItem; });
    var totalItems = groupedItems.reduce(function (total, item) { return total + item.quantity; }, 0);
    var handleRemove = function (productId, variant) {
        removeItem(productId, variant);
    };
    var handleOpen = function () {
        setIsOpen(true);
    };
    var handleClose = function () {
        setIsOpen(false);
    };
    // Click outside handler
    react_1.useEffect(function () {
        var handleClickOutside = function (event) {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                handleClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    return (react_1["default"].createElement("div", { ref: dropdownRef, className: "relative h-full z-50", onMouseEnter: handleOpen, onMouseLeave: handleClose },
        react_1["default"].createElement("button", { className: "h-full flex items-center justify-center gap-1 px-2" },
            react_1["default"].createElement(lucide_react_1.ShoppingCart, { className: "w-5 h-5" }),
            react_1["default"].createElement("span", { className: "hidden lg:inline-block text-sm font-medium" },
                "COS",
                totalItems > 0 && " (" + totalItems + ")"),
            totalItems > 0 && (react_1["default"].createElement("span", { className: "lg:hidden absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" }, totalItems))),
        isOpen && (react_1["default"].createElement("div", { className: "absolute top-full right-0 bg-white border shadow-lg w-[280px] lg:w-[420px] rounded-lg transition-all duration-200 ease-out transform" },
            react_1["default"].createElement("div", { className: "p-4 flex items-center justify-between border-b" },
                react_1["default"].createElement("h3", { className: "font-semibold" }, "Co\u0219"),
                react_1["default"].createElement("button", { onClick: handleClose, className: "lg:hidden text-gray-500 hover:text-black" },
                    react_1["default"].createElement(lucide_react_1.X, { className: "w-4 h-4" }))),
            groupedItems.length > 0 ? (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement("div", { className: "max-h-[300px] lg:max-h-[402px] overflow-y-auto px-4" }, groupedItems.map(function (item) {
                    var _a, _b, _c;
                    return (react_1["default"].createElement("div", { key: item.product._id, className: "py-4 border-b flex gap-4 group" },
                        react_1["default"].createElement("div", { className: "w-[90px] lg:w-[110px] h-[90px] lg:h-[110px] relative flex-shrink-0" }, ((_a = item.product.images) === null || _a === void 0 ? void 0 : _a[0]) && (react_1["default"].createElement(image_1["default"], { src: imageUrl_1.imageUrl(item.product.images[0]).url(), alt: item.product.name || 'Imagine Produs', className: "object-cover rounded", fill: true }))),
                        react_1["default"].createElement("div", { className: "flex-1 min-w-0" },
                            react_1["default"].createElement("div", { className: "flex justify-between" },
                                react_1["default"].createElement("div", { className: "pr-2" },
                                    react_1["default"].createElement("h4", { className: "font-medium text-sm truncate" }, item.product.name),
                                    react_1["default"].createElement("p", { className: "text-sm text-gray-600 mt-1" },
                                        "Buc\u0103\u021Bi: ",
                                        item.quantity),
                                    react_1["default"].createElement("button", { onClick: function () {
                                            return handleRemove(item.product._id, item.variant);
                                        }, className: "text-sm text-red-500 hover:text-red-700 mt-1" }, "\u0218terge")),
                                react_1["default"].createElement("p", { className: "font-medium" },
                                    (((_c = (_b = item.variant) === null || _b === void 0 ? void 0 : _b.price) !== null && _c !== void 0 ? _c : 0) * item.quantity).toFixed(2),
                                    " lei")))));
                })),
                react_1["default"].createElement("div", { className: "p-2 lg:p-4 border-t space-y-2 lg:space-y-4" },
                    react_1["default"].createElement("div", { className: "flex justify-between items-center" },
                        react_1["default"].createElement("span", { className: "font-semibold" },
                            "Total ",
                            react_1["default"].createElement("span", { className: "font-normal text-gray-600" }, "(incl. TVA)")),
                        react_1["default"].createElement("span", { className: "font-semibold" },
                            totalPrice.toFixed(2),
                            " lei")),
                    react_1["default"].createElement(link_1["default"], { href: "/cos", className: "block" },
                        react_1["default"].createElement(button_1.Button, { className: "w-full bg-black hover:bg-gray-800", onClick: handleClose }, "Spre co\u0219"))))) : (react_1["default"].createElement("div", { className: "py-16 flex flex-col items-center gap-4" },
                react_1["default"].createElement("div", { className: "bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center" }, "0"),
                react_1["default"].createElement("p", { className: "text-gray-500" }, "Co\u0219ul este gol"),
                react_1["default"].createElement(link_1["default"], { href: "/magazin" },
                    react_1["default"].createElement(button_1.Button, { onClick: handleClose }, "Exploreaz\u0103 produse"))))))));
};
exports["default"] = CartPreview;
