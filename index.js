const toxy = require('toxy')
const throng = require('throng');

const proxy = toxy()
const rules = proxy.rules
const poisons = proxy.poisons

// var WORKERS = process.env.WEB_CONCURRENCY || 1;
var PROXY_TO = process.env.PROXY_TO || "http://127.0.0.1:8080";

throng({ lifetime: Infinity }, (id) => {
    proxy
      .forward(PROXY_TO)
      .options({ forwardHost: true })
//      .rule(rules.probability(50))
//      .poison(poisons.slowOpen({ delay: 500 }))

    var route = proxy.get('/*')

//    route
//      .poison(poisons.latency({ jitter: 1000 }))

//    route
//      .poison(poisons.inject({ code: 502, body: 'Error!', headers: { 'X-Toxy-Poison': 'error' } }))
//      .withRule(rules.probability(5))

//    route
//      .poison(poisons.slowClose({ delay: 1000 }))
//      .withRule(rules.probability(5))
    //route
    //  .poison(poisons.rateLimit({ limit: 2, threshold: 5000 }))
    //  .withRule(rules.probability(20))

//    route
//      .poison(poisons.slowRead({ bps: 100 }))
//      .withRule(rules.probability(5))

    route
//      .poison(poisons.abort())
//      .poisonRule(rules.probability(5)) // does the same as withRule()
        .poisonRule(rules.method('GET'))

    proxy.listen(process.env.PORT || 3000)
    console.log(`BadProxy UP (process ${id})`)
});
