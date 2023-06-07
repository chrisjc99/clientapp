/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createInfo = /* GraphQL */ `
  mutation CreateInfo(
    $input: CreateInfoInput!
    $condition: ModelInfoConditionInput
  ) {
    createInfo(input: $input, condition: $condition) {
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
export const updateInfo = /* GraphQL */ `
  mutation UpdateInfo(
    $input: UpdateInfoInput!
    $condition: ModelInfoConditionInput
  ) {
    updateInfo(input: $input, condition: $condition) {
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
export const deleteInfo = /* GraphQL */ `
  mutation DeleteInfo(
    $input: DeleteInfoInput!
    $condition: ModelInfoConditionInput
  ) {
    deleteInfo(input: $input, condition: $condition) {
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
