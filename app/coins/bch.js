var Decimal = require("decimal.js");
Decimal8 = Decimal.clone({ precision: 8, rounding: 8 });

var currencyUnits = [
  {
    type: "native",
    name: "TRRXITTE",
    multiplier: 1,
    default: true,
    values: ["", "trrxitte", "TRRXITTE"],
    decimalPlaces: 8,
  },
  {
    type: "native",
    name: "mTRRXITTE",
    multiplier: 1000,
    values: ["mtrrxitte"],
    decimalPlaces: 5,
  },
  {
    type: "native",
    name: "bits",
    multiplier: 1000000,
    values: ["bits"],
    decimalPlaces: 2,
  },
  {
    type: "native",
    name: "sat",
    multiplier: 100000000,
    values: ["sat", "satoshi"],
    decimalPlaces: 0,
  },
  {
    type: "exchanged",
    name: "USD",
    multiplier: "usd",
    values: ["usd"],
    decimalPlaces: 2,
    symbol: "$",
  },
  {
    type: "exchanged",
    name: "EUR",
    multiplier: "eur",
    values: ["eur"],
    decimalPlaces: 2,
    symbol: "€",
  },
  {
    type: "exchanged",
    name: "ARS",
    multiplier: "ars",
    values: ["ars"],
    decimalPlaces: 2,
    symbol: "$",
    isExtendedRate: true,
  },
];

