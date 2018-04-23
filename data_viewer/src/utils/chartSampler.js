"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var alegbra = require("algebra.js");
var math = require("mathjs");
var jStat = require("jstat");
var chartSampler = /** @class */ (function () {
    function chartSampler() {
    }
    chartSampler.computeExpressionSamples = function (min, max, numberOfSamples, expression) {
        var steps = ((max - min) / numberOfSamples);
        var samples = [];
        for (var i = 1; i <= numberOfSamples; i++) {
            var y = steps * i;
            var equation = alegbra.parse(y + " = " + expression);
            var x = equation.solveFor("x").valueOf();
            samples.push([x, y]);
        }
        return samples;
    };
    chartSampler.computeExpressionSamples3d = function (minX, maxX, numberOfSamplesX, minY, maxY, numberOfSamplesY, expression) {
        return __awaiter(this, void 0, void 0, function () {
            var stepsX, stepsY, parser, promises, i, x, j, y, samples;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stepsX = ((maxX - minX) / numberOfSamplesX);
                        stepsY = ((maxY - minY) / numberOfSamplesY);
                        parser = math.parser();
                        parser.eval("f(x,y) = " + expression);
                        promises = [];
                        for (i = 1; i <= numberOfSamplesX; i++) {
                            x = stepsX * i;
                            for (j = 1; j <= numberOfSamplesY; j++) {
                                y = stepsY * j;
                                promises.push(this.calculate(x, y, parser));
                            }
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        samples = _a.sent();
                        return [2 /*return*/, samples];
                }
            });
        });
    };
    chartSampler.calculate = function (x, y, parser) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return resolve([x, y, parser.eval("f(" + x + ", " + y + ")")]); })];
            });
        });
    };
    chartSampler.sampleNormalCdf = function (min, max, numberOfSamples, mean, std) {
        var steps = ((max - min) / numberOfSamples);
        var samples = [];
        for (var i = 1; i <= numberOfSamples; i++) {
            var x = steps * i;
            var y = jStat.normal.inv(x, mean, std);
            samples.push([y, x]);
        }
        return samples;
    };
    chartSampler.sampleLogNormalAlternate = function (min, max, numberOfSamples, mean, std) {
        var steps = ((max - min) / numberOfSamples);
        var samples = [];
        for (var i = 1; i <= numberOfSamples; i++) {
            var x = steps * i;
            var y = jStat.lognormal.inv(x, mean, std);
            samples.push([y, x]);
        }
        return samples;
    };
    chartSampler.sampleLogNormalCdf = function (min, max, numberOfSamples, location, scale) {
        var steps = ((max - min) / numberOfSamples);
        var samples = [];
        var mean = Math.log(Math.pow(location, 2) / Math.sqrt(scale + Math.pow(location, 2)));
        var std = Math.sqrt(Math.log((scale / Math.pow(location, 2)) + 1));
        for (var i = 1; i <= numberOfSamples; i++) {
            var x = steps * i;
            var y = jStat.lognormal.inv(x, mean, std);
            samples.push([y, x]);
        }
        return samples;
    };
    return chartSampler;
}());
exports.default = chartSampler;
