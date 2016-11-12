/**
 * Request options (proxy?)
 */
const REQUEST_OPTIONS = {
	proxy: ""
};

/**
 * Raw repo url
 */
const RAW_REPO = "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/";

/**
 * YML source url
 */
const YML_URL = `${RAW_REPO}src/icons.yml`;

/**
 * SVG source url
 */
const SVG_URL = `${RAW_REPO}src/assets/font-awesome/fonts/fontawesome-webfont.svg`;

/**
 * Base icon width
 */
const ICON_WIDTH = 1792;

/**
 * Pixel base size
 */
const PIXEL_BASE = 128;

module.exports = {
	ICON_WIDTH,
	PIXEL_BASE,
	RAW_REPO,
	REQUEST_OPTIONS,
	SVG_URL,
	YML_URL
};
