import { defineField, defineType } from "sanity";
import {BellIcon} from '@sanity/icons'

export const coursesType= defineType({
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
                                Rule.required().custom((endDate, context) => {
                                    const startDate = context.document?.startDate;
                                    if (startDate && endDate < startDate) {
                                        return "Data de sfârșit trebuie să fie după data de început.";
                                    }
                                    return true;
                                }),
                        },
                    ],
                    preview: {
                        select: {
                            startDate: "startDate",
                            endDate: "endDate",
                        },
                        prepare({ startDate, endDate }) {
                            return {
                                title: `${startDate || "Fără dată"} - ${endDate || "Fără dată"}`,
                            };
                        },
                    },
                },
            ],
            validation: (Rule) => Rule.required().min(1), // Garantează că există cel puțin un interval
        })
        
      ]
})
