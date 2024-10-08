/*
  !GitHub API Queries

  INFO: This file contains GraphQL queries used to fetch data from the GitHub API.
  INFO: These queries are designed to be used with the `swr` (stale-while-revalidate) library.
  INFO: For efficient data fetching and caching in React applications.

*/

export const GITHUB_PROJECTS_QUERY = `
  query($login: String!, $cursor: String) {
    user(login: $login) {
      pinnedItems(first: 6, types: REPOSITORY) {
        edges {
          node {
            ... on Repository {
              name
              description
              url
              homepageUrl
              stargazers {
                totalCount
              }
              forks {
                totalCount
              }
              languages(first: 3) {
                nodes {
                  name
                }
              }
              repositoryTopics(first: 3) {
                nodes {
                  topic {
                    name
                  }
                }
              }
              createdAt
              updatedAt
              licenseInfo {
                name
              }
              defaultBranchRef {
                name
              }
            }
          }
        }
      }
      repositories(first: 100, after: $cursor) {
        nodes {
          name
          description
          url
          homepageUrl
          stargazers {
            totalCount
          }
          forks {
            totalCount
          }
          languages(first: 3) {
            nodes {
              name
            }
          }
          repositoryTopics(first: 3) {
            nodes {
              topic {
                name
              }
            }
          }
          createdAt
          updatedAt
          licenseInfo {
            name
          }
          defaultBranchRef {
            name
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
