"use strict";
exports.__esModule = true;
var imageUrl_1 = require("@/lib/imageUrl");
var image_1 = require("next/image");
var link_1 = require("next/link");
var ProductThumb = function (_a) {
    var _b, _c, _d, _e;
    var product = _a.product;
    var getProductPrice = function (product) {
        if (product.variants && product.variants.length > 0) {
            var prices = product.variants.map(function (v) { var _a; return (_a = v.price) !== null && _a !== void 0 ? _a : 0; });
            return Math.min.apply(Math, prices);
        }
        return 0;
    };
    var productImage = (_b = product.images) === null || _b === void 0 ? void 0 : _b[0];
    var isOutofStock = (_d = (_c = product.variants) === null || _c === void 0 ? void 0 : _c.every(function (v) { var _a; return ((_a = v.stock) !== null && _a !== void 0 ? _a : 0) <= 0; })) !== null && _d !== void 0 ? _d : false;
    var price = getProductPrice(product);
    return (React.createElement(link_1["default"], { href: "/produs/" + ((_e = product.slug) === null || _e === void 0 ? void 0 : _e.current), className: "group" },
        React.createElement("div", { className: "flex justify-center relative aspect-[8/9] w-full overflow-hidden rounded-lg bg-white" },
            productImage && (React.createElement(image_1["default"], { className: "object-contain transition-transform duration-300 group-hover:scale-105", src: imageUrl_1.imageUrl(productImage).url(), alt: productImage.alt || product.name || "Product image", fill: true, sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw", priority: false, quality: 75 })),
            isOutofStock && (React.createElement("div", { className: "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50" },
                React.createElement("span", { className: "text-white font-bold text-lg" }, "Stoc indisponibil")))),
        React.createElement("div", { className: "flex flex-col mt-4" },
            React.createElement("h2", { className: "text-gray-600 font-bold text-sm lg:text-base truncate uppercase" }, product.name),
            React.createElement("div", { className: "flex items-center gap-2 mt-2" },
                React.createElement("span", { className: "text-base lg:text-lg font-bold" },
                    price.toFixed(2),
                    " lei"),
                React.createElement("span", { className: "text-xs text-gray-500" }, "TVA inclus")))));
};
exports["default"] = ProductThumb;
