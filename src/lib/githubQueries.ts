/*
  !GitHub API Queries

  INFO: This file contains GraphQL queries used to fetch data from the GitHub API.
  INFO: These queries are designed to be used with the `swr` (stale-while-revalidate) library.
  INFO: For efficient data fetching and caching in React applications.

*/

export const GITHUB_PROJECTS_QUERY = `
  query ($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: REPOSITORY) {
        edges {
          node {
            ... on Repository {
              name
              description
              stargazers {
                totalCount
              }
              forks {
                totalCount
              }
              url
              languages(first: 3, orderBy: {field: SIZE, direction: DESC}) {
                nodes {
                  name
                }
              }
            }
          }
        }
      }
      repositories(first: 100) {
        nodes {
          name
          description
          stargazers {
            totalCount
          }
          forks {
            totalCount
          }
          url
          languages(first: 3, orderBy: {field: SIZE, direction: DESC}) {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`;
