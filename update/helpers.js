const { ICON_WIDTH, PIXEL_BASE } = require("./config");

/**
 * Dedent for Template Strings: https://gist.github.com/zenparsing/5dffde82d9acef19e43c
 *
 * @param {string|string[]|function} callSite 
 */
const dedent = (callSite, ...args) => {
	/**
	 * Format string
	 *
	 * @param {string} str
	 */
	const format = str => {
		let size = -1;
		return str.replace(/\n(\s+)/g, (m, m1) => {
			if (size < 0) {
				size = m1.replace(/\t/g, "	").length;
			}
			return "\n" + m1.slice(Math.min(m1.length, size));
		});
	};
	if (typeof callSite === "string") {
		return format(callSite);
	}
	if (typeof callSite === "function") {
		return (...args) => format(callSite(...args));
	}
	return format(callSite
		.slice(0, args.length + 1)
		.map((text, i) => (i === 0 ? "" : args[i - 1]) + text)
		.join("")
	);
};

/**
 * Generate icon and addit to output svg
 *
 * @param {Object} iconData
 * @param {string} svgPath
 * @param {Object} params
 */
const generateIcon = (iconData, svgPath, params, defs) => {
	const size = ICON_WIDTH / params.horizAdvX;
	const scale = size > 1 ? 1 : size;
	const shiftX = -(-(ICON_WIDTH - params.horizAdvX) / 2);
	const def = iconTemplate(assign({
		name: iconData.id,
		path: svgPath
	}, params, {
		scaleX: scale,
		scaleY: -scale,
		shiftX: shiftX < 0 ? 0 : shiftX,
		shiftY: -(1280 + 2 * PIXEL_BASE)
	}));
	iconData.categories.forEach(category => {
		if (defs[category]) {
			defs[category].push(def);
		} else {
			defs[category] = [def];
		}
	});
};

/**
 * Object assign to new clean object
 */
const assign = (...params) => Object.assign(Object.create(null), ...params);

/**
 * Generate icon template
 */
const iconTemplate = ({
	name,
	path,
	scaleX,
	scaleY,
	shiftX,
	shiftY
}) => `<g id="${name}" transform="scale(${scaleX} ${scaleY}) translate(${shiftX} ${shiftY})"><path d="${path}"/></g>`;

module.exports = {
	assign,
	dedent,
	generateIcon,
	iconTemplate
};
