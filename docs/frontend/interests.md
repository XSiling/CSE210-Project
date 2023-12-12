# Interest Function Documentation

## Overview

This documentation shows the front end functions of interests selection page. This page aims at the essential configurations of users including the user img, user interests as well as the user Mastodon account.

## Functions

### `addInterest()`

Select the interest button according to text input;

- **Usage**:
    - An onclick responding function after user have got some input for the datalist, this function will check the corresponding interest checkbox below.
    - Should be linked with the SELECT button.


### `fetchUsername()`

Fetch the user name from the url;

- **Usage**:
    - Should be called after the document is loaded.
    - Will get the essential property: username from the url.

### `expand()`

Expand the compressed section of interests buttons;

- **Usage**:
    - The current interests selection checkboxes are divided into two parts: above and below. The below one is compressed.
    - This function should be linked with the button EXPLORE_MORE to expand the compressed below part.

### `close()`

Close the compressed section of interests buttons;

- **Usage**:
    - The current interests selection checkboxes are divided into two parts: above and below. The below one can be expanded after expand().
    - This function should be linked with the button ELLAPSE to close the expanded below part.

### `expandLine(element)`

Expand or collapse a single line of interests.

- **Parameters**:
    - element: A button after each line of the interests checkboxes.

- **Usage**:
     - The each line of interests checkboxes are collapsed to reduce the overwhelming for users.
     - This function should be linked with the click of the triangle shaped button after each line. Which will expand or collapse each line of interests.

### `createInterestsButtons()`

Create the interests buttons according to predefined interests lists;

- **Usage**:
    - Should be called after the document is loaded. This function will create the interests based on predefined interests lists and render them on the page.


### `checkRadio(el)`

Check the current selected interests buttons number exceed 5 or not.


- **Parameters**:
    - el: The selected checkbox of interests.

- **Usage**:
    - Should be called each time an checkbox is checked or dischecked.
    - The current interests selection has a number limitation of 5, if the checkbox state change breaks the rule, the function will stop the furthur change and has an alert.


### `fetchUserData()`

Fetch the user data from server

- **Usage**:
    - Fetch the existing user img from the server. Should update the profile img.


### `loadStepInterests()`

configuration step 1 - let the users select interests by datalist or checkboxes.

- **Usage**:
    - The current configuration is divided into three steps: profile img selection, interests selection and mastodon account input.
    - This function will load the step 1: interests selection and render the contents.

### `loadStepProfileImg()`

configuration step 2 - let the users choose the profile img.

- **Usage**:
    - The current configuration is divided into three steps: profile img selection, interests selection and mastodon account input.
    - This function will load the step 2: profile img selection and render the contents.

### `loadStepMastodonAccount()`

configuration step 3 - let the users choose the mastodon account.

- **Usage**:
    - The current configuration is divided into three steps: profile img selection, interests selection and mastodon account input.
    - This function will load the step 3: mastodon account input and render the contents.