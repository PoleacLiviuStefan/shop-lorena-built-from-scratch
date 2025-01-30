"use strict";
exports.__esModule = true;
exports.coursesType = void 0;
var sanity_1 = require("sanity");
var icons_1 = require("@sanity/icons");
exports.coursesType = sanity_1.defineType({
    name: "course",
    title: "Date Cursuri",
    type: "document",
    icon: icons_1.BellIcon,
    fields: [
        sanity_1.defineField({
            name: "courseName",
            title: "Nume Curs",
            type: "string",
            validation: function (Rule) { return Rule.required(); }
        }),
        sanity_1.defineField({
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
                            validation: function (Rule) { return Rule.required(); }
                        },
                        {
                            name: "endDate",
                            title: "Data de sfârșit",
                            type: "date",
                            validation: function (Rule) {
                                return Rule.required().custom(function (endDate, context) {
                                    var doc = context.document;
                                    var startDate = doc === null || doc === void 0 ? void 0 : doc.startDate;
                                    if (startDate && endDate < startDate) {
                                        return "Data de sfârșit trebuie să fie după data de început.";
                                    }
                                    return true;
                                });
                            }
                        },
                    ],
                    preview: {
                        select: {
                            startDate: 'startDate',
                            endDate: 'endDate'
                        },
                        prepare: function (_a) {
                            var startDate = _a.startDate, endDate = _a.endDate;
                            return {
                                title: (startDate || "Fără dată") + " - " + (endDate || "Fără dată")
                            };
                        }
                    }
                },
            ],
            validation: function (Rule) { return Rule.required().min(1); }
        })
    ]
});
