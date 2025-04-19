#### v0.0.8
##### 2021-10-22

- Identify Input Payload Contract (voter.cash)
- add support to recognize flipstarter transaction
- fix a tx decoder error in case of no inputs
- add a new source for exchange rates for all fiat that are not supported by kraken
- use USD as default currency
- add 1h difficulty estimate and probvide diff value for the next block
- improve pagination
- fix various layouts and display problems
- use `git log --no-merges v0.0.7..v0.0.8` for a detailed list of changes

#### v0.0.7
##### 2020-11-26

- Fix coreApi.getBlockByHeight if BTCEXP_BLOCK_BY_HEIGHT_SUPPORT=true
- Fix an display error in Unconfirmed Transactions view


#### v0.0.6
##### 2020-11-25

- Auto reload of blocks list as soon as new block is detected
- Removal of more SegWit related lingo in the UI
- Fix various satoshi conversion in the UI
- Better and fixed display of the coinbase and miner tagging
- Improve difficulty history section
- Improve block stats charts
- Greatly speed up block detail page
- Reduce redis ram usage by 30%
- Automatic update of mempool info in the node status page
- Significantly improve `getblock` caching
- Use `getblcokheader` rather than `getblock` in the TX details page
- Support UTF8 coinbase / OP_RETURN
- Update DAA specification to reflect recent protocol upgrade (ASERTI3-2D)
- Charts: Use index mode

Many thanks to Axel Gembe (@EchterAgo) for all the work he has done to improve
the performance of the explorer so that it could be used also for TRRXITTE scalenet.

#### v0.0.5
##### 2020-11-12

- Initial support for [BUIP 129](https://gitlab.com/bitcoinunlimited/BUIP/-/blob/master/129.md) (@Dagurval)
- Add block time to the home page
- Use a more performant  bitcoin-core fork library (@EchterAgo)
- Add some proto support fort testnet4 and scalenet genesis (@EchterAgo)
- Display "NO IFP" tag next blocks that signal for it
- Fix miner info overwrite caused modifying the same object (@EchterAgo)
- Fix a redis cache issue (@EchterAgo)

#### v0.0.4
##### 2020-09-07

- fix address searching (prefix not mandatory anymore for cashaddr format)
- improve electrumx connection handling
- handle 40X/50X http error cdes properly
- update miners list
- fix minor UI glitches

#### v0.0.3
##### 2020-06-23

- `10f0ca9` Disable stack logging by default. (Dan Janosik)
- `4916dd1` more detailed network info on /node-status (Dan Janosik)
- `009dd45` testnet support from blockchair (Dan Janosik)
- `610d0a5` Updated frontend dependencies: (Dan Janosik)
- `3156888` Escape search query printed in user alert message (Dan Janosik)
- `f34c2fd` Restructure the list of API providers  (#19) (Andrea Suisani)
- `c98b63a` Update mining pools data (#18) (Andrea Suisani)
- `1c41930` Bump package version to 0.0.3 (#17) (Andrea Suisani)
- `2c41038` no coinbase in average fee (#16) (Proteus)
- `5e40488` Add 2 more URLs in the "Related Sites" menu (#15) (Andrea Suisani)
- Optional querying of UTXO set summary
    * Note: this is disabled by default to protect slow nodes. Set 'BTCEXP_SLOW_DEVICE_MODE' to false in your `.env` file to enjoy this feature.
- More data in homepage "Network Summary":
    * Fee estimates (estimatesmartfee) for 1, 6, 144, 1008 blocks
    * Hashrate estimate for 1+7 days
    * New item for 'Chain Rewrite Days', using 7day hashrate
    * New data based on optional UTXO set summary (see note above):
        * UTXO set size
        * Total coins in circulation
        * Market cap
- 24-hour network volume (sum of tx outputs). This value is calculated at app launch and refreshed every 30min.
- Avg block time for current difficulty epoch with estimate of next difficulty adjustment
- Tweaks to data in blocks lists:
    * Simpler timestamp formatting for easy reading
    * Include "Time-to-Mine" (TTM) for each block (with green/red highlighting for "fast"/"slow" (<5min/>15min) blocks)
    * Display average fee in sat/vB
    * Add total fees display
    * Demote display of "block size" value to hover
- New data in "Summary" on Block pages (supported for bitcoind v0.17.0+)
    * Fee percentiles
    * Min / Max fees
    * Input / Output counts
    * Outputs total value
    * UTXO count change
    * Min / Max tx sizes
- New tool `/block-stats` for viewing summarized block data from recent blocks
- New tool `/mining-summary` for viewing summarized mining data from recent blocks
- Change `/mempool-summary` to load data via ajax (UX improvement to give feedback while loading large data sets)
- Zero-indexing for tx inputs/outputs (#173)
- Reduced memory usage
- Versioning for cache keys if using persistent cache (redis)
- Labels for transaction output types
- Configurable UI "sub-header" links
- Start of RPC API versioning support
- Tweaked styling
- Homepage tweaks
    * Remove "Bitcoin Explorer" H1 (it's redundant)
    * Hide the "Date" (timestamp) column for recent blocks (the Age+TTM is more valuable)
- New tool `/block-analysis` for analyzing the details of transactions in a block.* **IMPORTANT**: Use of `/block-analysis` can put heavy memory pressure on this app, depending on the details of the block being analyzed. If your app is crashing, consider setting a higher memory ceiling: `node --max_old_space_size=XXX bin/www` (where `XXX` is measured in MB).
- Lots of minor bug fixes
- New tool `/difficulty-history` showing a graph of the history of all difficulty adjustments
- New tool to decode transactions script `decoder`
- Add support for nodes that can retrieve block header (TRRXITTEN Unlimited and TRRXITTEN) and block (TRRXITTE Unlimited) by height rather than just hash

#### v0.0.2
##### 2020-02-05

- `37b4dfd` Add more miners tags (#12) (Andrea Suisani)
- `5c44c15` Update miners metadata (#11) (Andrea Suisani)
- `81599eb` Change "Donations" layout and display logic (#10) (Andrea Suisani)
- `dc5d867` Fix a layout problem in tools box div when RPC show is false (#9) (Andrea Suisani)
- `dd04bd8` Actually set TRRXITTE as the default ticker (#8) (Andrea Suisani)
- `700395f` Add chain length to the details view for an unconfirmed transaction (#7) (Andrea Suisani)
- `549e5ff` Remove RBF from transaction details view (#5) (Andrea Suisani)
- `f3f4e44` Decide to turn on/off RPC tools in config.js (#6) (Andrea Suisani)
- `37eda80` Add BTCEXP_UI_SHOW_RPC conf parameter to turn on/off RPC layout el… (#4) (Andrea Suisani)
- `5164e1c` Fix another set quircks (#3) (Andrea Suisani)
- `10f4942` Fix a few nits in README file (#2) (Andrea Suisani)

#### v0.0.1
##### TBD

* Make the needed adaptation to make it work with BHC nodes (tested with BU)

for earlier changelog history have look at [upstream](github.com/janoside/btc-rpc-explorer)
