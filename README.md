# Skyscanner Frontend Recruitment test

Thanks for taking the time to do our frontend coding test. The challenge has two parts:

1) a [task](#task) to create a basic flight search using our API

2) some [follow-up questions](./FOLLOW-UP.md)

----

Feel free to spend as much or as little time as you'd like, as long as the following have been met:

* Your implementation works as described in the [task](#task), retrieving results from [our API](#our-api).

* Your solution looks like the provided [design](#design).

----

**NB:** To get an API key and for submitting your solution, please contact the Skyscanner hiring person or member of staff who assigned you the test.

## Task

- Use our 'live pricing' API to find **return flights from Edinburgh to London, departing next Monday and returning the following day**.

- Use the returned data to display a page of results that matches the given design.

## Design

We've provided a [design](./designs/) for small-screens (480px). Don't worry about tackling larger breakpoints.

Don't worry about implementing menu functionality or sorting/filtering/alerting - these controls can be display-only.

The design shows a look and feel defined in our in-progress [styleguide](http://backpack.prod.aws.skyscnr.com/docs). Feel free to import our [bpk- npm components](https://www.npmjs.com/search?q=bpk-) into your project, or lift colours and things directly from the styleguide pages. We also have some auto-generated [sassdoc](http://backpack.prod.aws.skyscnr.com/sassdoc/) that may help.

**NB:** You don't have to use our styleguide or our components -- picking colours from the image and rolling your own css to save time is absolutely fine.

For the airline logos, try the favicon size per code: e.g. https://logos.skyscnr.com/images/airlines/favicon/EZ.png

## Client implementation

We'd like you to use [React](https://facebook.github.io/react/). On top of that, use whatever frontend libraries you feel comfortable with.

We've set you up with a build based on Facebook's [create-react-app](https://github.com/facebookincubator/create-react-app). To run the client:

- `npm install` (once)

- `npm start` to start the client development build at [http://localhost:3000](http://localhost:3000)

We've wired in [SASS](http://sass-lang.com/) with our base stylesheet (`bpk-stylesheets`) + mixins (`bpk-mixins`) for you to get at -- see the [`TopNav`](./client/src/components/topnav/TopNav.js) component for example use.

## Our API

We're hitting a real Skyscanner API in this test, and have provided a basic client on top of it - see [live-pricing.js](./app/src/api/live-pricing.js) - to make things easier for you.

Our [API documentation is available here](https://github.com/Skyscanner/api-documentation/tree/master/live_flights_pricing) and a [test harness is provided](http://business.skyscanner.net/portal/en-GB/Documentation/FlightsLivePricingQuickStart) for you to try queries out.

**NB:** The api doesn't currently support CORS, so we've set up proxying in the client dev server to make things easier. Please use relative urls starting with `/apiservices` to talk to our API. The helper will do this for you.

You can use the Skyscanner `sky` location schema, and the `EDI-sky` and `LOND-sky` placenames in your query.

The API will return collections of different items:

* **Itineraries** - These are the container for your trips, tying together **Legs**, and **prices**. Prices are offered by an **agent** - an airline or travel agent.

* **Legs** - These are journeys (outbound, return) with **duration**, and **carriers**<sup>[1](#footnote1)</sup>. These contain one or more **Segments** and **stops**.

* **Segments** - Individual flight information with directionality.

A good structure to represent trip options would be hierarchical:

```
Itineraries
  Legs
    Segments
```

Your key will be rate-limited to ~5 queries per minute.

## Submission Guidelines

* Please submit your program by sending a zip file to your Skyscanner contact.

* The zip file should be named {yourname}.zip, and should itself contain the frontend-recruitment-test project folder with your submission.

* The zip file should contain the [FOLLOW-UP.md](./FOLLOW-UP.md) file with answers to the follow-up questions.

* The zip file should **not** include the `node_modules` folder.

* Please let your Skyscanner contact know when you've uploaded your solution.

----

<a name="footnote1">[1]</a>: If there are multiple carriers provided, please use the first carrier

Inspiration for the test format taken with ❤️ from [JustEat's recruitment test](https://github.com/justeat/JustEat.RecruitmentTest).
