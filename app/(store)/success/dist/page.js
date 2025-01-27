"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var browser_1 = require("@emailjs/browser");
var button_1 = require("@/components/ui/button");
var link_1 = require("next/link");
var store_1 = require("../store");
var imageUrl_1 = require("@/lib/imageUrl");
var image_1 = require("next/image");
var updateProductStock_1 = require("@/lib/updateProductStock");
var lucide_react_1 = require("lucide-react");
var SuccessPage = function () {
    var searchParams = navigation_1.useSearchParams();
    var orderNumber = searchParams.get("orderNumber");
    var _a = react_1.useState(null), orderDetails = _a[0], setOrderDetails = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var emailSentRef = react_1.useRef(false);
    var stockUpdatedRef = react_1.useRef(false);
    // const awbGeneratedRef = useRef(false);
    var clearBasket = store_1["default"](function (store) { return store.clearBasket; });
    react_1.useEffect(function () {
        var fetchOrderDetails = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, data, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, 6, 7]);
                        return [4 /*yield*/, fetch("/orders/" + orderNumber, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Failed to fetch order details");
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        setOrderDetails(data);
                        console.log("datele comenzii: ", data);
                        if (!!stockUpdatedRef.current) return [3 /*break*/, 4];
                        return [4 /*yield*/, updateProductStock_1.updateProductStock(data.products)];
                    case 3:
                        result = _a.sent();
                        if (!result.success) {
                            console.error("Eroare la actualizarea stocului:", result.error);
                        }
                        stockUpdatedRef.current = true;
                        _a.label = 4;
                    case 4:
                        // if (!awbGeneratedRef.current) {
                        //   try {
                        //     const awbNumber = await generateAwb({
                        //       cart: {
                        //         id: data.orderNumber,
                        //         shipping_address: {
                        //           first_name: data.address.firstName.split(" ").slice(0, -1).join(" "),
                        //           last_name: data.address.lastName.split(" ").slice(-1).join(" "),
                        //           phone: data.address.phone,
                        //           email: data.address.email,
                        //           province: data.address.province,
                        //           city: data.address.city,
                        //           address_1: data.address.street,
                        //           postal_code: data.address.postalCode,
                        //         },
                        //       },
                        //     });
                        //     console.log("AWB generat cu succes:", awbNumber);
                        //   } catch (error) {
                        //     console.error("Eroare la generarea AWB:", error);
                        //   }
                        //   awbGeneratedRef.current = true;
                        // }
                        // Trimite email doar dacă nu a fost trimis anterior
                        if (!emailSentRef.current) {
                            sendEmail(data);
                            emailSentRef.current = true;
                        }
                        return [3 /*break*/, 7];
                    case 5:
                        err_1 = _a.sent();
                        setError(err_1.message);
                        return [3 /*break*/, 7];
                    case 6:
                        setLoading(false);
                        clearBasket();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        if (orderNumber) {
            fetchOrderDetails();
        }
        else {
            setError("Order number not found");
            setLoading(false);
        }
    }, [orderNumber]);
    var handleDownloadInvoice = function (orderNumber) { return __awaiter(void 0, void 0, void 0, function () {
        var response, blob, url, a, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("/invoice/" + orderNumber + "/download")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.blob()];
                case 2:
                    blob = _a.sent();
                    url = window.URL.createObjectURL(blob);
                    a = document.createElement('a');
                    a.href = url;
                    a.download = "factura_" + orderNumber + ".pdf";
                    a.click();
                    window.URL.revokeObjectURL(url);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var sendEmail = function (details) { return __awaiter(void 0, void 0, void 0, function () {
        var emailData, notificationData, error_2;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    _l.trys.push([0, 2, , 3]);
                    emailData = {
                        order_id: details.orderNumber,
                        order_awb: details.awb,
                        order_date: new Date().toLocaleDateString(),
                        payment_method: details.paymentType === "card" ? "Card" : "Ramburs",
                        order_total: details.totalPrice.toFixed(2) + " " + details.currency,
                        order_discount: details.discount,
                        order_promo_code: details.promoCode,
                        order_products_total: (details.totalPrice - details.shippingCost).toFixed(2) + " " + details.currency,
                        order_shipping_cost: details.shippingCost.toFixed(2) + " " + details.currency,
                        order_products: details.products.map(function (product) { return (product.product.name + " - " + (product.variant
                            ? "Curbura: " + product.variant.curbura + ", Grosime: " + product.variant.grosime + ", M\u0103rime: " + product.variant.marime
                            : "Standard") + " - Cantitate: " + product.quantity); }).join("\n"),
                        client_last_name: details.address.lastName,
                        client_first_name: details.address.firstName,
                        client_email: details.address.email,
                        client_phone: details.address.phone,
                        client_province: details.address.province,
                        client_locality: details.address.city,
                        client_address: details.address.street,
                        invoice_url: details.invoice ?
                            process.env.NEXT_PUBLIC_BASE_URL + "/invoice/" + details.invoice + "/download" :
                            null,
                        client_type: ((_a = details.billingAddress) === null || _a === void 0 ? void 0 : _a.isLegalEntity) ? "Persoană Juridică" : "Persoană Fizică",
                        company_name: ((_b = details.billingAddress) === null || _b === void 0 ? void 0 : _b.companyName) || "",
                        company_CUI: ((_c = details.billingAddress) === null || _c === void 0 ? void 0 : _c.cui) || "",
                        comany_registry: ((_d = details.billingAddress) === null || _d === void 0 ? void 0 : _d.tradeRegisterNumber) || "",
                        company_address: ((_e = details.billingAddress) === null || _e === void 0 ? void 0 : _e.companyAddress) || "",
                        company_province: ((_f = details.billingAddress) === null || _f === void 0 ? void 0 : _f.companyCounty) || "",
                        company_city: ((_g = details.billingAddress) === null || _g === void 0 ? void 0 : _g.companyCity) || "",
                        company_postal_code: ((_h = details.billingAddress) === null || _h === void 0 ? void 0 : _h.companyPostalCode) || "",
                        company_bank_name: ((_j = details.billingAddress) === null || _j === void 0 ? void 0 : _j.bankName) || "",
                        company_IBAN: ((_k = details.billingAddress) === null || _k === void 0 ? void 0 : _k.iban) || ""
                    };
                    notificationData = {
                        client_last_name: details.customerName.split(" ").slice(-1).join(" "),
                        client_first_name: details.customerName.split(" ").slice(0, -1).join(" "),
                        client_email: details.address.email,
                        order_id: details.orderNumber,
                        order_discount: details.discount,
                        order_promo_code: details.promoCode,
                        order_products: emailData.order_products,
                        awb: details.awb,
                        invoice_url: emailData.invoice_url,
                        order_total: emailData.order_total,
                        order_products_total: emailData.order_products_total,
                        order_shipping_cost: emailData.order_shipping_cost
                    };
                    return [4 /*yield*/, Promise.all([
                            browser_1["default"].send("service_5kulkwh", "template_soo87le", emailData, "uSA0IVA9aGhfzQfPC"),
                            browser_1["default"].send("service_5kulkwh", "template_kbk4s1r", notificationData, "uSA0IVA9aGhfzQfPC")
                        ])];
                case 1:
                    _l.sent();
                    console.log("Emailuri trimise cu succes!");
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _l.sent();
                    console.error("Eroare la trimiterea emailurilor:", error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (React.createElement("div", { className: "flex items-center justify-center min-h-screen" },
            React.createElement("p", null, "Se \u00EEncarc\u0103...")));
    }
    if (error) {
        return (React.createElement("div", { className: "flex items-center justify-center min-h-screen" },
            React.createElement("p", null,
                "Eroare: ",
                error)));
    }
    var customerName = orderDetails.customerName, invoice = orderDetails.invoice, email = orderDetails.email, address = orderDetails.address, products = orderDetails.products, totalPrice = orderDetails.totalPrice, shippingCost = orderDetails.shippingCost, currency = orderDetails.currency, paymentType = orderDetails.paymentType, awb = orderDetails.awb, billingAddress = orderDetails.billingAddress;
    return (React.createElement("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-50" },
        React.createElement("div", { className: "bg-white p-12 rounded-xl shadow-lg max-w-3xl w-full mx-4" },
            React.createElement("div", { className: "flex justify-center mb-8" },
                React.createElement("div", { className: "h-16 w-16 bg-green-100 rounded-full flex items-center justify-center" },
                    React.createElement("svg", { className: "h-8 w-8 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" })))),
            React.createElement("h1", { className: "text-4xl font-bold mb-6 text-center" }, "Mul\u021Bumim pentru comand\u0103!"),
            React.createElement("div", { className: "border-t border-b border-gray-200 py-6 mb-6" },
                React.createElement("p", { className: "text-lg text-gray-700 mb-4" }, "Comanda ta a fost \u00EEnregistrat\u0103 cu succes."),
                invoice.number && (React.createElement("button", { onClick: function () { return handleDownloadInvoice(invoice.number); }, className: "text-blue-600 hover:text-blue-800 flex items-center" },
                    React.createElement(lucide_react_1.FileText, { className: "w-4 h-4 mr-2" }),
                    "Descarc\u0103 Factura")),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement("p", { className: "text-gray-600" },
                        React.createElement("strong", null, "Num\u0103r comand\u0103:"),
                        " ",
                        orderNumber),
                    React.createElement("p", { className: "text-gray-600" },
                        React.createElement("strong", null, "Client:"),
                        " ",
                        address.lastName,
                        " ",
                        address.firstName),
                    React.createElement("p", { className: "text-gray-600" },
                        React.createElement("strong", null, "Email:"),
                        " ",
                        address.email),
                    React.createElement("p", { className: "text-gray-600" },
                        React.createElement("strong", null, "Adres\u0103 de livrare:"),
                        " ", address.street + ", " + address.city + ", " + address.province + ", " + address.postalCode),
                    React.createElement("p", { className: "text-gray-600" },
                        React.createElement("strong", null, "Metod\u0103 de plat\u0103:"),
                        " ",
                        paymentType === "card" ? "Card" : "Ramburs"),
                    React.createElement("p", { className: "text-gray-600" },
                        React.createElement("strong", null,
                            "AWB: ",
                            awb),
                        " "),
                    billingAddress.cui && (React.createElement(React.Fragment, null,
                        React.createElement("p", { className: "text-gray-600" },
                            React.createElement("strong", null,
                                "CUI: ",
                                billingAddress.cui),
                            " "),
                        React.createElement("p", { className: "text-gray-600" },
                            React.createElement("strong", null, "Companie:"),
                            " ",
                            billingAddress.companyName))))),
            React.createElement("div", { className: "mb-6" },
                React.createElement("h2", { className: "text-2xl font-semibold mb-4" }, "Produse comandate"),
                React.createElement("ul", { className: "space-y-4" }, products.map(function (product) { return (React.createElement("li", { key: product.product._id, className: "flex justify-between items-center" },
                    React.createElement("div", null,
                        React.createElement(image_1["default"], { src: imageUrl_1.imageUrl(product.product.image).url(), alt: product.product.name, width: 80, height: 80, className: "object-cover rounded" }),
                        React.createElement("p", { className: "font-medium text-gray-900 uppercase" }, product.product.name),
                        product.variant ? (React.createElement("div", { className: "text-sm text-gray-600 mt-1" },
                            React.createElement("p", null,
                                "Curbura: ",
                                product.variant.curbura),
                            React.createElement("p", null,
                                "Grosime: ",
                                product.variant.grosime),
                            React.createElement("p", null,
                                "M\u0103rime: ",
                                product.variant.marime))) : (React.createElement("p", { className: "text-sm text-gray-600 mt-1" }, "Standard")),
                        React.createElement("p", { className: "text-sm text-gray-600" },
                            "Cantitate: ",
                            product.quantity)),
                    React.createElement("p", { className: "text-gray-700" },
                        (product.product.price * product.quantity).toFixed(2),
                        " ",
                        currency))); }))),
            React.createElement("div", { className: "border-t border-gray-200 pt-4" },
                React.createElement("div", { className: "flex justify-between mb-2" },
                    React.createElement("span", { className: "text-gray-600" }, "Cost livrare:"),
                    React.createElement("span", { className: "text-gray-800 font-medium" },
                        shippingCost.toFixed(2),
                        " ",
                        currency)),
                React.createElement("div", { className: "flex justify-between mb-2" },
                    React.createElement("span", { className: "text-gray-600" }, "Total produse:"),
                    React.createElement("span", { className: "text-gray-800 font-medium" },
                        (totalPrice - shippingCost).toFixed(2),
                        " ",
                        currency)),
                React.createElement("div", { className: "flex justify-between text-lg font-semibold" },
                    React.createElement("span", null, "Total de plat\u0103:"),
                    React.createElement("span", null,
                        totalPrice.toFixed(2),
                        " ",
                        currency))),
            React.createElement("div", { className: "space-y-4 mt-8" },
                React.createElement("p", { className: "text-gray-600" }, "A fost trimis un email de confirmare!"),
                React.createElement("div", { className: "flex flex-col sm:flex-row gap-4 justify-center" },
                    React.createElement(button_1.Button, { asChild: true, className: "bg-green-600 hover:bg-green-700" },
                        React.createElement(link_1["default"], { href: "/comenzi" }, "Vezi detaliile comenzii")),
                    React.createElement(button_1.Button, { asChild: true, variant: "outline" },
                        React.createElement(link_1["default"], { href: "/" }, "\u00CEnapoi la magazin")))))));
};
exports["default"] = SuccessPage;
