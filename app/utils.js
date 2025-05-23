var debug = require("debug");

var debugLog = debug("bchexp:utils");
var debugErrorLog = debug("bchexp:error");
var debugErrorVerboseLog = debug("bchexp:errorVerbose");
var debugPerfLog = debug("bchexp:actionPerformace");

var Decimal = require("decimal.js");
var request = require("request");
var qrcode = require("qrcode");
var textdecoding = require("text-decoding");

var config = require("./config.js");
var coins = require("./coins.js");
var coinConfig = coins[config.coin];
var redisCache = require("./redisCache.js");


var ipMemoryCache = {};

var ipRedisCache = null;
if (redisCache.active) {
	var onRedisCacheEvent = function(cacheType, eventType, cacheKey) {
		global.cacheStats.redis[eventType]++;
	}

	ipRedisCache = redisCache.createCache("v0", onRedisCacheEvent);
}

var ipCache = {
	get:function(key) {
		return new Promise(function(resolve, reject) {
			if (ipMemoryCache[key] != null) {
				resolve({key:key, value:ipMemoryCache[key]});

				return;
			}

			if (ipRedisCache != null) {
				ipRedisCache.get("ip-" + key).then(function(redisResult) {
					if (redisResult != null) {
						resolve({key:key, value:redisResult});

						return;
					}

					resolve({key:key, value:null});
				});

			} else {
				resolve({key:key, value:null});
			}
		});
	},
	set:function(key, value, expirationMillis) {
		ipMemoryCache[key] = value;

		if (ipRedisCache != null) {
			ipRedisCache.set("ip-" + key, value, expirationMillis);
		}
	}
};

function perfMeasure(req) {
	var time = Date.now() - req.startTime;
	var memdiff = process.memoryUsage().heapUsed - req.startMem;

	debugPerfLog("Finished action '%s' in %d ms", req.path, time);
}

function redirectToConnectPageIfNeeded(req, res) {
	if (!req.session.host) {
		req.session.redirectUrl = req.originalUrl;

		res.redirect("/");
		res.end();

		return true;
	}

	return false;
}

function hex2ascii(hex) {
	var str = "";
	for (var i = 0; i < hex.length; i += 2) {
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	}

	return str;
}

