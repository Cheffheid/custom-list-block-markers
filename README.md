# Custom List Markers

This is an example of a feature I came up with for a recent client.
It makes use of core WordPress filters to add new fields to the List block,
and then uses the values of those fields to update the List block on the frontend.

![custom-list-block-markers](https://github.com/user-attachments/assets/5bc24c0d-017d-44fb-84f8-688c5af21c82)

## Changelog

### 1.0.0

First release. Includes:

- wp-scripts, eslint, and prettier packages and configuration.
- List Block customization scripts.
- CSS that changes the list marker style, sets a CSS variable for its colour.
- PHP to filter the core list block output on the frontend and set a new inline CSS variable with the selected color.
