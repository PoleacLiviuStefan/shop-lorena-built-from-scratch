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
var react_1 = require("react");
var nextjs_1 = require("@clerk/nextjs");
var store_1 = require("@/app/(store)/store");
var navigation_1 = require("next/navigation");
var createCheckoutSession_1 = require("@/app/actions/createCheckoutSession");
var fanCourier_1 = require("@/lib/fanCourier");
var Review = function (_a) {
    var isActive = _a.isActive, cart = _a.cart;
    var _b = react_1.useState(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = react_1.useState(false), mounted = _c[0], setMounted = _c[1];
    var router = navigation_1.useRouter();
    var isSignedIn = nextjs_1.useAuth().isSignedIn;
    var user = nextjs_1.useUser().user;
    // State pentru datele din store și cod promoțional
    var _d = react_1.useState({
        paymentMethod: null,
        groupedItems: [],
        shippingAddress: null,
        billingAddress: null,
        shippingCost: 0,
        promoCode: null,
        promoDiscount: 0,
        awb: ""
    }), storeData = _d[0], setStoreData = _d[1];
    // Hidratăm datele după montarea componentei
    react_1.useEffect(function () {
        var store = store_1["default"].getState();
        setStoreData({
            paymentMethod: store.paymentMethod,
            groupedItems: store.getGroupedItems(),
            shippingAddress: store.shippingAddress,
            billingAddress: store.billingAddress,
            shippingCost: store.shippingCost || 0,
            promoCode: store.promoCode || null,
            promoDiscount: store.promoDiscount || 0
        });
        setMounted(true);
    }, []);
    react_1.useEffect(function () {
        var store = store_1["default"].getState();
        setStoreData({
            paymentMethod: store.paymentMethod,
            groupedItems: store.getGroupedItems(),
            shippingAddress: store.shippingAddress,
            billingAddress: store.billingAddress,
            shippingCost: store.shippingCost || 0,
            promoCode: store.promoCode || null,
            promoDiscount: store.promoDiscount || 0
        });
    }, [store_1["default"](function (state) { return state.shippingAddress; }), store_1["default"](function (state) { return state.billingAddress; })]); // Adaugă dependențe pentru re-render
    var handleCheckout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var metadata, checkoutUrl, error_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!isSignedIn) {
                        console.error("User is not signed in.");
                        return [2 /*return*/];
                    }
                    if (!storeData.paymentMethod) {
                        console.error("No payment method selected.");
                        return [2 /*return*/];
                    }
                    if (storeData.groupedItems.length === 0) {
                        console.error("Cart is empty.");
                        return [2 /*return*/];
                    }
                    if (!storeData.shippingAddress) {
                        console.error("Shipping address is missing.");
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, 7, 8]);
                    console.log("storeData.paymentMethod", storeData.paymentMethod);
                    console.log("user este:", user);
                    if (!(storeData.paymentMethod === "card")) return [3 /*break*/, 3];
                    metadata = {
                        orderNumber: crypto.randomUUID(),
                        customerName: (_a = user === null || user === void 0 ? void 0 : user.fullName) !== null && _a !== void 0 ? _a : "Necunoscut",
                        customerEmail: (_c = (_b = user === null || user === void 0 ? void 0 : user.emailAddresses[0]) === null || _b === void 0 ? void 0 : _b.emailAddress) !== null && _c !== void 0 ? _c : "Necunoscut",
                        clerkUserId: user.id,
                        promoCode: storeData.promoCode,
                        promoDiscount: storeData.promoDiscount
                    };
                    return [4 /*yield*/, createCheckoutSession_1.createCheckoutSession(storeData.groupedItems, metadata, storeData.promoCode)];
                case 2:
                    checkoutUrl = _d.sent();
                    if (checkoutUrl) {
                        window.location.href = checkoutUrl;
                    }
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, handleCashOnDelivery()];
                case 4:
                    _d.sent();
                    _d.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_1 = _d.sent();
                    console.error("Error during checkout:", error_1);
                    return [3 /*break*/, 8];
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleCashOnDelivery = function () { return __awaiter(void 0, void 0, void 0, function () {
        var orderNumber, subtotal, discountAmount, finalTotal, awbNumber, response, data, error_2;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 4, , 5]);
                    orderNumber = crypto.randomUUID();
                    subtotal = storeData.groupedItems.reduce(function (total, item) { var _a; return total + ((_a = item.product.price) !== null && _a !== void 0 ? _a : 0) * item.quantity; }, 0);
                    discountAmount = storeData.promoDiscount ? (subtotal * storeData.promoDiscount) / 100 : 0;
                    finalTotal = subtotal - discountAmount + storeData.shippingCost;
                    return [4 /*yield*/, fanCourier_1.generateAwb({
                            cart: {
                                id: orderNumber,
                                shipping_address: {
                                    first_name: storeData.shippingAddress.firstName,
                                    last_name: storeData.shippingAddress.lastName,
                                    phone: storeData.shippingAddress.phone,
                                    email: (_b = (_a = user === null || user === void 0 ? void 0 : user.emailAddresses[0]) === null || _a === void 0 ? void 0 : _a.emailAddress) !== null && _b !== void 0 ? _b : "",
                                    province: storeData.shippingAddress.province,
                                    city: storeData.shippingAddress.city,
                                    address_1: storeData.shippingAddress.street,
                                    address_2: storeData.shippingAddress.streetNo,
                                    postal_code: storeData.shippingAddress.postalCode
                                }
                            }
                        })];
                case 1:
                    awbNumber = _f.sent();
                    console.log("storeData este:", storeData);
                    return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_BASE_URL + "/cash-on-delivery", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                orderNumber: orderNumber,
                                customerName: (_c = user === null || user === void 0 ? void 0 : user.fullName) !== null && _c !== void 0 ? _c : "Unknown",
                                customerEmail: (_e = (_d = user === null || user === void 0 ? void 0 : user.emailAddresses[0]) === null || _d === void 0 ? void 0 : _d.emailAddress) !== null && _e !== void 0 ? _e : "Unknown",
                                clerkUserId: user.id,
                                products: storeData.groupedItems.map(function (item) {
                                    var _a;
                                    return ({
                                        productId: item.product._id,
                                        name: item.product.name,
                                        price: ((_a = item.variant) === null || _a === void 0 ? void 0 : _a.price) || item.product.price,
                                        quantity: item.quantity,
                                        variant: item.variant ? {
                                            curbura: item.variant.curbura,
                                            grosime: item.variant.grosime,
                                            marime: item.variant.marime,
                                            price: item.variant.price,
                                            stock: item.variant.stock
                                        } : null
                                    });
                                }),
                                promoCode: storeData.promoCode,
                                discount: storeData.promoDiscount,
                                subtotal: subtotal,
                                discountAmount: discountAmount,
                                shippingCost: storeData.shippingCost,
                                totalPrice: finalTotal,
                                currency: "RON",
                                address: storeData.shippingAddress,
                                billingAddress: storeData.billingAddress,
                                awb: awbNumber
                            })
                        })];
                case 2:
                    response = _f.sent();
                    if (!response.ok)
                        throw new Error("Error processing cash-on-delivery order.");
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _f.sent();
                    router.push("/success?orderNumber=" + orderNumber);
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _f.sent();
                    console.error("Error handling cash-on-delivery:", error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Nu renderăm nimic până când componenta nu e montată
    if (!mounted) {
        return null;
    }
    return (React.createElement("div", { className: "bg-white p-6 rounded-lg shadow-sm" },
        React.createElement("div", { className: "flex flex-row items-center justify-between mb-6" },
            React.createElement("h2", { className: "text-2xl font-bold" }, "Finalizare Comand\u0103")),
        storeData.promoCode && storeData.promoDiscount > 0 && (React.createElement("div", { className: "mb-4 p-3 bg-green-50 rounded-lg" },
            React.createElement("p", { className: "text-green-700 text-sm" },
                "Cod promo\u021Bional aplicat: ",
                storeData.promoCode,
                " (-",
                storeData.promoDiscount,
                "%)"))),
        React.createElement("p", { className: "lg:text-[14px] text-[12px]" }, "F\u0103c\u00E2nd clic pe butonul \u201EPlaseaz\u0103 Comanda\", confirma\u021Bi c\u0103 a\u021Bi citit, \u00EEn\u021Beles \u0219i acceptat Termenii de Utilizare, Termenii de V\u00E2nzare \u0219i Politica de Retur \u0219i recunoa\u0219te\u021Bi c\u0103 a\u021Bi citit Politica de Confiden\u021Bialitate a magazinului LorenaLash."),
        React.createElement("button", { onClick: handleCheckout, disabled: isLoading, className: "w-full mt-8 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors" }, isLoading ? (React.createElement("span", { className: "flex items-center justify-center gap-2" },
            React.createElement("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin", "aria-label": "Se \u00EEncarc\u0103" }),
            "Se proceseaz\u0103...")) : ("Finalizează Comanda"))));
};
exports["default"] = Review;
