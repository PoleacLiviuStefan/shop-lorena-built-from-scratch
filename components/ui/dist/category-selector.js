"use client";
"use strict";
exports.__esModule = true;
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var popover_1 = require("./popover");
var button_1 = require("./button");
var lucide_react_1 = require("lucide-react");
var react_popover_1 = require("@radix-ui/react-popover");
var command_1 = require("./command");
var utils_1 = require("@/lib/utils");
var CategorySelectorComponent = function (_a) {
    var _b;
    var categories = _a.categories;
    var _c = react_1.useState(false), open = _c[0], setOpen = _c[1];
    var _d = react_1.useState(""), value = _d[0], setValue = _d[1];
    var router = navigation_1.useRouter();
    return (react_1["default"].createElement(popover_1.Popover, { open: open, onOpenChange: setOpen },
        react_1["default"].createElement(popover_1.PopoverTrigger, { asChild: true },
            react_1["default"].createElement(button_1.Button, { variant: "outline", role: "combobox", "aria-expanded": open, className: "w-full max-w-full relative flex justify-center sm:justify-start sm:flex-none\r\n        items-center space-x-2 bg-blue-500 hover:bg-blue-700 hover:text-white text-white font-bold py-2 px-4 rounded\r\n        " },
                value
                    ? (_b = categories.find(function (category) { return category._id === value; })) === null || _b === void 0 ? void 0 : _b.title : "Filtrare dupa categorie",
                react_1["default"].createElement(lucide_react_1.ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0" }))),
        react_1["default"].createElement(react_popover_1.PopoverContent, { className: "w-full p-0" },
            react_1["default"].createElement(command_1.Command, null,
                react_1["default"].createElement(command_1.CommandInput, { placeholder: "Cauta categoria dorita...", className: "h-9", onKeyDown: function (e) {
                        var _a;
                        if (e.key === "Enter") {
                            var selectedCategory = categories.find(function (c) { var _a; return (_a = c.title) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(e.currentTarget.value.toLowerCase()); });
                            if ((_a = selectedCategory === null || selectedCategory === void 0 ? void 0 : selectedCategory.slug) === null || _a === void 0 ? void 0 : _a.current) {
                                setValue(selectedCategory._id);
                                router.push("/categorii/" + selectedCategory.slug.current);
                                setOpen(false);
                            }
                        }
                    } }),
                react_1["default"].createElement(command_1.CommandList, null,
                    react_1["default"].createElement(command_1.CommandEmpty, null, "Nu s-a gasit categoria."),
                    react_1["default"].createElement(command_1.CommandGroup, null, categories.map(function (category) { return (react_1["default"].createElement(command_1.CommandItem, { key: category._id, value: category.title, onSelect: function () {
                            var _a;
                            setValue(value === category._id ? "" : category._id);
                            router.push("/categorii/" + ((_a = category.slug) === null || _a === void 0 ? void 0 : _a.current));
                            setOpen(false);
                        } },
                        category.title,
                        react_1["default"].createElement(lucide_react_1.Check, { className: utils_1.cn("ml-auto h-4 w-4", value === category._id ? "opacity-100" : "opacity-0") }))); })))))));
};
exports["default"] = CategorySelectorComponent;