module.exports = {
  name: "TRRXITTE Bitcoin", // Change to "Bitcoin" if using BTC
  ticker: "TRRXITTE", // Change to "BTC" if using BTC
  logoUrl: "/img/logo/bitcoin.png",
  faviconUrl: "/img/logo/bitcoin.png",
  siteTitle: "TRRXITTE Bitcoin database scan",
  siteTitleHtml: "TRRXITTE Bitcoin database scan",
  siteDescriptionHtml: "<b>TRRXITTE database</b>",
  nodeTitle: "TRRXITTE Bitcoin Full Node",
  nodeUrl: "https://www.btc.trrxitte.com",
  demoSiteUrl: "https://explorer.trrxitte.com",
  miningPoolsConfigUrls: [
    "https://raw.githubusercontent.com/btccom/Blockchain-Known-Pools/master/pools.json",
    "https://raw.githubusercontent.com/blockchain/Blockchain-Known-Pools/master/pools.json",
  ],
  maxBlockSizeByNetwork: {
    main: 1000000, // Reduced from 32000000 to fix 0% fullness
    test: 1000000,
    chip: 2000000,
    test4: 2000000,
    scale: 256000000,
  },
  difficultyAdjustmentBlockOffset: 1008,
  difficultyAdjustmentBlockCount: 4,
  maxSupplyByNetwork: {
    main: new Decimal(100000000), // Adjust if different for TRRXITTE
    test: new Decimal(21000000),
    chip: new Decimal(21000000),
    test4: new Decimal(21000000),
    scale: new Decimal(21000000),
    regtest: new Decimal(21000000),
  },
  targetBlockTimeSeconds: 100,
  targetBlockTimeMinutes: 1.5,
  currencyUnits: currencyUnits,
  currencyUnitsByName: {
    TRRXITTE: currencyUnits[0],
    mTRRXITTE: currencyUnits[1],
    bits: currencyUnits[2],
    sat: currencyUnits[3],
  },
  baseCurrencyUnit: currencyUnits[3],
  defaultCurrencyUnit: currencyUnits[0],
  feeSatoshiPerByteBucketMaxima: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 50, 75, 100, 150],
  genesisBlockHashesByNetwork: {
    main: "00000484c46425cb3b260b4ecc3c33f032bf8bc8396eca605309696e4c361516",
    test: "000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943",
    chip: "000000001dd410c49a788668ce26751718cc797474d3152a5fc073dd44fd9f7b",
    test4: "000000001dd410c49a788668ce26751718cc797474d3152a5fc073dd44fd9f7b",
    scale: "00000000e6453dc2dfe1ffa19023f86002eb11dbb8e87d0291a4599f0430be52",
    regtest: "0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206",
  },
  genesisCoinbaseTransactionIdsByNetwork: {
    main: "3b91683bea9b73100e013a7a1af2c9c824f79157d81bf9f63cb25fc41f4d29fe",
    test: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
    chip: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
    test4: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
    scale: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
    regtest: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
  },
  genesisCoinbaseTransactionsByNetwork: {
    main: {
      hex: "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff2304ffff001d01041e323032352d30332d333120545252584954544520426974636f696effffffff0150c300000000000041042613842e49710f8e990f7352fd68c43722e3ae81f1cdd7c699f3496a333c5b2e862730b14e44646183e05e92fb1898193076b4022ececc798cd2b079b6a6cb91ac00000000",
      txid: "3b91683bea9b73100e013a7a1af2c9c824f79157d81bf9f63cb25fc41f4d29fe",
      hash: "3b91683bea9b73100e013a7a1af2c9c824f79157d81bf9f63cb25fc41f4d29fe",
      size: 190,
      version: 1,
      confirmations: 1,
      vin: [
        {
          coinbase: "04ffff001d01041e323032352d30332d333120545252584954544520426974636f696e",
          sequence: 4294967295,
        },
      ],
      vout: [
        {
          value: 50.00000000,
          n: 0,
          scriptPubKey: {
            asm: "042613842e49710f8e990f7352fd68c43722e3ae81f1cdd7c699f3496a333c5b2e862730b14e44646183e05e92fb1898193076b4022ececc798cd2b079b6a6cb91 OP_CHECKSIG",
            hex: "41042613842e49710f8e990f7352fd68c43722e3ae81f1cdd7c699f3496a333c5b2e862730b14e44646183e05e92fb1898193076b4022ececc798cd2b079b6a6cb91ac",
            reqSigs: 1,
            type: "pubkey",
            addresses: ["1K7r8rR9nkwb4o9uLqWq4oJ3oqZ3oJ3oqZ"],
          },
        },
      ],
      blockhash: "00000484c46425cb3b260b4ecc3c33f032bf8bc8396eca605309696e4c361516",
      time: 1743436800,
      blocktime: 1743436800,
    },
    test: {
      hex: "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000",
      txid: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
      hash: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
      version: 1,
      size: 204,
      locktime: 0,
      vin: [
        {
          coinbase: "04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73",
          sequence: 4294967295,
        },
      ],
      vout: [
        {
          value: 50.00000000,
          n: 0,
          scriptPubKey: {
            asm: "04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f OP_CHECKSIG",
            hex: "4104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac",
            reqSigs: 1,
            type: "pubkey",
            addresses: ["mpXwg4jMtRhuSpVq4xS3HFHmCmWp9NyGKt"],
          },
        },
      ],
      blockhash: "000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943",
      time: 1296688602,
      blocktime: 1296688602,
    },
    chip: {
      hex: "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000",
      txid: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
      hash: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
      version: 1,
      size: 204,
      locktime: 0,
      vin: [
        {
          coinbase: "04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73",
          sequence: 4294967295,
        },
      ],
      vout: [
        {
          value: 50.00000000,
          n: 0,
          scriptPubKey: {
            asm: "04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f OP_CHECKSIG",
            hex: "4104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac",
            reqSigs: 1,
            type: "pubkey",
            addresses: ["mpXwg4jMtRhuSpVq4xS3HFHmCmWp9NyGKt"],
          },
        },
      ],
      blockhash: "000000001dd410c49a788668ce26751718cc797474d3152a5fc073dd44fd9f7b",
      time: 1597811185,
      blocktime: 1597811185,
    },
    test4: {
      hex: "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000",
      txid: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
      hash: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
      version: 1,
      size: 204,
      locktime: 0,
      vin: [
        {
          coinbase: "04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73",
          sequence: 4294967295,
        },
      ],
      vout: [
        {
          value: 50.00000000,
          n: 0,
          scriptPubKey: {
            asm: "04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f OP_CHECKSIG",
            hex: "4104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac",
            reqSigs: 1,
            type: "pubkey",
            addresses: ["mpXwg4jMtRhuSpVq4xS3HFHmCmWp9NyGKt"],
          },
        },
      ],
      blockhash: "000000001dd410c49a788668ce26751718cc797474d3152a5fc073dd44fd9f7b",
      time: 1597811185,
      blocktime: 1597811185,
    },
    scale: {
      hex: "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000",
      txid: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
      hash: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
      version: 1,
      size: 204,
      locktime: 0,
      vin: [
        {
          coinbase: "04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73",
          sequence: 4294967295,
        },
      ],
      vout: [
        {
          value: 50.00000000,
          n: 0,
          scriptPubKey: {
            asm: "04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f OP_CHECKSIG",
            hex: "4104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac",
            reqSigs: 1,
            type: "pubkey",
            addresses: ["mpXwg4jMtRhuSpVq4xS3HFHmCmWp9NyGKt"],
          },
        },
      ],
      blockhash: "00000000e6453dc2dfe1ffa19023f86002eb11dbb8e87d0291a4599f0430be52",
      time: 1598282438,
      blocktime: 1598282438,
    },
    regtest: {
      hex: "01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000",
      txid: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
      hash: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
      version: 1,
      size: 204,
      locktime: 0,
      vin: [
        {
          coinbase: "04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73",
          sequence: 4294967295,
        },
      ],
      vout: [
        {
          value: 50.00000000,
          n: 0,
          scriptPubKey: {
            asm: "04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f OP_CHECKSIG",
            hex: "4104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac",
            type: "pubkey",
          },
        },
      ],
      blockhash: "0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206",
      time: 1296688602,
      blocktime: 1296688602,
    },
  },
  genesisBlockStatsByNetwork: {
    main: {
      avgfee: 0,
      avgfeerate: 0,
      avgtxsize: 0,
      blockhash: "00000484c46425cb3b260b4ecc3c33f032bf8bc8396eca605309696e4c361516",
      feerate_percentiles: [0, 0, 0, 0, 0],
      height: 0,
      ins: 0,
      maxfee: 0,
      maxfeerate: 0,
      maxtxsize: 0,
      medianfee: 0,
      mediantime: 1743436800,
      mediantxsize: 0,
      minfee: 0,
      minfeerate: 0,
      mintxsize: 0,
      outs: 1,
      subsidy: 50,
      time: 1743436800,
      total_out: 0,
      total_size: 0,
      totalfee: 0,
      txs: 1,
      utxo_increase: 1,
      utxo_size_inc: 117,
    },
    test: {
      avgfee: 0,
      avgfeerate: 0,
      avgtxsize: 0,
      blockhash: "000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943",
      feerate_percentiles: [0, 0, 0, 0, 0],
      height: 0,
      ins: 0,
      maxfee: 0,
      maxfeerate: 0,
      maxtxsize: 0,
      medianfee: 0,
      mediantime: 1296688602,
      mediantxsize: 0,
      minfee: 0,
      minfeerate: 0,
      mintxsize: 0,
      outs: 1,
      subsidy: 50,
      time: 1296688602,
      total_out: 0,
      total_size: 0,
      totalfee: 0,
      txs: 1,
      utxo_increase: 1,
      utxo_size_inc: 117,
    },
    chip: {
      avgfee: 0,
      avgfeerate: 0,
      avgtxsize: 0,
      blockhash: "000000001dd410c49a788668ce26751718cc797474d3152a5fc073dd44fd9f7b",
      feerate_percentiles: [0, 0, 0, 0, 0],
      height: 0,
      ins: 0,
      maxfee: 0,
      maxfeerate: 0,
      maxtxsize: 0,
      medianfee: 0,
      mediantime: 1296688602,
      mediantxsize: 0,
      minfee: 0,
      minfeerate: 0,
      mintxsize: 0,
      outs: 1,
      subsidy: 50,
      time: 1296688602,
      total_out: 0,
      total_size: 0,
      totalfee: 0,
      txs: 1,
      utxo_increase: 1,
      utxo_size_inc: 117,
    },
    test4: {
      avgfee: 0,
      avgfeerate: 0,
      avgtxsize: 0,
      blockhash: "000000001dd410c49a788668ce26751718cc797474d3152a5fc073dd44fd9f7b",
      feerate_percentiles: [0, 0, 0, 0, 0],
      height: 0,
      ins: 0,
      maxfee: 0,
      maxfeerate: 0,
      maxtxsize: 0,
      medianfee: 0,
      mediantime: 1296688602,
      mediantxsize: 0,
      minfee: 0,
      minfeerate: 0,
      mintxsize: 0,
      outs: 1,
      subsidy: 50,
      time: 1296688602,
      total_out: 0,
      total_size: 0,
      totalfee: 0,
      txs: 1,
      utxo_increase: 1,
      utxo_size_inc: 117,
    },
    scale: {
      avgfee: 0,
      avgfeerate: 0,
      avgtxsize: 0,
      blockhash: "00000000e6453dc2dfe1ffa19023f86002eb11dbb8e87d0291a4599f0430be52",
      feerate_percentiles: [0, 0, 0, 0, 0],
      height: 0,
      ins: 0,
      maxfee: 0,
      maxfeerate: 0,
      maxtxsize: 0,
      medianfee: 0,
      mediantime: 1296688602,
      mediantxsize: 0,
      minfee: 0,
      minfeerate: 0,
      mintxsize: 0,
      outs: 1,
      subsidy: 50,
      time: 1296688602,
      total_out: 0,
      total_size: 0,
      totalfee: 0,
      txs: 1,
      utxo_increase: 1,
      utxo_size_inc: 117,
    },
  },
  genesisCoinbaseOutputAddressScripthash: "8b01df4e368ea28f8dc0423bcf7a4923e3a12d307c875e47a0cfbf90b5c39161", // Update if needed for new address
  historicalData: [
    {
      type: "blockheight",
      date: "2025-03-31",
      chain: "main",
      blockHeight: 0,
      blockHash: "00000484c46425cb3b260b4ecc3c33f032bf8bc8396eca605309696e4c361516",
      summary: "The TRRXITTE Bitcoin Genesis Block.",
      alertBodyHtml: "This is the first block in the TRRXITTE Bitcoin blockchain, known as the 'Genesis Block'.",
      referenceUrl: "https://en.bitcoin.it/wiki/Genesis_block",
    },
    {
      type: "tx",
      date: "2025-03-31",
      chain: "main",
      txid: "3b91683bea9b73100e013a7a1af2c9c824f79157d81bf9f63cb25fc41f4d29fe",
      summary: "The coinbase transaction of the Genesis Block.",
      alertBodyHtml: "This is the coinbase transaction of the <a href='/block/00000484c46425cb3b260b4ecc3c33f032bf8bc8396eca605309696e4c361516'>TRRXITTE Bitcoin Genesis Block</a>.",
      referenceUrl: "https://github.com/bitcoin/bitcoin/issues/3303",
    },
    // Other historical data entries (e.g., test, regtest, chip) remain unchanged
    {
      type: "blockheight",
      date: "2011-02-02",
      chain: "test",
      blockHeight: 0,
      blockHash: "000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943",
      summary: "The Bitcoin (testnet) Genesis Block.",
      alertBodyHtml: "This is the first block in the Bitcoin testnet blockchain, known as the 'Genesis Block'. You can read more about <a href='https://en.bitcoin.it/wiki/Genesis_block'>the genesis block</a>.",
      referenceUrl: "https://en.bitcoin.it/wiki/Genesis_block",
    },
    {
      type: "tx",
      date: "2011-02-02",
      chain: "test",
      txid: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
      summary: "The coinbase transaction of the Genesis Block.",
      alertBodyHtml: "This transaction doesn't really exist! This is the coinbase transaction of the <a href='/block/000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943'>Bitcoin Testnet Genesis Block</a>.",
      referenceUrl: "https://github.com/bitcoin/bitcoin/issues/3303",
    },
    {
      type: "blockheight",
      date: "2011-02-02",
      chain: "regtest",
      blockHeight: 0,
      blockHash: "0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206",
      summary: "The Bitcoin (regtest) Genesis Block.",
      alertBodyHtml: "This is the first block in the Bitcoin regtest blockchain, known as the 'Genesis Block'. You can read more about <a href='https://en.bitcoin.it/wiki/Genesis_block'>the genesis block</a>.",
      referenceUrl: "https://en.bitcoin.it/wiki/Genesis_block",
    },
    {
      type: "tx",
      date: "2011-02-02",
      chain: "regtest",
      txid: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
      summary: "The coinbase transaction of the Genesis Block.",
      alertBodyHtml: "This transaction doesn't really exist! This is the coinbase transaction of the <a href='/block/0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206'>Bitcoin Regtest Genesis Block</a>.",
      referenceUrl: "https://github.com/bitcoin/bitcoin/issues/3303",
    },
    {
      type: "blockheight",
      date: "2022-11-15",
      chain: "chip",
      blockHeight: 121957,
      blockHash: "0000000056087dee73fb66178ca70da89dfd0be098b1a63cf6fe93934cd04c78",
      summary: "May 2023 Upgrade Chipnet Activation",
      alertBodyHtml: "The May 2023 Upgrade for Bitcoin Cash activated on chipnet shortly after 12 UTC, November 15, 2022. Chipnet activates upgrades 6 months early, giving developers months to build with new upgrades before they're active on the main network.",
      referenceUrl: "https://blog.bitjson.com/bitcoin-cash-upgrade-2023/",
    },
    {
      type: "tx",
      date: "2022-11-15",
      chain: "chip",
      txid: "856c7b8a7607b7302cbe21a03944ead936e4486bd1f3e030b7f1b53af0338f0f",
      summary: "An 87-byte transaction",
      alertBodyHtml: "Before the May 2023 Upgrade activated, transactions were required to be at least 100 bytes, wasting space in some contract applications. This is the first transaction smaller than 100 bytes mined on chipnet.",
      referenceUrl: "https://twitter.com/bitjson/status/1592576796205387776",
    },
    {
      type: "tx",
      date: "2022-11-15",
      chain: "chip",
      txid: "a0152b142c7acafbc2af757754797dfde62582db3ed0edd380a0e977cae0f777",
      summary: "CashTokens Demo: Double-Category Genesis",
      alertBodyHtml: "A two-category token genesis transaction: every output type, every token amount encoding length, one minting and one immutable non-fungible token (NFT).",
      referenceUrl: "https://twitter.com/bitjson/status/1592576797467893760",
    },
    {
      type: "tx",
      date: "2022-11-15",
      chain: "chip",
      txid: "b84debf788680257285e8a67e3a52592bc17089f1dce997c0f8255b4e9608c41",
      summary: "CashTokens Demo: NFT Minting",
      alertBodyHtml: "Genesis for a third category; merges all fungible tokens from the first CashTokens Demo transaction, placing the max amount in an NFT-locked covenant marked with 'reserved supply'.",
      referenceUrl: "https://twitter.com/bitjson/status/1592576798675546112",
    },
    {
      type: "tx",
      date: "2022-11-15",
      chain: "chip",
      txid: "670a0402bd50af7fee349511221e5b92eb90dcc4e1d3dce451e228fc1c6aa39a",
      summary: "First NFT Spend",
      alertBodyHtml: "The first spend of an NFT on chipnet. A minimal transaction moving an immutable NFT (capability: 'none') from one address to another.",
      referenceUrl: "https://twitter.com/bitjson/status/1592576800340574208",
    },
    {
      type: "tx",
      date: "2022-11-15",
      chain: "chip",
      txid: "142e5adef124019b4929e7656fc20b7a061987e6d340d47a3753cee17eb6049e",
      summary: "NFT-unlocked Covenant Spend",
      alertBodyHtml: "An NFT-locked covenant is unlocked using an NFT. The NFTs commitment is <code>0x68656c6c6f</code> (utf8: <code>hello</code>).",
      referenceUrl: "https://twitter.com/bitjson/status/1592576802118959104",
    },
  ],
  exchangeRateData: {
    jsonUrl: "https://api.kraken.com/0/public/Ticker?pair=TRRXITTEUSD,TRRXITTEEUR",
    responseBodySelectorFunction: function (responseBody) {
      var exchangedCurrencies = ["TRRXITTEUSD", "TRRXITTEEUR"];
      if (responseBody.result) {
        var exchangeRates = {};
        for (var i = 0; i < exchangedCurrencies.length; i++) {
          if (responseBody.result[exchangedCurrencies[i]]) {
            var key = exchangedCurrencies[i].replace("TRRXITTE", "");
            exchangeRates[key.toLowerCase()] = responseBody.result[exchangedCurrencies[i]]["c"][0];
          }
        }
        return exchangeRates;
      }
      return null;
    },
  },
  exchangeRateDataExtension: [
    {
      jsonUrl: "https://api.yadio.io/exrates",
      responseBodySelectorFunction: function (responseBody) {
        var exchangedCurrencies = ["ARS"];
        if (responseBody.base) {
          var exchangeRates = {};
          for (var i = 0; i < exchangedCurrencies.length; i++) {
            var key = exchangedCurrencies[i];
            if (responseBody["USD"]) {
              var applicableUnit = currencyUnits.filter((x) => x.name === key).length == 1 ? currencyUnits.find((x) => x.name === key) : undefined;
              if (applicableUnit) {
                exchangeRates[key.toLowerCase()] = parseFloat(responseBody["USD"][key]).toString();
              }
            }
          }
          return exchangeRates;
        }
        return null;
      },
    },
  ],
  blockRewardFunction: function (blockHeight, chain) {
    var eras = [new Decimal8(50)];
    for (var i = 1; i < 34; i++) {
      var previous = eras[i - 1];
      eras.push(new Decimal8(previous).dividedBy(2));
    }
    var halvingBlockInterval = chain == "regtest" ? 150 : 210000;
    var index = Math.floor(blockHeight / halvingBlockInterval);
    return eras[index];
  },
  rpcConcurrency: (process.env.BTCEXP_RPC_CONCURRENCY || 5), // Reduced from 10 to avoid timeouts
};