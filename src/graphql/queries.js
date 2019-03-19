// eslint-disable
// this is an auto generated file. This will be overwritten

export const getPerson = `query GetPerson($id: ID!) {
  getPerson(id: $id) {
    id
    name
    email
    DOB
    phone
  }
}
`;
export const listPersons = `query ListPersons(
  $filter: ModelPersonFilterInput
  $limit: Int
  $nextToken: String
) {
  listPersons(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      email
      DOB
      phone
    }
    nextToken
  }
}
`;
export const searchPersons = `query SearchPersons(
  $filter: SearchablePersonFilterInput
  $sort: SearchablePersonSortInput
  $limit: Int
  $nextToken: Int
) {
  searchPersons(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      email
      DOB
      phone
    }
    nextToken
  }
}
`;
