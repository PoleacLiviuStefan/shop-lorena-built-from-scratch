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
exports.POST = void 0;
var backendClient_1 = require("@/sanity/lib/backendClient");
var server_1 = require("next/server");
var generateInvoice_1 = require("@/lib/generateInvoice");
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var body, orderNumber, customerName, customerEmail, clerkUserId, products, totalPrice, currency, address, billingAddress, shippingCost, awb, discount, promoCode, invoiceNumber, items, invoice, error_1, sanityProducts, order, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, req.json()];
                case 1:
                    body = _a.sent();
                    orderNumber = body.orderNumber, customerName = body.customerName, customerEmail = body.customerEmail, clerkUserId = body.clerkUserId, products = body.products, totalPrice = body.totalPrice, currency = body.currency, address = body.address, billingAddress = body.billingAddress, shippingCost = body.shippingCost, awb = body.awb, discount = body.discount, promoCode = body.promoCode;
                    if (!(products === null || products === void 0 ? void 0 : products.length))
                        throw new Error("Products missing");
                    if (typeof shippingCost !== "number" || shippingCost < 0) {
                        throw new Error("Invalid shipping cost");
                    }
                    invoiceNumber = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    items = products.map(function (product) { return ({
                        productName: product.name,
                        quantity: product.quantity,
                        price: product.price
                    }); });
                    return [4 /*yield*/, generateInvoice_1.generateInvoice(orderNumber, items, billingAddress, (billingAddress === null || billingAddress === void 0 ? void 0 : billingAddress.isLegalEntity) || false // Decide dacă este persoană juridică
                        )];
                case 3:
                    invoice = _a.sent();
                    invoiceNumber = invoice.number;
                    console.log("Invoice:", invoice);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error generating invoice:", error_1);
                    return [3 /*break*/, 5];
                case 5:
                    sanityProducts = products.map(function (item) {
                        var _a, _b, _c, _d, _e;
                        return ({
                            _key: crypto.randomUUID(),
                            product: { _type: "reference", _ref: item.productId },
                            quantity: item.quantity,
                            variant: {
                                curbura: (_a = item.variant) === null || _a === void 0 ? void 0 : _a.curbura,
                                grosime: (_b = item.variant) === null || _b === void 0 ? void 0 : _b.grosime,
                                marime: (_c = item.variant) === null || _c === void 0 ? void 0 : _c.marime,
                                price: (_d = item.variant) === null || _d === void 0 ? void 0 : _d.price,
                                stock: (_e = item.variant) === null || _e === void 0 ? void 0 : _e.stock
                            }
                        });
                    });
                    return [4 /*yield*/, backendClient_1.backendClient.create({
                            _type: "order",
                            paymentType: "Ramburs",
                            orderNumber: orderNumber,
                            customerName: customerName,
                            email: customerEmail,
                            clerkUserId: clerkUserId,
                            products: sanityProducts,
                            totalPrice: totalPrice,
                            discount: discount,
                            promoCode: promoCode,
                            shippingCost: shippingCost,
                            currency: currency,
                            address: address,
                            billingAddress: billingAddress,
                            status: "In Asteptare",
                            orderDate: new Date().toISOString(),
                            awb: awb,
                            invoice: {
                                number: invoiceNumber,
                                series: process.env.SMARTBILL_SERIES_NAME,
                                url: ""
                            }
                        })];
                case 6:
                    order = _a.sent();
                    // Scade stocul pentru fiecare produs
                    return [4 /*yield*/, Promise.all(products.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                            var product, variantIndex;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, backendClient_1.backendClient.getDocument(item.productId)];
                                    case 1:
                                        product = _a.sent();
                                        if (!product) {
                                            throw new Error("Product " + item.productId + " not found");
                                        }
                                        variantIndex = product.variants.findIndex(function (v) {
                                            var _a, _b, _c;
                                            return v.curbura === ((_a = item.variant) === null || _a === void 0 ? void 0 : _a.curbura) &&
                                                v.grosime === ((_b = item.variant) === null || _b === void 0 ? void 0 : _b.grosime) &&
                                                v.marime === ((_c = item.variant) === null || _c === void 0 ? void 0 : _c.marime);
                                        });
                                        if (variantIndex === -1) {
                                            throw new Error("Variant not found for product " + item.productId);
                                        }
                                        if (product.variants[variantIndex].stock < item.quantity) {
                                            throw new Error("Insufficient stock for variant of product " + item.productId);
                                        }
                                        product.variants[variantIndex].stock -= item.quantity;
                                        return [4 /*yield*/, backendClient_1.backendClient
                                                .patch(item.productId)
                                                .set({ variants: product.variants })
                                                .commit()];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 7:
                    // Scade stocul pentru fiecare produs
                    _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ success: true, order: order })];
                case 8:
                    error_2 = _a.sent();
                    console.error("Error:", error_2);
                    return [2 /*return*/, server_1.NextResponse.json({ success: false, error: error_2.message }, { status: 500 })];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
