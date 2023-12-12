# Recommendation Functions Documentation

## Overview

This documentation elaborates on the JavaScript functions deployed in the application. The primary focus of these functions is to manage API requests and to render content dynamically based on the data retrieved.

## Functions

### `showLoadingGif(containerId)`

This function is responsible for displaying a loading GIF within a specified HTML container element. It is typically called before initiating an API request to give users visual feedback that data is being loaded.

- **Parameters**: 
  - `containerId` (String): The ID of the HTML container where the loading GIF is to be displayed.

- **Usage**: 
  - Invoke this function before API requests to signal the start of a data fetch operation.

### `hideLoadingGif(containerId)`

Complementary to `showLoadingGif`, this function removes the loading GIF from the specified container, signifying that the loading process has completed.

- **Parameters**: 
  - `containerId` (String): The ID of the HTML container from which the loading GIF should be removed.

- **Usage**: 
  - Call this function after an API request is completed to indicate that the content is now loaded.

### `fetchFollowerRecommendations(interests)`

Retrieves a list of follower recommendations based on an array of user interests, and then updates the UI accordingly.

- **Parameters**: 
  - `interests` (Array): An array of strings representing user interests.

- **Usage**: 
  - Utilize this function to request follower recommendations from the backend and render them in the `accountContainer`.

### `fetchPostRecommendations(interests)`

Obtains post recommendations by sending the user's interests to the backend, which returns relevant content.

- **Parameters**: 
  - `interests` (Array): An array of strings representing user interests.

- **Usage**: 
  - Employ this function to fetch post recommendations and display them within the `postContainer`.

### `fetchPeopleRecommended(userMastodonURL)`

Fetches a list of recommended people by making an API call using the user's Mastodon URL.

- **Parameters**: 
  - `userMastodonURL` (String): A string containing the user's Mastodon URL.

- **Usage**: 
  - Use this function to obtain recommendations on people and populate the `recommendationContainer` with the results.

### `fetchUserData()`

Gathers comprehensive user data, including interests and account details. It then triggers other fetching functions to retrieve tailored content based on the user's preferences and profile.

- **Usage**: 
  - Call this function to initiate the process of fetching and displaying user-specific data and recommendations upon page load.

### Event Listener on `DOMContentLoaded`

An event listener attached to the DOM which activates once the HTML document has been completely loaded and parsed. It includes logout functionality and initiates the data fetching process.

- **Functionality**: 
  - Adds click event handling to the `logOutButton`, enabling user logout.
  - Calls `fetchUserData` to begin fetching user-specific information and recommendations.

## Integration and Imports

The functions are supported by various render utilities and key imports:

```javascript
import { renderPeopleRecommendation } from "./card.js";
import { renderRecommendationPost } from "./post.js";
import { renderFollowerRecommendation } from "./account.js";
import { flaskApikey, nodeApikey } from "../api/api.js";
