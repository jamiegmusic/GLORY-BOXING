import { GraphQLClient } from 'graphql-request';

const GRAPHQL_URL = 'http://localhost:8000/graphql';

export const graphqlClient = new GraphQLClient(GRAPHQL_URL, {
  headers: {
    authorization: 'Bearer dev-token',
  },
});

// GraphQL Queries
export const GET_FIGHTERS = `
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

export const GET_MATCHES = `
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

// GraphQL Mutations
export const CREATE_FIGHTER = `
  mutation CreateFighter($name: String!, $weightClass: String!, $record: String!, $nationality: String, $age: Int) {
    createFighter(name: $name, weightClass: $weightClass, record: $record, nationality: $nationality, age: $age) {
      id
      name
      weightClass
      record
      nationality
      age
    }
  }
`;

export const SCHEDULE_MATCH = `
  mutation ScheduleMatch($fighterAId: Int!, $fighterBId: Int!, $venue: String!, $date: String!) {
    scheduleMatch(fighterAId: $fighterAId, fighterBId: $fighterBId, venue: $venue, date: $date) {
      id
      fighterA {
        id
        name
        weightClass
      }
      fighterB {
        id
        name
        weightClass
      }
      venue
      date
      result
    }
  }
`;

// TypeScript types for GraphQL responses
export interface Fighter {
  id: number;
  name: string;
  weightClass: string;
  record: string;
  nationality?: string;
  age?: number;
}

export interface Match {
  id: number;
  fighterA: Fighter;
  fighterB: Fighter;
  venue: string;
  date: string;
  result?: string;
}

export interface GetFightersResponse {
  getFighters: Fighter[];
}

export interface GetMatchesResponse {
  getMatches: Match[];
}

export interface CreateFighterResponse {
  createFighter: Fighter;
}

export interface ScheduleMatchResponse {
  scheduleMatch: Match;
} 