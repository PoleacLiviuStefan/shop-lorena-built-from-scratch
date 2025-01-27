import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Comenzi",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Numarul Comenzii",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "awb",
      title: "AWB",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paymentType",
      title: "Metoda Plata",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
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
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "orderDate",
      title: "Data Comenzii",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
        calendarTodayLabel: "Astăzi",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "invoice",
      title: "Factura",
      type: "object",
      fields: [
        { name: "number", title: "Număr Factură", type: "string" },
        { name: "series", title: "Serie Factură", type: "string" },
        { name: "url", title: "URL PDF", type: "string" }
      ]
    }),
    defineField({
      name: "customerName",
      title: "Numele Clientului",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email-ul Clientului",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "address",
      title: "Adresa de Livrare",
      type: "object",
      fields: [
        { name: "city", title: "Oraș", type: "string", validation: (Rule) => Rule.required() },
        { name: "email", title: "Email", type: "string", validation: (Rule) => Rule.required().email() },
        { name: "firstName", title: "Prenume", type: "string", validation: (Rule) => Rule.required() },
        { name: "lastName", title: "Nume", type: "string", validation: (Rule) => Rule.required() },
        { name: "phone", title: "Telefon", type: "string", validation: (Rule) => Rule.required() },
        { name: "postalCode", title: "Cod Poștal", type: "string", validation: (Rule) => Rule.required() },
        { name: "province", title: "Județ/Provincie", type: "string", validation: (Rule) => Rule.required() },
        { name: "street", title: "Adresa", type: "string", validation: (Rule) => Rule.required() },
      ],
    }),

    defineField({
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
      ],
    }),
    defineField({
      name: "products",
      title: "Produse",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Produs Cumpărat",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Cantitate",
              type: "number",
            }),
            defineField({
              name: "variant",
              title: "Variantă Selectată",
              type: "object",
              fields: [
                defineField({
                  name: "curbura",
                  title: "Curbura",
                  type: "string",
                }),
                defineField({
                  name: "grosime",
                  title: "Grosime",
                  type: "string",
                }),
                defineField({
                  name: "marime",
                  title: "Mărime",
                  type: "string",
                }),
                defineField({
                  name: "price",
                  title: "Preț",
                  type: "number",
                }),
                defineField({
                  name: "stock",
                  title: "Stoc Rămas",
                  type: "number",
                }),
              ],
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
              marime: "variant.marime",
            },
            prepare({ name, price, currency, quantity, image, curbura, grosime, marime }) {
              const variantDetails = [curbura, grosime, marime].filter(Boolean).join(", ");
              return {
                title: name || "Produs fără nume",
                subtitle: `${quantity} x ${price ? `${price} ${currency}` : "Preț necunoscut"}${variantDetails ? ` | ${variantDetails}` : ""}`,
                media: image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "totalPrice",
      title: "Prețul Total",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discount",
      title: "Discount Aplicat",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "promoCode",
      title: "Cod Promo",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shippingCost",
      title: "Costul de Livrare",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Monedă",
      type: "string",
      validation: (Rule) => Rule.required(),
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
      companyName: "billingAddress.companyName",
    },
    prepare({ orderNumber, status, orderDate, totalPrice, currency, billingType, companyName }) {
      const billingInfo = billingType === "company" ? ` | ${companyName}` : "";
      return {
        title: `Comanda #${orderNumber}`,
        subtitle: `Status: ${status} | Data: ${new Date(orderDate).toLocaleString()} | Total: ${totalPrice} ${currency}${billingInfo}`,
      };
    },
  },
});
