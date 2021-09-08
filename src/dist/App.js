"use strict";
exports.__esModule = true;
var react_1 = require("react");
require("./App.css");
var useSemiPersistentState = function (key, initialState) {
    var _a = react_1["default"].useState(localStorage.getItem(key) || initialState), value = _a[0], setValue = _a[1];
    react_1["default"].useEffect(function () {
        localStorage.setItem(key, value);
    }, [value, key]);
    return [value, setValue];
};
var App = function () {
    var stories = [
        {
            title: 'React',
            url: 'https://reactjs.org/',
            author: 'Jordan Walke',
            num_comments: 3,
            points: 4,
            objectID: 0
        }, {
            title: 'Redux',
            url: 'https://redux.js.org/',
            author: 'Dan Abramov, Andrew Clark',
            num_comments: 2,
            points: 5,
            objectID: 1
        },
    ];
    var _a = useSemiPersistentState('search'), searchTerm = _a[0], setSearchTerm = _a[1];
    // React.useEffect(() => {
    //   localStorage.setItem('search', searchTerm)
    // }, [searchTerm])
    var handleSearch = function (event) {
        setSearchTerm(event.target.value);
    };
    var searchedStories = stories.filter(function (story) {
        return story.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return (react_1["default"].createElement("div", { className: "App" },
        react_1["default"].createElement("h1", null, "My Hacker Stories"),
        react_1["default"].createElement(Search, { search: searchTerm, onSearch: handleSearch }),
        react_1["default"].createElement("hr", null),
        react_1["default"].createElement(List, { list: searchedStories })));
};
var List = function (_a) {
    var list = _a.list;
    return react_1["default"].createElement("div", null, list.map(function (item) { return (react_1["default"].createElement(Item, { key: item.objectID, item: item })); }));
};
var Item = function (_a) {
    var item = _a.item;
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("span", null,
            react_1["default"].createElement("a", { href: item.url }, item.title)),
        react_1["default"].createElement("span", null, item.author),
        react_1["default"].createElement("span", null, item.num_comments),
        react_1["default"].createElement("span", null, item.points)));
};
var Search = function (_a) {
    var search = _a.search, onSearch = _a.onSearch;
    var _b = react_1["default"].useState(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var handleChange = function (event) {
        setSearchTerm(event.currentTarget.value);
        onSearch(event);
    };
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("label", { htmlFor: "search" }, "Search: "),
        react_1["default"].createElement("input", { id: "search", type: "text", value: search, onChange: handleChange }),
        react_1["default"].createElement("p", null,
            "Searching for ",
            react_1["default"].createElement("strong", null, searchTerm),
            ".")));
};
exports["default"] = App;
