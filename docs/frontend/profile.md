# Profile Function Documentation

## Overview

This document shows the front end functions of the editting profile section in the homepage. This page aims at the reconfigurations of user profile in the homepage.

## Functions

### `createInterestsButtons()`

Create the interests buttons according to predefined interests lists;

- **Usage**:
    - Should be called after the document is loaded. This function will create the interests based on predefined interests lists and render them on the page.

### `addInterest()`

Select the interest button according to text input;

- **Usage**:
    - An onclick responding function after user have got some input for the datalist, this function will check the corresponding interest checkbox below.
    - Should be linked with the SELECT button.


### `updateCurrentInterests()`

Set the current interests buttons status with the server user status

- **Usage**:
    - Fetch the user profile information from the server and render them to the profile in the homepage.
    - Should be called after the document is loaded.

### `saveInformation(save)`

Send the information to server and remove the iframe

- **Parameters**:
    - save: whether or not save the iframe information

- **Usage**:
    - Save the profile update from the document and then update in the server side.
    - Close the iframe of profile after user saving.
    - Should be linked with the SAVE button.