'use server';
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
exports.createCheckoutSessionCourse = void 0;
var stripe_1 = require("stripe");
function createCheckoutSessionCourse() {
    return __awaiter(this, void 0, void 0, function () {
        var stripe, uniqueCode, session, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stripe = new stripe_1["default"](process.env.STRIPE_SECRET_KEY, {
                        apiVersion: '2024-12-18.acacia'
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    uniqueCode = "CODE-" + Math.random().toString(36).substring(2, 10).toUpperCase();
                    return [4 /*yield*/, stripe.checkout.sessions.create({
                            payment_method_types: ['card'],
                            line_items: [
                                {
                                    price: process.env.STRIPE_COURSE_PRICE_ID,
                                    quantity: 1
                                },
                            ],
                            mode: 'payment',
                            custom_fields: [
                                {
                                    key: 'judet',
                                    label: { type: 'custom', custom: 'Județ' },
                                    type: 'text',
                                    optional: false
                                },
                                {
                                    key: 'localitate',
                                    label: { type: 'custom', custom: 'Localitate/Sector' },
                                    type: 'text',
                                    optional: false
                                },
                                {
                                    key: 'detalii_adresa',
                                    label: { type: 'custom', custom: 'Bloc, Scara, Etaj, Ap., Nr.' },
                                    type: 'text',
                                    optional: false
                                },
                            ],
                            metadata: {
                                unique_code: uniqueCode,
                                client_name: 'John Doe'
                            },
                            success_url: process.env.NEXT_PUBLIC_BASE_URL + "/cursuri/curs-online-feline-effect/succes?session_id={CHECKOUT_SESSION_ID}",
                            cancel_url: process.env.NEXT_PUBLIC_BASE_URL + "/cursuri/curs-online-feline-effect"
                        })];
                case 2:
                    session = _a.sent();
                    return [2 /*return*/, session.url]; // Returnează URL-ul sesiunii pentru redirecționare
                case 3:
                    error_1 = _a.sent();
                    console.error('Eroare la crearea sesiunii de checkout:', error_1);
                    throw new Error('Nu am putut crea sesiunea de checkout. Vă rugăm să încercați din nou.');
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.createCheckoutSessionCourse = createCheckoutSessionCourse;
