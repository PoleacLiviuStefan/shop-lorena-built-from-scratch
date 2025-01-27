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
var stripe_1 = require("@/lib/stripe");
var backendClient_1 = require("@/sanity/lib/backendClient");
var headers_1 = require("next/headers");
var server_1 = require("next/server");
var generateInvoice_1 = require("@/lib/generateInvoice");
var server_2 = require("@clerk/nextjs/server");
function POST(req) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var body, headersList, sig, event, session, userId, clerk, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, req.text()];
                case 1:
                    body = _b.sent();
                    return [4 /*yield*/, headers_1.headers()];
                case 2:
                    headersList = _b.sent();
                    sig = headersList.get('stripe-signature');
                    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: 'Lipsește semnătura sau secretul webhook-ului' }, { status: 400 })];
                    }
                    try {
                        event = stripe_1["default"].webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
                    }
                    catch (err) {
                        console.error('Eroare la construirea evenimentului webhook:', err);
                        return [2 /*return*/, server_1.NextResponse.json({ error: 'Semnătura webhook-ului nu a putut fi verificată' }, { status: 400 })];
                    }
                    if (!(event.type === 'checkout.session.completed')) return [3 /*break*/, 10];
                    session = event.data.object;
                    userId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.userId;
                    console.log("userIdInChckout: ", userId);
                    if (!userId) return [3 /*break*/, 9];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 7, , 8]);
                    return [4 /*yield*/, server_2.clerkClient()];
                case 4:
                    clerk = _b.sent();
                    return [4 /*yield*/, clerk.users.updateUserMetadata(userId, {
                            publicMetadata: {
                                hasCourseAccess: true
                            }
                        })];
                case 5:
                    _b.sent();
                    console.log("Metadatele utilizatorului " + userId + " au fost actualizate.");
                    // Creează comanda în Sanity
                    return [4 /*yield*/, createOrderInSanity(session)];
                case 6:
                    // Creează comanda în Sanity
                    _b.sent();
                    console.log("Comanda pentru sesiunea " + session.id + " a fost creat\u0103 \u00EEn Sanity.");
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _b.sent();
                    console.error("Eroare la procesarea sesiunii " + session.id + ":", err_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: 'Eroare la procesarea sesiunii' }, { status: 500 })];
                case 8: return [3 /*break*/, 10];
                case 9:
                    console.warn('UserId lipsește în metadatele sesiunii.');
                    _b.label = 10;
                case 10: return [2 /*return*/, server_1.NextResponse.json({ received: true }, { status: 200 })];
            }
        });
    });
}
exports.POST = POST;
function createOrderInSanity(session) {
    return __awaiter(this, void 0, void 0, function () {
        var id, amount_total, currency, metadata, payment_intent, customer, total_details, _a, orderNumber, customerName, customerEmail, promoCode, discount, clerkUserId, lineItemsWithProduct, sanityProducts, billingAddress, invoiceNumber, items, invoice, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = session.id, amount_total = session.amount_total, currency = session.currency, metadata = session.metadata, payment_intent = session.payment_intent, customer = session.customer, total_details = session.total_details;
                    _a = metadata, orderNumber = _a.orderNumber, customerName = _a.customerName, customerEmail = _a.customerEmail, promoCode = _a.promoCode, discount = _a.discount, clerkUserId = _a.clerkUserId;
                    return [4 /*yield*/, stripe_1["default"].checkout.sessions.listLineItems(id, {
                            expand: ["data.price.product"]
                        })];
                case 1:
                    lineItemsWithProduct = _b.sent();
                    sanityProducts = lineItemsWithProduct.data.map(function (item) {
                        var _a, _b, _c, _d;
                        return ({
                            _key: crypto.randomUUID(),
                            product: {
                                _type: "reference",
                                _ref: (_c = (_b = (_a = item.price) === null || _a === void 0 ? void 0 : _a.product) === null || _b === void 0 ? void 0 : _b.metadata) === null || _c === void 0 ? void 0 : _c.id
                            },
                            quantity: item.quantity || 0,
                            price: ((_d = item.price) === null || _d === void 0 ? void 0 : _d.unit_amount) ? item.price.unit_amount / 100 : 0
                        });
                    });
                    billingAddress = JSON.parse(metadata.billingAddress || '{}');
                    if (!billingAddress.isLegalEntity) return [3 /*break*/, 5];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    items = sanityProducts.map(function (product) { return ({
                        productName: product.name || "",
                        quantity: product.quantity,
                        price: product.price
                    }); });
                    return [4 /*yield*/, generateInvoice_1.generateInvoice(orderNumber, items, billingAddress, true)];
                case 3:
                    invoice = _b.sent();
                    invoiceNumber = invoice.number;
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.error('Error generating invoice:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, backendClient_1.backendClient.create({
                        _type: "order",
                        orderNumber: orderNumber,
                        paymentType: "Card",
                        stripeCheckoutSessionId: id,
                        stripePaymentIntentId: payment_intent,
                        customerName: customerName,
                        stripeCustomerId: customer,
                        clerkUserId: clerkUserId,
                        email: customerEmail,
                        currency: currency,
                        shippingCost: metadata.shippingCost ? parseFloat(metadata.shippingCost) : 0,
                        discount: metadata.discount,
                        promoCode: metadata.promoCode,
                        products: sanityProducts,
                        totalPrice: amount_total ? amount_total / 100 : 0,
                        status: "Platita",
                        orderDate: new Date().toISOString(),
                        address: {
                            firstName: metadata.firstName,
                            lastName: metadata.lastName,
                            email: customerEmail,
                            phone: metadata.phone,
                            street: metadata.street,
                            city: metadata.city,
                            province: metadata.province,
                            postalCode: metadata.postalCode
                        },
                        billingAddress: billingAddress.isLegalEntity ? billingAddress : null,
                        invoice: invoiceNumber
                    })];
                case 6: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
