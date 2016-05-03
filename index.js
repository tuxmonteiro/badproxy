const toxy = require('toxy')

const proxy = toxy()
const rules = proxy.rules
const poisons = proxy.poisons

proxy
  .forward('http://static-qa2-teste-1.gcloud.qa02.globoi.com')
  .rule(rules.probability(10))
  .poison(poisons.slowOpen({ delay: 500 }))

var route = proxy.get('/*')

route
  .poison(poisons.latency({ jitter: 1000 }))

route
  .poison(poisons.inject({ code: 502, body: 'Error!', headers: { 'X-Toxy-Poison': 'error' } }))
  .withRule(rules.probability(10))

route
  .poison(poisons.slowClose({ delay: 1000 }))
  .withRule(rules.probability(10))

route
  .poison(poisons.rateLimit({ limit: 2, threshold: 5000 }))
  .withRule(rules.probability(10))

route
  .poison(poisons.slowRead({ bps: 100 }))
  .withRule(rules.probability(10))

route
  .poison(poisons.abort())
  .poisonRule(rules.probability(5)) // does the same as withRule()
  .poisonRule(rules.method('GET'))

proxy.listen(process.env.PORT || 3000)
console.log('BadProxy UP')
