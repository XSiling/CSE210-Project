# Recommedation Functions Documentation

## Overview

This document provides details on the JavaScript functions used in the application, primarily for handling API requests and rendering content based on fetched data.

## Functions

### `showLoadingGif(containerId)`
Shows a loading GIF in a specified container.
- **Parameters**: 
  - `containerId` (String): The ID of the container where the loading GIF should be displayed.
- **Usage**: Called before initiating an API request to indicate loading state.

### `hideLoadingGif(containerId)`
Hides the loading GIF in a specified container.
- **Parameters**: 
  - `containerId` (String): The ID of the container from which the loading GIF should be removed.
- **Usage**: Called after the completion of an API request to remove the loading state indicator.

### `fetchFollowerRecommendations(interests)`
Fetches follower recommendations based on interests.
- **Parameters**: 
  - `interests` (Array): A list of user interests.
- **Usage**: Makes an API request to get recommended followers and updates the `accountContainer` with the fetched data.

### `fetchPostRecommendations(interests)`
Fetches post recommendations based on interests.
- **Parameters**: 
  - `interests` (Array): A list of user interests.
- **Usage**: Makes an API request to get recommended posts and updates the `postContainer` with the fetched data.

### `fetchPeopleRecommended(userMastodonURL)`
Fetches people recommendations.
- **Parameters**: 
  - `userMastodonURL` (String): The Mastodon URL of the user.
- **Usage**: Makes an API request to get people recommendations based on the user's Mastodon URL and updates the `recommendationContainer`.

### `fetchUserData()`
Fetches user data including interests and account information.
- **Usage**: Called to fetch user data and then calls `fetchFollowerRecommendations`, `fetchPostRecommendations`, and `fetchPeopleRecommended` based on the fetched data.

### Event Listener on `DOMContentLoaded`
- **Functionality**: Adds an event listener to `logOutButton` for logout functionality and calls `fetchUserData` to initiate data fetching on page load.

## TODO
1. Merge `fetchFollower` and `fetchPost` into one promise.
2. Add a back-to-top button functionality.
