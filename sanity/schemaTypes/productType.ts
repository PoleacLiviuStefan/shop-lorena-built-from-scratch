import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
    name: 'product',
    title: 'Produse',
    type: 'document',
    icon: TrolleyIcon,
    fields: [
        defineField({
            name: "name",
            title: "Nume Produs",
            type: "string",
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: 'name',
                maxLength: 96
            },
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "images",
            title: "Imaginile Produsului",
            type: "array",
            of: [
                {
                    type: "image",
                    options: {
                        hotspot: true
                    },
                    fields: [
                        {
                            name: "alt",
                            title: "Text Alternativ",
                            type: "string",
                            description: "Important pentru SEO și accesibilitate"
                        }
                    ]
                }
            ],
            validation: Rule => Rule.required().min(1).error('Este necesară cel puțin o imagine')
        }),
        defineField({
            name: "description",
            title: "Descriere",
            type: "blockContent",
        }),
        defineField({
            name: "variants",
            title: "Variante Produs",
            type: "array",
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'curbura',
                        title: 'Curbura',
                        type: 'string',
                        options: {
                            list: ['M', 'C', 'D']
                        }
                    },
                    {
                        name: 'grosime',
                        title: 'Grosime',
                        type: 'string',
                        options: {
                            list: ['0.05', '0.10', '0.15']
                        }
                    },
                    {
                        name: 'marime',
                        title: 'Mărime',
                        type: 'string',
                        options: {
                            list: ['7', '8', '9', '10', '11', '12', '13', '14', '15', 'mix']
                        }
                    },
                    {
                        name: 'price',
                        title: 'Preț',
                        type: 'number',
                        validation: Rule => Rule.required().min(0)
                    },
                    {
                        name: 'stock',
                        title: 'Stoc',
                        type: 'number',
                        validation: Rule => Rule.required().min(0)
                    }
                ]
            }]
        }),
        defineField({
            name: "categories",
            title: "Categorii",
            type: "array",
            of: [{type: 'reference', to: {type: 'category'}}],
        })
    ],
    preview: {
        select: {
            title: 'name',
            media: 'image'
        },
        prepare(select) {
            return {
                title: select.title,
                media: select.media
            };
        },
    },
});