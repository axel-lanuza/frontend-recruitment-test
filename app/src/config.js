// obtain API key from your Skyscanner contact
const APIKEY = '';

if (!APIKEY) {
  throw new Error('APIKEY config variable missing. ' +
    'Please obtain from your Skyscanner recruitment contact');
}

export default {
  apiKey: APIKEY,
  skyscannerApi: '/', // proxied for us by webpack dev-server; leave as-is
};
