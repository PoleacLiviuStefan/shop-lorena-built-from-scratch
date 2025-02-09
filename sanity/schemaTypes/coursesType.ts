import { defineField, defineType } from "sanity";
import { BellIcon } from '@sanity/icons';
import type { ValidationContext, SanityDocument } from 'sanity';

interface CourseDocument extends SanityDocument {
    startDate?: string;
}

export const coursesType = defineType({
    name: "course",
    title: "Date Cursuri",
    type: "document",
    icon: BellIcon,
    fields: [
        defineField({
            name: "courseName",
            title: "Nume Curs",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "courseIntervals",
            title: "Intervale de Date Curs",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "startDate",
                            title: "Data de început",
                            type: "date",
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "endDate",
                            title: "Data de sfârșit",
                            type: "date",
                            validation: (Rule) =>
                                Rule.required().custom((endDate: string, context: ValidationContext) => {
                                    const doc = context.document as CourseDocument;
                                    const startDate = doc?.startDate;
                                    if (startDate && endDate < startDate) {
                                        return "Data de sfârșit trebuie să fie după data de început.";
                                    }
                                    return true;
                                }),
                        },
                    ],
                    preview: {
                        select: {
                            startDate: 'startDate',
                            endDate: 'endDate'
                        },
                        prepare({ startDate, endDate }: { startDate?: string; endDate?: string }) {
                            return {
                                title: `${startDate || "Fără dată"} - ${endDate || "Fără dată"}`,
                            };
                        },
                    },
                },
            ],
            validation: (Rule) => Rule.required().min(1),
        })
    ]
})