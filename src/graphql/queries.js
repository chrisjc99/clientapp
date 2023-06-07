/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getInfo = /* GraphQL */ `
  query GetInfo($id: ID!) {
    getInfo(id: $id) {
      id
      business
      email
      status
      url
      thumbnail
      subscription
      createdAt
      updatedAt
    }
  }
`;
export const listInfos = /* GraphQL */ `
  query ListInfos(
    $filter: ModelInfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInfos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        business
        email
        status
        url
        thumbnail
        subscription
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
