# macron timeline (à anglais)

## development

### first-time setup
create an `.env` file and set the values appropriately

`$ cp .env.sample .env`

### start development server

`$ yarn start`

## environment variables

Name | Description
--- | ---
`REACT_APP_ALGOLIA_APP_ID` | Provided by Algolia. Required to initialize client-side SDK.
`REACT_APP_ALGOLIA_API_KEY` | This is the **front end** api key. Provided by Algolia. Required to initialize client-side SDK.
`REACT_APP_ALGOLIA_INDEX_NAME` | The source data that is displayed in the main content area. At this point it seems like the `Theme` indexes are the ones we want.

## building

`$ yarn build`
