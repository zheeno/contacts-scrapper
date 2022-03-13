const base_path = "/api/v1";

const routes = [
    {
        path: `${base_path}/contacts`,
        handler: require("./contactList")
    }
];

module.exports = routes;