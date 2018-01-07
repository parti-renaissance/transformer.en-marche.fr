# On l'a dit, on le fait (en Anglais)

## development

### first-time setup
create an `.env` file and set the values appropriately

`$ cp .env.sample .env`

`yarn install`

### start development server

`$ yarn start`

## environment variables

Name | Description
--- | ---
`REACT_APP_ALGOLIA_APP_ID` | Provided by Algolia. Required to initialize client-side SDK.
`REACT_APP_ALGOLIA_API_KEY` | This is the **front end** api key. Provided by Algolia. Required to initialize client-side SDK.
`REACT_APP_ALGOLIA_PROFILE_INDEX` | The name of the Profile index you'll load into memory
`REACT_APP_ALGOLIA_THEME_INDEX` | The name of the Theme index you'll load into memory
`REACT_APP_ALGOLIA_MEASURE_INDEX` | The name of the Measure index you'll load into memory
`REACT_APP_API_HOST` | The domain of the API host that is serving the Votes api
`REACT_APP_REDIRECT_URI` | The domain passed to the auth server as the `redirect_uri` query param
`REACT_APP_REGISTER_URL` | The full domain, path, and query params passed to the auth server for registration requests 
`REACT_APP_LOGIN_URL` | The full domain, path, and query params for a login request. Uses the auth redirect flow.
`REACT_APP_IMAGE_URL` | The full domain and partial path for Theme images
`REACT_APP_MAILCHIMP_ACTION` | The URL posted to (via JSONP) via the subscribe widget in the Dashboard component 
`REACT_APP_ROOT_PATH` | If the app is running at a nested path, set it here with a leading slash so asset requests are properly directed

## building

`$ yarn build`
