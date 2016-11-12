#!/usr/bin/env node

const request = require("request");
const { safeLoad } = require("js-yaml");
const { join } = require("path");
const { writeFileSync } = require("fs");
const { assign, dedent, generateIcon, iconTemplate } = require("./helpers");
const { REQUEST_OPTIONS, YML_URL, SVG_URL, ICON_WIDTH } = require("./config");

/**
 * Output SVG object
 */
const SVG = {
	begin: ({ name }) => dedent`<!--
		Polymer icon set generated from Font Awesome SVG Font
		https://github.com/vangware/fontawesome-iconset
		@element iron-iconset-svg
		@demo demo.html
		-->
		<link rel="import" href="../iron-icon/iron-icon.html">
		<link rel="import" href="../iron-iconset-svg/iron-iconset-svg.html">
		<iron-iconset-svg name="${name}" size="${ICON_WIDTH}">
		<svg><defs>
	`,
	defs: assign(),
	end: "</defs></svg></iron-iconset-svg>"
};

console.log("Request YML ...");
request(assign(REQUEST_OPTIONS, { url: YML_URL }), (ymlError, ymlResponse, iconsYaml) => {
	console.log("Request SVG ...");
	request(assign(REQUEST_OPTIONS, { url: SVG_URL }), (svgError, svgResponse, fontData) => {
		const icons = safeLoad(iconsYaml).icons.reduce((icons, { id, categories, unicode }) => assign(icons, {
			[unicode]: {
				id,
				categories: ["all"].concat(categories.map(category => category.toLowerCase().replace(/ /g, "-").replace("-icons", "")))
			}
		}, Object.create(null)));
		console.log("Parsing icons ...");
		fontData
			.toString("utf8")
			.replace(/(\r\n|\n|\r)/gm, " ")
			.replace(/  /gm, " ")
			.replace(/\/\>/gm, "/>\n")
			.split("\n")
			.forEach(line => {
				const match = line.match(/<glyph glyph-name="([^"]+)" unicode="&#x([^"]+);"\s*(?:horiz-adv-x="(\d+)")?\s*d="([^"]+)"/);
				if (match) {
					const [ unicode, horizAdvX, svgPath ] = match.slice(2);
					if (icons[unicode]) {
						generateIcon(icons[unicode], svgPath, {
							horizAdvX: horizAdvX ? horizAdvX : 1536
						}, SVG.defs);
					}
				}
			});
		console.log("Writing icons to files ...");
		Object.keys(SVG.defs).forEach(def => {
			writeFileSync(join(__dirname, `../fa-${def}.html`), SVG.begin({
				name: (def === "all") ? "fa" : ("fa-" + def)
			}) + SVG.defs[def].join("") + SVG.end);
		})
	});
});
