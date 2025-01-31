'use client';
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
function SuccessPage() {
    var _this = this;
    var searchParams = navigation_1.useSearchParams();
    var sessionId = searchParams.get('session_id');
    var _a = react_1.useState(null), orderDetails = _a[0], setOrderDetails = _a[1];
    var sendEmail = function (_a) {
        var clientEmail = _a.clientEmail, clientName = _a.clientName, uniqueCode = _a.uniqueCode, address = _a.address;
        return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                browser_1["default"]
                    .send('service_e9isnzl', // ID-ul serviciului
                'template_eifbiai', // ID-ul șablonului
                {
                    client_email: clientEmail,
                    client_name: clientName,
                    course_code: uniqueCode,
                    client_province: address.judet,
                    client_locality: address.localitate,
                    client_address: address.detalii_adresa
                }, 'JBlV6SrZcJJiJKOe2' // Cheia publică
                )
                    .then(function (result) {
                    console.log('Email trimis cu succes!', result.text);
                    // Actualizează `sessionStorage` pentru a indica că emailul a fost trimis
                }, function (error) {
                    console.log('Eroare la trimiterea emailului:', error.text);
                });
                browser_1["default"]
                    .send('lorenadanoiu', // ID-ul serviciului
                'template_r00roqd', // ID-ul șablonului
                {
                    client_email: clientEmail,
                    client_name: clientName,
                    course_code: uniqueCode
                }, 'jkddlsCqSLugxlMFY' // Cheia publică
                )
                    .then(function (result) {
                    console.log('Email trimis cu succes!', result.text);
                }, function (error) {
                    console.log('Eroare la trimiterea emailului:', error.text);
                });
                return [2 /*return*/];
            });
        });
    };
    var mapCustomFieldsToAddress = function (customFields) {
        var _a, _b, _c, _d, _e, _f;
        return {
            judet: ((_b = (_a = customFields.find(function (field) { return field.key === 'judet'; })) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.value) || 'N/A',
            localitate: ((_d = (_c = customFields.find(function (field) { return field.key === 'localitate'; })) === null || _c === void 0 ? void 0 : _c.text) === null || _d === void 0 ? void 0 : _d.value) || 'N/A',
            detalii_adresa: ((_f = (_e = customFields.find(function (field) { return field.key === 'detalii_adresa'; })) === null || _e === void 0 ? void 0 : _e.text) === null || _f === void 0 ? void 0 : _f.value) || ''
        };
    };
    react_1.useEffect(function () {
        var fetchSessionDetails = function () { return __awaiter(_this, void 0, void 0, function () {
            var res, data, address, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sessionId)
                            return [2 /*return*/];
                        if (sessionStorage.getItem("emailSent-" + sessionId)) {
                            console.log('Emailurile au fost deja trimise pentru această sesiune.');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, fetch("/api/stripe-session?session_id=" + sessionId)];
                    case 2:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        console.log('Custom fields:', data.custom_fields); // Log pentru debugging
                        console.log('data este: ', data);
                        address = mapCustomFieldsToAddress(data.customFields || []);
                        setOrderDetails({
                            clientName: data.clientName || 'N/A',
                            clientEmail: data.clientEmail || 'N/A',
                            uniqueCode: data.uniqueCode,
                            address: data.customFields
                        });
                        // Trimite emailul după ce datele sunt preluate
                        return [4 /*yield*/, sendEmail({
                                clientEmail: data.clientEmail,
                                clientName: data.clientName,
                                uniqueCode: data.uniqueCode,
                                address: address
                            })];
                    case 4:
                        // Trimite emailul după ce datele sunt preluate
                        _a.sent();
                        sessionStorage.setItem("emailSent-" + sessionId, 'true');
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.error('Eroare la obținerea detaliilor sesiunii:', error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        fetchSessionDetails();
    }, [sessionId]);
    return (React.createElement("div", { className: "flex items-center justify-center min-h-screen bg-gray-100 px-4" },
        React.createElement("div", { className: "bg-white shadow-lg rounded-lg p-6 w-full max-w-lg" },
            React.createElement("div", { className: "text-center" },
                React.createElement("h1", { className: "text-2xl font-bold text-green-600 mb-2" }, "Plat\u0103 reu\u0219it\u0103!"),
                React.createElement("p", { className: "text-gray-600" }, "Mul\u021Bumim pentru achizi\u021Bie. Detaliile comenzii tale sunt mai jos.")),
            orderDetails ? (React.createElement("div", { className: "mt-6 space-y-4" },
                React.createElement("div", { className: "p-4 bg-green-50 rounded-md" },
                    React.createElement("h2", { className: "text-lg font-semibold text-green-700" }, "Detalii comand\u0103:"),
                    React.createElement("p", { className: "text-gray-700" },
                        React.createElement("strong", null, "Nume:"),
                        " ",
                        orderDetails.clientName),
                    React.createElement("p", { className: "text-gray-700" },
                        React.createElement("strong", null, "Email:"),
                        " ",
                        orderDetails.clientEmail),
                    React.createElement("p", { className: "text-red-700" },
                        "Salveaz\u0103 codul pentru a-l introduce atunci c\u00E2nd se lanseaz\u0103 cursul!",
                        React.createElement("br", null),
                        React.createElement("strong", null,
                            "COD: ",
                            orderDetails.uniqueCode))))) : (React.createElement("div", { className: "mt-6 text-center" },
                React.createElement("p", { className: "text-gray-600" }, "Se \u00EEncarc\u0103 detaliile comenzii..."))),
            React.createElement("div", { className: "mt-6 text-center" },
                React.createElement("a", { href: "/cursuri", className: "inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-500 transition" }, "\u00CEnapoi la cursuri")))));
}
exports["default"] = SuccessPage;
