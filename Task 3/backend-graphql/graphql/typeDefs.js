
const typeDefs = `#graphql
    scalar Date

    type User {
        id: ID!
        name: String!
        email: String!
        role: String!
        posts: [Post!]
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        user: User!
        createdAt: Date
    }

    # The "Query" type lists all the ways clients can fetch data.
    type Query {
        posts: [Post!]
        post(id: ID!): Post
        me: User
    }

    
    type Mutation {
        register(name: String!, email: String!, password: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
        createPost(title: String!, content: String!): Post!
        deletePost(id: ID!): Post
    }

   
    type AuthPayload {
        token: String!
        user: User!
    }
`;

module.exports = typeDefs;