/* eslint no-use-before-define:0 */
const _ = require('lodash');
const config = require('../config');
const querystring = require('query-string');

const pricingUrl = config.skyscannerApi + 'apiservices/pricing/v1.0';

const maxRetries = 3;
const maxPollTime = 15 * 1000;
const pollDelay = 1000;

/**
  Rough implementation of live pricing api client, as per
  http://business.skyscanner.net/portal/en-GB/Documentation/FlightsLivePricingList
*/
const livePricing = {
  api: {
    createSession: (params) => {
      return fetch(pricingUrl, {
        method: 'POST',
        body: sessionParams(params),
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    },
    pollSession: (creds) => {
      return fetch(pricingUrl + `/${creds.sessionKey}?apiKey=${creds.apiKey}`, {
        method: 'GET'
      })
    }
  }
};

function createSession (params) {
  console.log('[API] creating session...');

  return new Promise((resolve, reject) => {
    livePricing.api.createSession(params)
      .then((response) => {
         _.delay(() => {
          resolve({
            location: response.headers.get('location'),
            response: response.json()
          });
        }, pollDelay);

      })
      .catch(reject);
  });
}

function startPolling (session) {
  const location = session.location;
  const sessionKey = location.substring(location.lastIndexOf('/') + 1);

  console.log('[API] session created.');

  return new Promise((resolve, reject) => {
    // encapsulation of polling state to pass around
    const pollState = {
      creds: { apiKey: config.apiKey, sessionKey: sessionKey },
      onFinished: resolve,
      onError: reject,
      timedOut: false,
      tries: 0
    };

    pollState.success = _.partial(pollSuccess, pollState);
    pollState.error = _.partial(pollError, pollState);

    pollState.repoll = () => {
      _.delay(() => {
        poll(pollState);
      }, pollDelay);
    };

    // overall timeout - don't wait too long for complete results
    setTimeout(() => {
      pollState.timedOut = true;
    }, maxPollTime);

    poll(pollState);
  });
}

function poll (state) {
  // auto-repoll if nothing happens for a while
  const backupTimer = setTimeout(() => {
    state.repoll();
  }, pollDelay * 3);

  console.log('[API] polling...')

  livePricing.api.pollSession(state.creds)
    .then((response) => {
      clearTimeout(backupTimer);
      return response.json();
    })
    .then((data) => {
      state.success(data);
    })
    .catch(state.err);
}

function pollSuccess (state, data) {
  if (data.Status === 'UpdatesComplete' || state.timedOut) {
    console.log('[API] polling complete.');
    return state.onFinished(data);
  }
  state.repoll();
}

// Not implemented: error handling by response code
function pollError (state, err) {
  state.tries ++;
  if (!state.timedOut && state.tries < maxRetries) {
    return state.repoll();
  }
  state.onError(err);
}

const sessionParams = (query) => {
  return querystring.stringify({
    apiKey: config.apiKey,
    adults: query.adults,
    cabinclass: query.class,
    country: 'UK',
    currency: 'GBP',
    destinationplace: query.toPlace,
    inbounddate: query.toDate,
    locale: 'en-GB',
    locationschema: 'Sky',
    originplace: query.fromPlace,
    outbounddate: query.fromDate
  });
}

livePricing.search = (searchParams) => {
  return new Promise((resolve, reject) => {
    createSession(searchParams)
      .then(startPolling)
      .then(resolve)
      .catch(reject);
  });
};

module.exports = livePricing;
