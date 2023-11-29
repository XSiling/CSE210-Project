# Interests

This document provides the fronted overview about interests page. Covering its structure and functions.

## Structure

In this page, we mainly provide a form including the interests selection and activitypub account link.

The website page looks like:

![page](./picture/interests.png)

In interests selection: 1. 35 checkboxes of different interests tags; 2. One input field for selecting one interest tag by typing.

In activitypub account link: an input field for linking with the activitypub account.



## Functions

We define some of the functions in components/interests.js.

Including:

- function addInterest()

Add interests by typing. The function will check whether the input matches with the existing interest tags.

- function createInterestsButtons()

Add the checkbox to the page according to predefined interests tags list. Currently they are hard-coded in the codes.
