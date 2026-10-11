/**
 * Measure the rendered CTA colours, including transparent ancestors and opacity.
 * This deliberately refuses images or filters rather than reporting a guessed ratio.
 */
export async function effectiveTextContrast(locator) {
	return locator.evaluate((element) => {
		const canvas = document.createElement("canvas");
		canvas.width = 1;
		canvas.height = 1;
		const context = canvas.getContext("2d", { willReadFrequently: true });
		if (!context) throw new Error("The contrast probe requires a 2D canvas.");
		const rgba = (colour) => {
			context.clearRect(0, 0, 1, 1);
			context.fillStyle = colour;
			context.fillRect(0, 0, 1, 1);
			const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
			return [r / 255, g / 255, b / 255, a / 255];
		};
		const over = (foreground, background) => {
			const alpha = foreground[3] + background[3] * (1 - foreground[3]);
			if (!alpha) return [0, 0, 0, 0];
			return [0, 1, 2]
				.map(
					(i) =>
						(foreground[i] * foreground[3] +
							background[i] * background[3] * (1 - foreground[3])) /
						alpha,
				)
				.concat(alpha);
		};
		const chain = [];
		for (let node = element; node; node = node.parentElement) {
			const style = getComputedStyle(node);
			if (
				style.backgroundImage !== "none" ||
				style.filter !== "none" ||
				(style.backdropFilter && style.backdropFilter !== "none") ||
				(style.mixBlendMode && style.mixBlendMode !== "normal")
			) {
				throw new Error(
					`Contrast probe cannot resolve an image, filter or blend at ${node.tagName}.`,
				);
			}
			chain.push({
				background: rgba(style.backgroundColor),
				opacity: Number(style.opacity),
			});
		}
		const style = getComputedStyle(element);
		const textColour = rgba(style.color);
		const renderPixel = (text) => {
			let pixel = text ? textColour : [0, 0, 0, 0];
			for (const layer of chain) {
				pixel = over(pixel, layer.background);
				pixel[3] *= layer.opacity;
			}
			return over(pixel, [1, 1, 1, 1]);
		};
		const foreground = renderPixel(true);
		const background = renderPixel(false);
		const luminance = (colour) =>
			colour
				.slice(0, 3)
				.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
				.reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
		const a = luminance(foreground);
		const b = luminance(background);
		return {
			ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
			foreground,
			background,
			colour: style.color,
			backgroundColour: style.backgroundColor,
		};
	});
}
