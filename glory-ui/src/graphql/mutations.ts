import { gql } from '@apollo/client';

export const CREATE_FIGHTER = gql`
  mutation CreateFighter(
    $name: String!
    $weightClass: String!
    $record: String!
    $nationality: String
    $age: Int
  ) {
    createFighter(
      name: $name
      weightClass: $weightClass
      record: $record
      nationality: $nationality
      age: $age
    ) {
      id
      name
      weightClass
      record
      nationality
      age
    }
  }
`;

export const SCHEDULE_MATCH = gql`
  mutation ScheduleMatch(
    $fighterAId: Int!
    $fighterBId: Int!
    $venue: String!
    $date: String!
  ) {
    scheduleMatch(
      fighterAId: $fighterAId
      fighterBId: $fighterBId
      venue: $venue
      date: $date
    ) {
      id
      venue
      date
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
    }
  }
`;

export const UPDATE_MATCH_RESULT = gql`
  mutation UpdateMatchResult($matchId: Int!, $result: String!) {
    updateMatchResult(matchId: $matchId, result: $result) {
      id
      result
      fighterA {
        name
      }
      fighterB {
        name
      }
    }
  }
`;

export const CREATE_PRESS_CONFERENCE = gql`
  mutation CreatePressConference($matchId: Int!, $questions: [String!]!) {
    createPressConference(matchId: $matchId, questions: $questions) {
      id
      matchId
      questions
      transcript
    }
  }
`; 