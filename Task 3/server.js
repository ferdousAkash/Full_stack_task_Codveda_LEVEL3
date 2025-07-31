const express = require('express');
const http = require('http');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

dotenv.config();

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const startServer = async () => {
    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();
    
    // Connect to database after server starts
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const authHeader = req.headers.authorization || '';
                if (authHeader.startsWith('Bearer ')) {
                    const token = authHeader.substring(7, authHeader.length);
                    try {
                        const decoded = jwt.verify(token, process.env.JWT_SECRET);
                        // The user object will be available in every resolver's context
                        return { user: { id: decoded.id } };
                    } catch (err) {
                        // Token is invalid or expired
                        return {};
                    }
                }
                // No token provided
                return {};
            },
        })
    );

    const PORT = process.env.PORT || 4000;
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}/graphql`);
};

startServer();