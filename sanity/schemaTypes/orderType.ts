import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { client } from '../lib/client';

export const orderType = defineType({
  name: "order",
  title: "Comenzi",
  type: "document",
  icon: BasketIcon,
  fieldsets: [
    {
      name: 'mainInfo',
      title: 'Informații Principale',
      options: { columns: 2 }
    },
    {
      name: 'invoiceInfo',
      title: 'Informații Factură',
      options: { columns: 2 }
    },
    {
      name: 'customerInfo',
      title: 'Informații Client',
      options: { columns: 2 }
    },
    {
      name: 'financialInfo',
      title: 'Informații Financiare',
      options: { columns: 2 }
    }
  ],
  fields: [
    defineField({
      name: "orderIndex",
      title: "Număr Comandă",
      type: "number",
      readOnly: false,
      initialValue: async () => {
        try {
          const query = `*[_type == "order"] | order(orderIndex desc) [0].orderIndex`;
          const lastIndex = await client.fetch(query);
          return (lastIndex || 0) + 1;
        } catch (err) {
          console.error("Eroare la generarea orderIndex:", err);
          return 1;
        }
      },
      validation: (Rule) => Rule.required(),
      fieldset: 'mainInfo'
    }),

    defineField({
      name: "orderNumber",
      title: "Cod Unic Comandă",
      type: "string",
      validation: (Rule) => Rule.required(),
      fieldset: 'mainInfo'
    }),

    defineField({
      name: "paymentType",
      title: "Metoda Plată",
      type: "string",
      options: {
        list: [
          { title: "Card", value: "card" },
          { title: "Ramburs", value: "ramburs" },
          { title: "Transfer Bancar", value: "transfer" },
        ],
      },
      validation: (Rule) => Rule.required(),
      fieldset: 'mainInfo'
    }),

    defineField({
      name: "status",
      title: "Statusul Comenzii",
      type: "string",
      options: {
        list: [
          { title: "În Așteptare", value: "in_asteptare" },
          { title: "Plătită", value: "platita" },
          { title: "Livrată", value: "livrata" },
          { title: "Anulată", value: "anulata" },
          { title: "Returnată", value: "returnata" },
        ],
      },
      validation: (Rule) => Rule.required(),
      fieldset: 'mainInfo'
    }),

    defineField({
      name: "orderDate",
      title: "Data Comenzii",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
      },
      validation: (Rule) => Rule.required(),
      fieldset: 'mainInfo'
    }),

    defineField({
      name: "invoice",
      title: "Factura",
      type: "object",
      fieldset: 'invoiceInfo',
      fields: [
        { 
          name: "number", 
          title: "Număr Factură", 
          type: "string",
          validation: (Rule) => Rule.required() 
        },
        { 
          name: "series", 
          title: "Serie Factură", 
          type: "string",
          validation: (Rule) => Rule.required() 
        },
        { 
          name: "url", 
          title: "URL PDF", 
          type: "url",
          validation: (Rule) => Rule.required() 
        }
      ]
    }),

    defineField({
      name: "customerName",
      title: "Numele Clientului",
      type: "string",
      validation: (Rule) => Rule.required(),
      fieldset: 'customerInfo'
    }),

    defineField({
      name: "email",
      title: "Email-ul Clientului",
      type: "string",
      validation: (Rule) => Rule.required().email(),
      fieldset: 'customerInfo'
    }),

    defineField({
      name: "address",
      title: "Adresa de Livrare",
      type: "object",
      fieldset: 'customerInfo',
      fields: [
        { 
          name: "firstName", 
          title: "Prenume", 
          type: "string", 
          validation: (Rule) => Rule.required() 
        },
        { 
          name: "lastName", 
          title: "Nume", 
          type: "string", 
          validation: (Rule) => Rule.required() 
        },
        { 
          name: "province", 
          title: "Județ", 
          type: "string", 
          validation: (Rule) => Rule.required() 
        },
        { 
          name: "city", 
          title: "Oraș", 
          type: "string", 
          validation: (Rule) => Rule.required() 
        },
        { 
          name: "postalCode", 
          title: "Cod Poștal", 
          type: "string", 
          validation: (Rule) => Rule.required() 
        },
        { 
          name: "street", 
          title: "Adresa", 
          type: "string", 
          validation: (Rule) => Rule.required() 
        },
        { 
          name: "phone", 
          title: "Telefon", 
          type: "string", 
          validation: (Rule) => Rule.required() 
        },
        { 
          name: "email", 
          title: "Email", 
          type: "string", 
          validation: (Rule) => Rule.required().email() 
        },
      ],
    }),

    defineField({
      name: "billingAddress",
      title: "Date Facturare",
      type: "object",
      fieldset: 'customerInfo',
      fields: [
        { 
          name: "isLegalEntity", 
          title: "Persoană Juridică", 
          type: "boolean",
          initialValue: false
        },
        { 
          name: "companyName", 
          title: "Nume Firmă", 
          type: "string",
          hidden: ({ parent }) => !parent?.isLegalEntity 
        },
        { 
          name: "cui", 
          title: "CUI", 
          type: "string",
          hidden: ({ parent }) => !parent?.isLegalEntity 
        },
        { 
          name: "tradeRegisterNumber", 
          title: "Nr. Reg. Comerțului", 
          type: "string",
          hidden: ({ parent }) => !parent?.isLegalEntity 
        },
        { 
          name: "companyAddress", 
          title: "Adresă Sediu", 
          type: "string",
          hidden: ({ parent }) => !parent?.isLegalEntity 
        },
        { 
          name: "companyCity", 
          title: "Oraș Sediu", 
          type: "string",
          hidden: ({ parent }) => !parent?.isLegalEntity 
        },
        { 
          name: "companyCounty", 
          title: "Județ Sediu", 
          type: "string",
          hidden: ({ parent }) => !parent?.isLegalEntity 
        },
        { 
          name: "companyPostalCode", 
          title: "Cod Poștal Sediu", 
          type: "string",
          hidden: ({ parent }) => !parent?.isLegalEntity 
        },
        { 
          name: "bankName", 
          title: "Bancă", 
          type: "string",
          hidden: ({ parent }) => !parent?.isLegalEntity 
        },
        { 
          name: "iban", 
          title: "IBAN", 
          type: "string",
          hidden: ({ parent }) => !parent?.isLegalEntity 
        },
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
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "quantity",
              title: "Cantitate",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "variant",
              title: "Variantă Selectată",
              type: "object",
              fields: [
                defineField({
                  name: "curbura",
                  title: "Curbură",
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
              title: "product.name",
              quantity: "quantity",
              price: "variant.price",
              curbura: "variant.curbura",
              grosime: "variant.grosime",
              marime: "variant.marime",
              media: "product.image",
            },
            prepare({ title, quantity, price, curbura, grosime, marime, media }) {
              const variantInfo = [curbura, grosime, marime]
                .filter(Boolean)
                .join(", ");
              return {
                title: title || "Produs necunoscut",
                subtitle: `${quantity} x ${price || 0} RON ${variantInfo ? `| ${variantInfo}` : ""}`,
                media: media,
              };
            },
          },
        }),
      ],
    }),

    defineField({
      name: "totalPrice",
      title: "Preț Total",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
      fieldset: 'financialInfo'
    }),

    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
      fieldset: 'financialInfo'
    }),

    defineField({
      name: "promoCode",
      title: "Cod Promoțional",
      type: "string",
      fieldset: 'financialInfo'
    }),

    defineField({
      name: "shippingCost",
      title: "Cost Livrare",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
      fieldset: 'financialInfo'
    }),

    defineField({
      name: "currency",
      title: "Monedă",
      type: "string",
      initialValue: "RON",
      options: {
        list: [
          { title: "RON", value: "RON" },
          { title: "EUR", value: "EUR" },
        ],
      },
      validation: (Rule) => Rule.required(),
      fieldset: 'financialInfo'
    }),
  ],
  
  preview: {
    select: {
      orderIndex: "orderIndex",
      orderNumber: "orderNumber",
      status: "status",
      orderDate: "orderDate",
      totalPrice: "totalPrice",
      currency: "currency",
      customerName: "customerName"
    },
    prepare({ orderIndex, orderNumber, status, orderDate, totalPrice, currency, customerName }) {
      const date = orderDate ? new Date(orderDate).toLocaleDateString('ro-RO') : '';
      return {
        title: `Comanda #${orderIndex} (${orderNumber})`,
        subtitle: `${customerName} | ${status} | ${totalPrice} ${currency} | ${date}`,
      };
    },
  },
});