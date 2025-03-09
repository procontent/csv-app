import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/CSVReader.tsx
import { useState } from 'react';
import * as Papa from 'papaparse';
var CSVReader = function () {
    var _a = useState([]), data = _a[0], setData = _a[1];
    var _b = useState(''), filter = _b[0], setFilter = _b[1];
    var handleFileUpload = function (event) {
        var _a;
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (_a) {
                var target = _a.target;
                if (target === null || target === void 0 ? void 0 : target.result) {
                    var results = Papa.parse(target.result, { header: true });
                    setData(results.data);
                }
            };
            reader.readAsText(file);
        }
    };
    return (_jsxs("div", { children: [_jsx("input", { type: "file", accept: ".csv", onChange: handleFileUpload }), _jsx("input", { type: "text", placeholder: "Filter...", value: filter, onChange: function (e) { return setFilter(e.target.value); } }), _jsxs("table", { border: 1, children: [_jsx("thead", { children: _jsx("tr", { children: data.length > 0 && Object.keys(data[0]).map(function (key, index) { return (_jsx("th", { children: key }, index)); }) }) }), _jsx("tbody", { children: data.map(function (row, rowIndex) { return (_jsx("tr", { children: Object.values(row).map(function (value, colIndex) { return (_jsx("td", { children: value }, colIndex)); }) }, rowIndex)); }) })] })] }));
};
export default CSVReader;
