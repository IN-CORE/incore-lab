import * as alegbra from "algebra.js";
import * as math from "mathjs";
import * as jStat from "jstat";

export default class chartSampler {

	static computeExpressionSamples(min, max, numberOfSamples, expression) {
		let steps = ((max - min) / numberOfSamples);

		let samples = [];

		for (let i = 1; i <= numberOfSamples; i++) {
			let y = steps * i;
			let equation = alegbra.parse(`${y} = ${expression}`);

			let x = equation.solveFor("x").valueOf();

			samples.push([x, y]);
		}

		return samples;
	}

	static async computeExpressionSamples3d(minX, maxX, numberOfSamplesX, minY, maxY, numberOfSamplesY, expression) {
		let stepsX = ((maxX - minX) / numberOfSamplesX);
		let stepsY = ((maxY - minY) / numberOfSamplesY);

		let parser = math.parser();

		parser.eval(`f(x,y) = ${  expression}`);

		let promises = [];

		for (let i = 1; i <= numberOfSamplesX; i++) {
			let x = stepsX * i;

			for (let j = 1; j <= numberOfSamplesY; j++) {
				let y = stepsY * j;

				promises.push(this.calculate(x, y, parser));
			}
		}

		let samples = await Promise.all(promises);

		return samples;
	}

	static async calculate(x, y, parser) {
		return new Promise(resolve => resolve([x, y, parser.eval(`f(${  x  }, ${  y  })`)]));
	}

	static sampleNormalCdf(min, max, numberOfSamples, mean, std) {
		let steps = ((max - min) / numberOfSamples);

		let samples = [];

		for (let i = 1; i <= numberOfSamples; i++) {
			let x = steps * i;

			let y = jStat.normal.inv(x, mean, std);

			samples.push([y, x]);
		}

		return samples;
	}

	static sampleLogNormalAlternate(min, max, numberOfSamples, mean, std) {
		let steps = ((max - min) / numberOfSamples);

		let samples = [];

		for (let i = 1; i <= numberOfSamples; i++) {
			let x = steps * i;

			let y = jStat.lognormal.inv(x, mean, std);

			samples.push([y, x]);
		}

		return samples;

	}

	static sampleLogNormalCdf(min, max, numberOfSamples, location, scale) {
		let steps = ((max - min) / numberOfSamples);

		let samples = [];

		let mean = Math.log(Math.pow(location,2) / Math.sqrt(scale + Math.pow(location,2)));
		let std = Math.sqrt(Math.log((scale / Math.pow(location, 2)) + 1 ));

		for (let i = 1; i <= numberOfSamples; i++) {
			let x = steps * i;

			let y = jStat.lognormal.inv(x, mean, std);

			samples.push([y, x]);
		}

		return samples;
	}
}
