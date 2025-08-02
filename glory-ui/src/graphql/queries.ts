import { gql } from '@apollo/client';

export const GET_FIGHTERS = gql`
  query GetFighters {
    getFighters {
      id
      name
      weightClass
      record
      nationality
      age
    }
  }
`;

export const GET_MATCHES = gql`
  query GetMatches {
    getMatches {
      id
      fighterA {
        id
        name
        weightClass
        record
        nationality
        age
      }
      fighterB {
        id
        name
        weightClass
        record
        nationality
        age
      }
      venue
      date
      result
    }
  }
`;

export const GET_FIGHTER = gql`
  query GetFighter($id: Int!) {
    getFighter(fighterId: $id) {
      id
      name
      weightClass
      record
      nationality
      age
    }
  }
`;

export const GET_MATCH = gql`
  query GetMatch($id: Int!) {
    getMatch(matchId: $id) {
      id
      fighterA {
        id
        name
        weightClass
        record
      }
      fighterB {
        id
        name
        weightClass
        record
      }
      venue
      date
      result
    }
  }
`; 