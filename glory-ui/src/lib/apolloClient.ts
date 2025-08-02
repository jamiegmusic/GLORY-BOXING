import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// For now, we'll use a REST API link since GraphQL has compatibility issues
const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql', // We'll update this when GraphQL is working
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('supabase_token') || 'dev-token';
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
}); 