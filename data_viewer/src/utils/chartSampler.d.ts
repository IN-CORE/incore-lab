export default class chartSampler {
    static computeExpressionSamples(min: any, max: any, numberOfSamples: any, expression: any): any[];
    static computeExpressionSamples3d(minX: any, maxX: any, numberOfSamplesX: any, minY: any, maxY: any, numberOfSamplesY: any, expression: any): Promise<any[]>;
    static calculate(x: any, y: any, parser: any): Promise<{}>;
    static sampleNormalCdf(min: any, max: any, numberOfSamples: any, mean: any, std: any): any[];
    static sampleLogNormalAlternate(min: any, max: any, numberOfSamples: any, mean: any, std: any): any[];
    static sampleLogNormalCdf(min: any, max: any, numberOfSamples: any, location: any, scale: any): any[];
}