function hex2array(hex) {
	return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

function hex2string(hex, encoding = 'utf-8') {
	return new textdecoding.TextDecoder(encoding).decode(hex2array(hex))
}

function splitArrayIntoChunks(array, chunkSize) {
	var j = array.length;
	var chunks = [];

	for (var i = 0; i < j; i += chunkSize) {
		chunks.push(array.slice(i, i + chunkSize));
	}

	return chunks;
}

function splitArrayIntoChunksByChunkCount(array, chunkCount) {
	var bigChunkSize = Math.ceil(array.length / chunkCount);
	var bigChunkCount = chunkCount - (chunkCount * bigChunkSize - array.length);

	var chunks = [];

	var chunkStart = 0;
	for (var chunk = 0; chunk < chunkCount; chunk++) {
		var chunkSize = (chunk < bigChunkCount ? bigChunkSize : (bigChunkSize - 1));

		chunks.push(array.slice(chunkStart, chunkStart + chunkSize));

		chunkStart += chunkSize;
	}

	return chunks;
}

function getRandomString(length, chars) {
	var mask = '';
	
	if (chars.indexOf('a') > -1) {
		mask += 'abcdefghijklmnopqrstuvwxyz';
	}
	
	if (chars.indexOf('A') > -1) {
		mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	}
	
	if (chars.indexOf('#') > -1) {
		mask += '0123456789';
	}
	
	if (chars.indexOf('!') > -1) {
		mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
	}
	
	var result = '';
	for (var i = length; i > 0; --i) {
		result += mask[Math.floor(Math.random() * mask.length)];
	}

	return result;
}

var formatCurrencyCache = {};

function getCurrencyFormatInfo(formatType) {
	if (formatCurrencyCache[formatType] == null) {
		for (var x = 0; x < coins[config.coin].currencyUnits.length; x++) {
			var currencyUnit = coins[config.coin].currencyUnits[x];

			for (var y = 0; y < currencyUnit.values.length; y++) {
				var currencyUnitValue = currencyUnit.values[y];

				if (currencyUnitValue == formatType) {
					formatCurrencyCache[formatType] = currencyUnit;
				}
			}
		}
	}

	return formatCurrencyCache[formatType];
}

function formatCurrencyAmountWithForcedDecimalPlaces(amount, formatType, forcedDecimalPlaces) {
	var formatInfo = getCurrencyFormatInfo(formatType);
	if (formatInfo != null) {
		var dec = new Decimal(amount);

		var decimalPlaces = formatInfo.decimalPlaces;

		if (forcedDecimalPlaces >= 8) {
			decimalPlaces = forcedDecimalPlaces;
		}

		if (formatInfo.type == "native") {
			dec = dec.times(formatInfo.multiplier);

			if (forcedDecimalPlaces >= 8) {
				// toFixed will keep trailing zeroes
				var baseStr = addThousandsSeparators(dec.toFixed(decimalPlaces));

				return {val:baseStr, currencyUnit:formatInfo.name, simpleVal:baseStr};

			} else {
				// toDP will strip trailing zeroes
				var baseStr = addThousandsSeparators(dec.toDP(decimalPlaces));

				var returnVal = {currencyUnit:formatInfo.name, simpleVal:baseStr};

				// max digits in "val"
				var maxValDigits = config.site.valueDisplayMaxLargeDigits;

				if (baseStr.indexOf(".") == -1) {
					returnVal.val = baseStr;

				} else {
					if (baseStr.length - baseStr.indexOf(".") - 1 > maxValDigits) {
						returnVal.val = baseStr.substring(0, baseStr.indexOf(".") + maxValDigits + 1);
						returnVal.lessSignificantDigits = baseStr.substring(baseStr.indexOf(".") + maxValDigits + 1);

					} else {
						returnVal.val = baseStr;
					}
				}

				return returnVal;
			}

		} else if (formatInfo.type == "exchanged") {
			if (global.exchangeRates != null && global.exchangeRates[formatInfo.multiplier] != null) {
				dec = dec.times(global.exchangeRates[formatInfo.multiplier]);

				var baseStr = addThousandsSeparators(dec.toDecimalPlaces(decimalPlaces));

				return {val:baseStr, currencyUnit:formatInfo.name, simpleVal:baseStr};
			} else {
				return formatCurrencyAmountWithForcedDecimalPlaces(amount, coinConfig.defaultCurrencyUnit.name, forcedDecimalPlaces);
			}
		}
	}

	return amount;
}

function formatCurrencyAmount(amount, formatType) {
	return formatCurrencyAmountWithForcedDecimalPlaces(amount, formatType, -1);
}

function formatCurrencyAmountInSmallestUnits(amount, forcedDecimalPlaces) {
	return formatCurrencyAmountWithForcedDecimalPlaces(amount, coins[config.coin].baseCurrencyUnit.name, forcedDecimalPlaces);
}

// ref: https://stackoverflow.com/a/2901298/673828
function addThousandsSeparators(x) {
	var parts = x.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	return parts.join(".");
}

function formatValueInActiveCurrency(amount) {
	if (global.currencyFormatType && global.exchangeRates[global.currencyFormatType.toLowerCase()]) {
		return formatExchangedCurrency(amount, global.currencyFormatType);

	} else {
		return formatExchangedCurrency(amount, "usd");
	}
}

function satoshisPerUnitOfActiveCurrency() {
	if (global.currencyFormatType != null && global.exchangeRates != null) {
		var exchangeType = global.currencyFormatType.toLowerCase();

		if (!global.exchangeRates[global.currencyFormatType.toLowerCase()]) {
			// if current display currency is a native unit, default to USD for exchange values
			exchangeType = "usd";
		}

		var dec = new Decimal(1);
		var one = new Decimal(1);
		dec = dec.times(global.exchangeRates[exchangeType]);

		// USD/BTC -> BTC/USD
		dec = one.dividedBy(dec);

		var unitName = coins[config.coin].baseCurrencyUnit.name;
		var formatInfo = getCurrencyFormatInfo(unitName);

		// BTC/USD -> sat/USD
		dec = dec.times(formatInfo.multiplier);

		var exchangedAmt = parseInt(dec);

		if (exchangeType == "eur") {
			return {amt:addThousandsSeparators(exchangedAmt), unit:`${unitName}/€`};
		} else {
			return {amt:addThousandsSeparators(exchangedAmt), unit:`${unitName}/$`};
		}

	}

	return null;
}

function formatExchangedCurrency(amount, exchangeType) {
	if (global.exchangeRates != null && global.exchangeRates[exchangeType.toLowerCase()] != null) {
		var dec = new Decimal(amount);
		dec = dec.times(global.exchangeRates[exchangeType.toLowerCase()]);
		var exchangedAmt = parseFloat(Math.round(dec * 100) / 100).toFixed(2);

		if (exchangeType == "eur") {
			return "€" + addThousandsSeparators(exchangedAmt);

		} else {
			return "$" + addThousandsSeparators(exchangedAmt);
		}

	}

	return "";
}

function seededRandom(seed) {
	var x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}

function seededRandomIntBetween(seed, min, max) {
	var rand = seededRandom(seed);
	return (min + (max - min) * rand);
}

function ellipsize(str, length, ending="…") {
	if (str.length <= length) {
		return str;

	} else {
		return str.substring(0, length - ending.length) + ending;
	}
}

function shortenTimeDiff(str) {
	str = str.replace(" years", "y");
	str = str.replace(" year", "y");

	str = str.replace(" months", "mo");
	str = str.replace(" month", "mo");

	str = str.replace(" weeks", "w");
	str = str.replace(" week", "w");

	str = str.replace(" days", "d");
	str = str.replace(" day", "d");

	str = str.replace(" hours", "hr");
	str = str.replace(" hour", "hr");

	str = str.replace(" minutes", "min");
	str = str.replace(" minute", "min");

	return str;
}

function logMemoryUsage() {
	var mbUsed = process.memoryUsage().heapUsed / 1024 / 1024;
	mbUsed = Math.round(mbUsed * 100) / 100;

	var mbTotal = process.memoryUsage().heapTotal / 1024 / 1024;
	mbTotal = Math.round(mbTotal * 100) / 100;

	//debugLog("memoryUsage: heapUsed=" + mbUsed + ", heapTotal=" + mbTotal + ", ratio=" + parseInt(mbUsed / mbTotal * 100));
}

var possibleMinerSignalRE = /\/(.*)\//;

function getMinerFromCoinbaseTx(tx) {
	if (tx == null || tx.vin == null || tx.vin.length == 0) {
		return null;
	}

	var minerInfo = {
		coinbaseStr: hex2string(tx.vin[0].coinbase)
	};

	var possibleSignal = minerInfo.coinbaseStr.match(possibleMinerSignalRE);
	if (possibleSignal)
		minerInfo.possibleSignal = possibleSignal[1];

	if (global.miningPoolsConfigs) {
		poolLoop:
		for (var i = 0; i < global.miningPoolsConfigs.length; i++) {
			var miningPoolsConfig = global.miningPoolsConfigs[i];

			for (var payoutAddress in miningPoolsConfig.payout_addresses) {
				if (miningPoolsConfig.payout_addresses.hasOwnProperty(payoutAddress)) {
					if (tx.vout && tx.vout.length > 0 && tx.vout[0].scriptPubKey && tx.vout[0].scriptPubKey.addresses && tx.vout[0].scriptPubKey.addresses.length > 0) {
						if (tx.vout[0].scriptPubKey.addresses[0] == payoutAddress) {
							Object.assign(minerInfo, miningPoolsConfig.payout_addresses[payoutAddress]);
							minerInfo.identifiedBy = "payout address " + payoutAddress;
							break poolLoop;
						}
					}
				}
			}

			for (var coinbaseTag in miningPoolsConfig.coinbase_tags) {
				if (miningPoolsConfig.coinbase_tags.hasOwnProperty(coinbaseTag)) {
					var coinbaseLower = minerInfo.coinbaseStr.toLowerCase();
					var coinbaseTagLower = coinbaseTag.toLowerCase();
					if (coinbaseLower.indexOf(coinbaseTagLower) != -1) {
						Object.assign(minerInfo, miningPoolsConfig.coinbase_tags[coinbaseTag]);
						minerInfo.identifiedBy = "coinbase tag '" + coinbaseTag + "' in '" + minerInfo.coinbaseStr + "'";
						break poolLoop;
					}
				}
			}

			for (var blockHash in miningPoolsConfig.block_hashes) {
				if (blockHash == tx.blockhash) {
					Object.assign(minerInfo, miningPoolsConfig.block_hashes[blockHash]);
					minerInfo.identifiedBy = "known block hash '" + blockHash + "'";
					break poolLoop;
				}
			}
		}
	}
	if ((!minerInfo.identifiedBy) && (minerInfo.possibleSignal)) {
		minerInfo.name = minerInfo.possibleSignal;
	}
	return minerInfo;
}

function getTxTotalInputOutputValues(tx, txInputs, blockHeight) {
	var totalInputValue = new Decimal(0);
	var totalOutputValue = new Decimal(0);

	try {
		for (var i = 0; i < tx.vin.length; i++) {
			if (tx.vin[i].coinbase) {
				totalInputValue = totalInputValue.plus(new Decimal(coinConfig.blockRewardFunction(blockHeight, global.activeBlockchain)));

			} else {
				var txInput = txInputs[i];

				if (txInput) {
					try {
						var vout = txInput;
						if (vout.value) {
							totalInputValue = totalInputValue.plus(new Decimal(vout.value));
						}
					} catch (err) {
						logError("2397gs0gsse", err, {txid:tx.txid, vinIndex:i});
					}
				}
			}
		}

		for (var i = 0; i < tx.vout.length; i++) {
			totalOutputValue = totalOutputValue.plus(new Decimal(tx.vout[i].value));
		}
	} catch (err) {
		logError("2308sh0sg44", err, {tx:tx, txInputs:txInputs, blockHeight:blockHeight});
	}

	return {input:totalInputValue, output:totalOutputValue};
}

function getBlockTotalFeesFromCoinbaseTxAndBlockHeight(coinbaseTx, blockHeight) {
	if (coinbaseTx == null) {
		return 0;
	}

	var blockReward = coinConfig.blockRewardFunction(blockHeight, global.activeBlockchain);

	var totalOutput = new Decimal(0);
	for (var i = 0; i < coinbaseTx.vout.length; i++) {
		var outputValue = coinbaseTx.vout[i].value;
		if (outputValue > 0) {
			totalOutput = totalOutput.plus(new Decimal(outputValue));
		}
	}

	return totalOutput.minus(new Decimal(blockReward));
}

function refreshExchangeRates() {
	if (!config.queryExchangeRates || config.privacyMode) {
		return;
	}

	if (coins[config.coin].exchangeRateData) {
		request(coins[config.coin].exchangeRateData.jsonUrl, function(error, response, body) {
			if (error == null && response && response.statusCode && response.statusCode == 200) {
				var responseBody = JSON.parse(body);

				var exchangeRates = coins[config.coin].exchangeRateData.responseBodySelectorFunction(responseBody);
				if (exchangeRates != null) {
					global.exchangeRates = exchangeRates;
					global.exchangeRatesUpdateTime = new Date();

					debugLog("Using exchange rates: " + JSON.stringify(global.exchangeRates) + " starting at " + global.exchangeRatesUpdateTime);
					getExchangeFromExchangeRateExtensions();
				} else {
					debugLog("Unable to get exchange rate data");
				}
			} else {
				logError("39r7h2390fgewfgds", {error:error, response:response, body:body});
			}
		});
	}
}

function getExchangeFromExchangeRateExtensions() {
	// Any other extended currency conversion must use the TRRXITTEUSD base conversion rate to be calculated, in consecuence --no-rates must be disabled.
	var anyExtensionIsActive = coins[config.coin].currencyUnits.find(cu => cu.isExtendedRate) != undefined;
	if (anyExtensionIsActive && coins[config.coin].exchangeRateDataExtension.length > 0 && global.exchangeRates['usd']) {
		coins[config.coin].exchangeRateDataExtension.forEach(exchangeProvider => {
			request(exchangeProvider.jsonUrl, function(error, response, body) {
				if (error == null && response && response.statusCode && response.statusCode == 200) {
					var responseBody = JSON.parse(body);
	
					var exchangeRates = exchangeProvider.responseBodySelectorFunction(responseBody);
					if (exchangeRates != null || Object.entries(exchangeRates).length > 0) {
						var originalExchangeRates = global.exchangeRates;
						var extendedExchangeRates =  {};
						for (const  key in exchangeRates) {
							extendedExchangeRates[key] = (parseFloat(originalExchangeRates.usd) * parseFloat(exchangeRates[key])).toString();
						}
						global.exchangeRates = {
							...originalExchangeRates,
							...extendedExchangeRates
						}
						global.exchangeRatesUpdateTime = new Date();
	
						debugLog("Using extended exchange rates: " + JSON.stringify(global.exchangeRates) + " starting at " + global.exchangeRatesUpdateTime);
	
					} else {
						debugLog("Unable to get extended exchange rate data");
					}
				} else {
					logError("83ms2hsnw2je34zc2", {error:error, response:response, body:body});
				}
			});
		});
	}
}

// Uses ipstack.com API
function geoLocateIpAddresses(ipAddresses, provider) {
	return new Promise(function(resolve, reject) {
		if (config.privacyMode || config.credentials.ipStackComApiAccessKey === undefined) {
			resolve({});

			return;
		}

		var ipDetails = {ips:ipAddresses, detailsByIp:{}};

		var promises = [];
		for (var i = 0; i < ipAddresses.length; i++) {
			var ipStr = ipAddresses[i];

			promises.push(new Promise(function(resolve2, reject2) {
				ipCache.get(ipStr).then(function(result) {
					if (result.value == null) {
						var apiUrl = "http://api.ipstack.com/" + result.key + "?access_key=" + config.credentials.ipStackComApiAccessKey;

						debugLog("Requesting IP-geo: " + apiUrl);

						request(apiUrl, function(error, response, body) {
							if (error) {
								reject2(error);

							} else {
								resolve2({needToProcess:true, response:response});
							}
						});

					} else {
						ipDetails.detailsByIp[result.key] = result.value;

						resolve2({needToProcess:false});
					}
				});
			}));
		}

		Promise.all(promises).then(function(results) {
			for (var i = 0; i < results.length; i++) {
				if (results[i].needToProcess) {
					var res = results[i].response;
					if (res != null && res["statusCode"] == 200) {
						var resBody = JSON.parse(res["body"]);
						var ip = resBody["ip"];

						ipDetails.detailsByIp[ip] = resBody;

						ipCache.set(ip, resBody, 1000 * 60 * 60 * 24 * 365);
					}
				}
			}

			resolve(ipDetails);

		}).catch(function(err) {
			logError("80342hrf78wgehdf07gds", err);

			reject(err);
		});
	});
}

function parseExponentStringDouble(val) {
	var [lead,decimal,pow] = val.toString().split(/e|\./);
	return +pow <= 0
		? "0." + "0".repeat(Math.abs(pow)-1) + lead + decimal
		: lead + ( +pow >= decimal.length ? (decimal + "0".repeat(+pow-decimal.length)) : (decimal.slice(0,+pow)+"."+decimal.slice(+pow)));
}

var exponentScales = [
	{val:1000000000000000000000000000000000, name:"?", abbreviation:"V", exponent:"33"},
	{val:1000000000000000000000000000000, name:"?", abbreviation:"W", exponent:"30"},
	{val:1000000000000000000000000000, name:"?", abbreviation:"X", exponent:"27"},
	{val:1000000000000000000000000, name:"yotta", abbreviation:"Y", exponent:"24"},
	{val:1000000000000000000000, name:"zetta", abbreviation:"Z", exponent:"21"},
	{val:1000000000000000000, name:"exa", abbreviation:"E", exponent:"18"},
	{val:1000000000000000, name:"peta", abbreviation:"P", exponent:"15", textDesc:"Q"},
	{val:1000000000000, name:"tera", abbreviation:"T", exponent:"12", textDesc:"T"},
	{val:1000000000, name:"giga", abbreviation:"G", exponent:"9", textDesc:"B"},
	{val:1000000, name:"mega", abbreviation:"M", exponent:"6", textDesc:"M"},
	{val:1000, name:"kilo", abbreviation:"K", exponent:"3", textDesc:"thou"},
	{val:1, name:"", abbreviation:"", exponent:"0", textDesc:""}
];

function testExponentScaleIndex(n, exponentScaleIndex) {
	var item = exponentScales[exponentScaleIndex];
	var fraction = new Decimal(n / item.val);
	return {
		ok: fraction >= 1,
		fraction: fraction
	};
}

function getBestExponentScaleIndex(n) {
	if (n < 1)
		return exponentScales.length - 1;

	for (var i = 0; i < exponentScales.length; i++) {
		var res = testExponentScaleIndex(n, i);
		if (res.ok)
			return i;
	}
	throw new Error(`Unable to find exponent scale index for ${n}`);
}

function findBestCommonExponentScaleIndex(ns) {
	var best = ns.map(n => getBestExponentScaleIndex(n));
	return Math.max(...best);
}

function formatLargeNumber(n, decimalPlaces, exponentScaleIndex = undefined) {
	if (exponentScaleIndex === undefined)
		exponentScaleIndex = getBestExponentScaleIndex(n);

	var item = exponentScales[exponentScaleIndex];
	var fraction = new Decimal(n / item.val);
	return [fraction.toDecimalPlaces(decimalPlaces), item];
}

function rgbToHsl(r, g, b) {
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if(max == min){
		h = s = 0; // achromatic
	}else{
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max){
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}

	return {h:h, s:s, l:l};
}

function colorHexToRgb(hex) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function colorHexToHsl(hex) {
	var rgb = colorHexToRgb(hex);
	return rgbToHsl(rgb.r, rgb.g, rgb.b);
}


// https://stackoverflow.com/a/31424853/673828
const reflectPromise = p => p.then(v => ({v, status: "resolved" }),
							e => ({e, status: "rejected" }));

global.errorStats = {};

function logError(errorId, err, optionalUserData = null) {
	if (!global.errorLog) {
		global.errorLog = [];
	}

	if (!global.errorStats[errorId]) {
		global.errorStats[errorId] = {
			count: 0,
			firstSeen: new Date().getTime()
		};
	}

	global.errorStats[errorId].count++;
	global.errorStats[errorId].lastSeen = new Date().getTime();

	global.errorLog.push({errorId:errorId, error:err, userData:optionalUserData, date:new Date()});
	while (global.errorLog.length > 100) {
		global.errorLog.splice(0, 1);
	}

	debugErrorLog("Error " + errorId + ": " + err + ", json: " + JSON.stringify(err) + (optionalUserData != null ? (", userData: " + optionalUserData + " (json: " + JSON.stringify(optionalUserData) + ")") : ""));

	if (err && err.stack) {
		debugErrorVerboseLog("Stack: " + err.stack);
	}

	var returnVal = {errorId:errorId, error:err};
	if (optionalUserData) {
		returnVal.userData = optionalUserData;
	}

	return returnVal;
}

function buildQrCodeUrls(strings) {
	return new Promise(function(resolve, reject) {
		var promises = [];
		var qrcodeUrls = {};

		for (var i = 0; i < strings.length; i++) {
			promises.push(new Promise(function(resolve2, reject2) {
				buildQrCodeUrl(strings[i], qrcodeUrls).then(function() {
					resolve2();

				}).catch(function(err) {
					reject2(err);
				});
			}));
		}

		Promise.all(promises).then(function(results) {
			resolve(qrcodeUrls);

		}).catch(function(err) {
			reject(err);
		});
	});
}

function buildQrCodeUrl(str, results) {
	return new Promise(function(resolve, reject) {
		qrcode.toDataURL(str, function(err, url) {
			if (err) {
				logError("2q3ur8fhudshfs", err, str);

				reject(err);

				return;
			}

			results[str] = url;

			resolve();
		});
	});
}

function outputTypeAbbreviation(outputType) {
	var map = {
		"multisig": "bms",
		"pubkey": "p2pk",
		"pubkeyhash": "p2pkh",
		"scripthash": "p2sh",
		"witness_v0_keyhash": "v0_p2wpkh",
		"witness_v0_scripthash": "v0_p2wsh",
		"nonstandard": "nonstandard",
		"nulldata": "nulldata"
	};

	if (map[outputType]) {
		return map[outputType];
	} else {
		return "???";
	}
}

/**
 * Given a 32-byte hex-encoded token category, return a deterministic hue and
 * saturation value to use in HSL colors representing the token category. 
 * Usage: `hsl(${ tokenCategory2HueSaturation(vout.tokenData.category) }, 50%)`
 */
function tokenCategory2HueSaturation(category) {
	const bin = hex2array(category);
	const raw = bin.reduce((acc, num) => acc * num, 1) % 36000;
	const hue = (raw / 100).toFixed(0);
	const saturation = Math.min(100, (raw / 360 + 50)).toFixed(0);
	return `${hue},${saturation}%`;
}

function prettyScript(inScript, indentChar) {
	var indenter=["OP_IF", "OP_ELSE"]
	var outdenter=["OP_ENDIF", "OP_ELSE"]

	s = inScript.split(" ");
	var shiftAmt=0;
	var i;
	var indenting = '';

	for (i = 0; i < s.length; i++) {
		var item=s[i];
		if (s[i].slice(0,2) == "OP")
		{
			s[i] = "<span class='opcode'>" + s[i] + "</span>";
		}
		if (outdenter.includes(item)) shiftAmt -= 1;
		if (shiftAmt < 0) shiftAmt = 0;
		indenting = Array(shiftAmt).join(indentChar);
		s[i] = "<div style='text-indent: " + indenting  + "em'>" + s[i] + "</div>";
		if (indenter.includes(item)) shiftAmt += 1;
	}
	return s.join("\n");
}

function outputTypeName(outputType) {
	var map = {
		"multisig": "Bare Multisig",
		"pubkey": "Pay to Public Key",
		"pubkeyhash": "Pay to Public Key Hash",
		"scripthash": "Pay to Script Hash",
		"witness_v0_keyhash": "Witness, v0 Key Hash",
		"witness_v0_scripthash": "Witness, v0 Script Hash",
		"nonstandard": "Non-Standard",
		"nulldata": "Null Data"
	};

	if (map[outputType]) {
		return map[outputType];
	} else {
		return "???";
	}
}

function serviceBitsToName (services) {
	var serviceBits = [];
	if (services & 1) { serviceBits.push('NODE_NETWORK'); }
	if (services & 2) { serviceBits.push('NODE_GETUTXO'); }
	if (services & 4) { serviceBits.push('NODE_BLOOM'); }
	if (services & 8) { serviceBits.push('NODE_WITNESS'); }
	if (services & 16) { serviceBits.push('NODE_XTHIN'); }
	if (services & 32) { serviceBits.push('NODE_CASH'); }
	if (services & 64) { serviceBits.push('NODE_GRAPHENE'); }
	if (services & 128) { serviceBits.push('NODE_WEAKBLOCKS'); }
	if (services & 256) { serviceBits.push('NODE_CF'); }
	if (services & 1024) { serviceBits.push('NODE_NETWORK_LIMITED'); }
	return serviceBits;
}

function getTransactionDatetime(utcEpochTime) {
	var epoch = new Date(0);
	epoch.setUTCSeconds(utcEpochTime);
	var formatted_date = epoch.getFullYear() + "-" + (epoch.getMonth() + 1) + "-" + epoch.getDate() + " " + epoch.toUTCString();

	return formatted_date;
}

module.exports = {
	reflectPromise: reflectPromise,
	redirectToConnectPageIfNeeded: redirectToConnectPageIfNeeded,
	hex2ascii: hex2ascii,
	hex2array: hex2array,
	hex2string: hex2string,
	tokenCategory2HueSaturation: tokenCategory2HueSaturation,
	splitArrayIntoChunks: splitArrayIntoChunks,
	splitArrayIntoChunksByChunkCount: splitArrayIntoChunksByChunkCount,
	getRandomString: getRandomString,
	getCurrencyFormatInfo: getCurrencyFormatInfo,
	formatCurrencyAmount: formatCurrencyAmount,
	formatCurrencyAmountWithForcedDecimalPlaces: formatCurrencyAmountWithForcedDecimalPlaces,
	formatExchangedCurrency: formatExchangedCurrency,
	formatValueInActiveCurrency: formatValueInActiveCurrency,
	satoshisPerUnitOfActiveCurrency: satoshisPerUnitOfActiveCurrency,
	addThousandsSeparators: addThousandsSeparators,
	formatCurrencyAmountInSmallestUnits: formatCurrencyAmountInSmallestUnits,
	seededRandom: seededRandom,
	seededRandomIntBetween: seededRandomIntBetween,
	logMemoryUsage: logMemoryUsage,
	getMinerFromCoinbaseTx: getMinerFromCoinbaseTx,
	getBlockTotalFeesFromCoinbaseTxAndBlockHeight: getBlockTotalFeesFromCoinbaseTxAndBlockHeight,
	refreshExchangeRates: refreshExchangeRates,
	parseExponentStringDouble: parseExponentStringDouble,
	findBestCommonExponentScaleIndex: findBestCommonExponentScaleIndex,
	formatLargeNumber: formatLargeNumber,
	geoLocateIpAddresses: geoLocateIpAddresses,
	getTxTotalInputOutputValues: getTxTotalInputOutputValues,
	rgbToHsl: rgbToHsl,
	colorHexToRgb: colorHexToRgb,
	colorHexToHsl: colorHexToHsl,
	logError: logError,
	buildQrCodeUrls: buildQrCodeUrls,
	ellipsize: ellipsize,
	shortenTimeDiff: shortenTimeDiff,
	prettyScript: prettyScript,
	outputTypeAbbreviation: outputTypeAbbreviation,
	outputTypeName: outputTypeName,
	serviceBitsToName: serviceBitsToName,
	perfMeasure: perfMeasure,
	getTransactionDatetime: getTransactionDatetime
};
