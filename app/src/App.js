import React, { Component } from 'react';
import './App.scss';

import TopNav from './components/topnav';
import LivePricing from './api/live-pricing';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TopNav/>
        // TODO header
        // TODO placeholder controls
        // TODO results component
      </div>
    );
  }
}

// example API client use
// TODO put this call somewhere sensible

// Api params and location values are here:
// http://business.skyscanner.net/portal/en-GB/Documentation/FlightsLivePricingQuickStart

LivePricing.search({
  // TODO params here
})
.then((results) => {
  console.log('TODO: something with these results:');
  console.log(results);
})
.catch(console.error);

export default App;
