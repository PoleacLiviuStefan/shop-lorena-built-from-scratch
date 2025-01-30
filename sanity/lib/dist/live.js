"use strict";
var _a;
exports.__esModule = true;
exports.SanityLive = exports.sanityFetch = void 0;
// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
var next_sanity_1 = require("next-sanity");
var client_1 = require("./client");
var token = process.env.SANITY_API_TOKEN;
if (!token) {
    throw new Error('SANITY_API_TOKEN is missing');
}
exports.sanityFetch = (_a = next_sanity_1.defineLive({
    client: client_1.client,
    serverToken: token,
    browserToken: token,
    fetchOptions: {
        revalidate: 0
    }
}), _a.sanityFetch), exports.SanityLive = _a.SanityLive;
