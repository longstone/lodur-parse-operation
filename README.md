[![Build Status](https://app.travis-ci.com/longstone/lodur-parse-operation.svg?branch=dev)](https://app.travis-ci.com/github/longstone/lodur-parse-operation)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=longstone/lodur-parse-operation)](https://dependabot.com)

# lodur-parse-operation
nodejs app which parses the lodur entries and make it available as json

Following env vars are required

* `telegram_hash` // telegram bot api hash
* `MONGOURI` // uri to persistence

## dev

* npm ci
* npm run-script build-dev-watch
* npm run-script start-dev

### update

* npm run-script upgrade
