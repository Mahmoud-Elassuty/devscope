# Devscope — GitHub Profile Finder

A responsive GitHub profile lookup page built with plain HTML, CSS, and JavaScript. It uses `XMLHttpRequest` to request public profile data from the GitHub REST API.

## Run it

1. Extract the folder.
2. Open `index.html` in your browser. For the smoothest local development experience, you can also use VS Code's Live Server extension.
3. Enter a GitHub username, or click one of the suggested usernames.

## What's included

- Avatar, display name, username, profile link, and account type
- Bio, company, location, website, and Twitter/X username when present in the API response
- Public repositories, followers, following, and public gists
- Account creation month and year
- Loading feedback, empty-input validation, missing-user handling, and API/network error states
- Responsive layout and keyboard-friendly search form

## Notes

Only public profile data returned by `https://api.github.com/users/{username}` is displayed. The unauthenticated GitHub API has rate limits, so a `403` or `429` response may mean you need to wait before searching again. No API token is stored in this front-end project.
