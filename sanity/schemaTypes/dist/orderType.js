"use strict";
exports.__esModule = true;
exports.orderType = void 0;
var icons_1 = require("@sanity/icons");
var sanity_1 = require("sanity");
exports.orderType = sanity_1.defineType({
    name: "order",
    title: "Comenzi",
    type: "document",
    icon: icons_1.BasketIcon,
    fields: [
        sanity_1.defineField({
            name: "orderNumber",
            title: "Numarul Comenzii",
            type: "string",
            validation: function (Rule) { return Rule.required(); }
        }),
        sanity_1.defineField({
            name: "awb",
            title: "AWB",
            type: "number",
            validation: function (Rule) { return Rule.required(); }
        }),
        sanity_1.defineField({
            name: "paymentType",
            title: "Metoda Plata",
            type: "string",
            validation: function (Rule) { return Rule.required(); }
        }),
        sanity_1.defineField({
            name: "status",
            title: "Statusul Comenzii",
            type: "string",
            options: {
                list: [
                    { title: "In Asteptare", value: "In Asteptare" },
                    { title: "Platita", value: "Platita" },
                    { title: "Livrata", value: "Finalizata" },
                    { title: "Anulata", value: "Anulata" },
                    { title: "Returnata", value: "Returnata" },
                ]
            },
            validation: function (Rule) { return Rule.required(); }
        }),
        sanity_1.defineField({
            name: "orderDate",
            title: "Data Comenzii",
            type: "datetime",
            options: {
                dateFormat: "YYYY-MM-DD",
                timeFormat: "HH:mm",
                calendarTodayLabel: "Astăzi"
            },
            validation: function (Rule) { return Rule.required(); }
        }),
        sanity_1.defineField({
            name: "invoice",
            title: "Factura",
            type: "object",
            fields: [
                { name: "number", title: "Număr Factură", type: "string" },
                { name: "series", title: "Serie Factură", type: "string" },
                { name: "url", title: "URL PDF", type: "string" }
            ]
        }),
        sanity_1.defineField({
            name: "customerName",
            title: "Numele Clientului",
            type: "string",
            validation: function (Rule) { return Rule.required(); }
        }),
        sanity_1.defineField({
            name: "email",
            title: "Email-ul Clientului",
            type: "string",
            validation: function (Rule) { return Rule.required().email(); }
        }),
        sanity_1.defineField({
            name: "address",
            title: "Adresa de Livrare",
            type: "object",
            fields: [
                { name: "city", title: "Oraș", type: "string", validation: function (Rule) { return Rule.required(); } },
                { name: "email", title: "Email", type: "string", validation: function (Rule) { return Rule.required().email(); } },
                { name: "firstName", title: "Prenume", type: "string", validation: function (Rule) { return Rule.required(); } },
                { name: "lastName", title: "Nume", type: "string", validation: function (Rule) { return Rule.required(); } },
                { name: "phone", title: "Telefon", type: "string", validation: function (Rule) { return Rule.required(); } },
                { name: "postalCode", title: "Cod Poștal", type: "string", validation: function (Rule) { return Rule.required(); } },
                { name: "province", title: "Județ/Provincie", type: "string", validation: function (Rule) { return Rule.required(); } },
                { name: "street", title: "Adresa", type: "string", validation: function (Rule) { return Rule.required(); } },
            ]
        }),
        sanity_1.defineField({
            name: "billingAddress",
            title: "Date Facturare",
            type: "object",
            fields: [
                { name: "isLegalEntity", title: "Persoană Juridică", type: "boolean" },
                { name: "companyName", title: "Nume Firmă", type: "string" },
                { name: "cui", title: "CUI", type: "string" },
                { name: "tradeRegisterNumber", title: "Nr. Reg. Comerțului", type: "string" },
                { name: "companyAddress", title: "Adresă Sediu", type: "string" },
                { name: "companyCity", title: "Oraș Sediu", type: "string" },
                { name: "companyCounty", title: "Județ Sediu", type: "string" },
                { name: "companyPostalCode", title: "Cod Poștal Sediu", type: "string" },
                { name: "bankName", title: "Bancă", type: "string" },
                { name: "iban", title: "IBAN", type: "string" },
            ]
        }),
        sanity_1.defineField({
            name: "products",
            title: "Produse",
            type: "array",
            of: [
                sanity_1.defineArrayMember({
                    type: "object",
                    fields: [
                        sanity_1.defineField({
                            name: "product",
                            title: "Produs Cumpărat",
                            type: "reference",
                            to: [{ type: "product" }]
                        }),
                        sanity_1.defineField({
                            name: "quantity",
                            title: "Cantitate",
                            type: "number"
                        }),
                        sanity_1.defineField({
                            name: "variant",
                            title: "Variantă Selectată",
                            type: "object",
                            fields: [
                                sanity_1.defineField({
                                    name: "curbura",
                                    title: "Curbura",
                                    type: "string"
                                }),
                                sanity_1.defineField({
                                    name: "grosime",
                                    title: "Grosime",
                                    type: "string"
                                }),
                                sanity_1.defineField({
                                    name: "marime",
                                    title: "Mărime",
                                    type: "string"
                                }),
                                sanity_1.defineField({
                                    name: "price",
                                    title: "Preț",
                                    type: "number"
                                }),
                                sanity_1.defineField({
                                    name: "stock",
                                    title: "Stoc Rămas",
                                    type: "number"
                                }),
                            ]
                        }),
                    ],
                    preview: {
                        select: {
                            name: "product.name",
                            price: "product.price",
                            currency: "product.currency",
                            quantity: "quantity",
                            image: "product.image",
                            curbura: "variant.curbura",
                            grosime: "variant.grosime",
                            marime: "variant.marime"
                        },
                        prepare: function (_a) {
                            var name = _a.name, price = _a.price, currency = _a.currency, quantity = _a.quantity, image = _a.image, curbura = _a.curbura, grosime = _a.grosime, marime = _a.marime;
                            var variantDetails = [curbura, grosime, marime].filter(Boolean).join(", ");
                            return {
                                title: name || "Produs fără nume",
                                subtitle: quantity + " x " + (price ? price + " " + currency : "Preț necunoscut") + (variantDetails ? " | " + variantDetails : ""),
                                media: image
                            };
                        }
                    }
                }),
            ]
        }),
        sanity_1.defineField({
            name: "totalPrice",
            title: "Prețul Total",
            type: "number",
            validation: function (Rule) { return Rule.required().min(0); }
        }),
        sanity_1.defineField({
            name: "discount",
            title: "Discount Aplicat",
            type: "number",
            validation: function (Rule) { return Rule.required(); }
        }),
        sanity_1.defineField({
            name: "promoCode",
            title: "Cod Promo",
            type: "string",
            validation: function (Rule) { return Rule.required(); }
        }),
        sanity_1.defineField({
            name: "shippingCost",
            title: "Costul de Livrare",
            type: "number",
            validation: function (Rule) { return Rule.required().min(0); }
        }),
        sanity_1.defineField({
            name: "currency",
            title: "Monedă",
            type: "string",
            validation: function (Rule) { return Rule.required(); }
        }),
    ],
    preview: {
        select: {
            orderNumber: "orderNumber",
            status: "status",
            orderDate: "orderDate",
            totalPrice: "totalPrice",
            currency: "currency",
            billingType: "billingType",
            companyName: "billingAddress.companyName"
        },
        prepare: function (_a) {
            var orderNumber = _a.orderNumber, status = _a.status, orderDate = _a.orderDate, totalPrice = _a.totalPrice, currency = _a.currency, billingType = _a.billingType, companyName = _a.companyName;
            var billingInfo = billingType === "company" ? " | " + companyName : "";
            return {
                title: "Comanda #" + orderNumber,
                subtitle: "Status: " + status + " | Data: " + new Date(orderDate).toLocaleString() + " | Total: " + totalPrice + " " + currency + billingInfo
            };
        }
    }
});
