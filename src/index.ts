/* eslint-disable no-new */
import { graphqlUploadExpress } from "graphql-upload";
import "reflect-metadata";
import { MAX_FILE_SIZE } from "./constants";
import {
  ApolloServer,
  buildSchema,
  Channel,
  ChannelResolver,
  connectRedis,
  COOKIE_NAME,
  cors,
  createConnection, createServer,
  DirectMessage,
  DirectMessageResolver,
  express,
  isProduction,
  Member,
  MemberResolver,
  Message,
  MessageResolver,
  Redis,
  session,
  Team,
  TeamResolver,
  User,
  UserResolver
} from "./indexImports";
import { MyContext } from "./types/MyContext";

const PORT = process.env.PORT || 4000;

const main = async () => {
  const isTestMode = !!process.env.TEST_DB;
  await createConnection({
    type: "postgres",
    database: process.env.TEST_DB || "gignal",
    username: "postgres",
    password: "postgres",
    logging: !isTestMode,
    synchronize: !isTestMode,

    entities: [User, Message, Team, Channel, Member, DirectMessage],
  });

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  // app.set("trust proxy", 1);
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );


  app.use(
    "/graphql",
    graphqlUploadExpress({ maxFileSize: MAX_FILE_SIZE, maxFiles: 10 })
  );

  app.use('/files', express.static('files'))

  const sessionMiddleware = session({
    name: COOKIE_NAME,
    store: new RedisStore({
      client: redis as any,
      disableTouch: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 366 * 10, //10 years
      httpOnly: true,
      sameSite: "lax", //csrf
      secure: isProduction, // cookie only works in https
    },
    secret: "hello world",
    resave: false,
    saveUninitialized: false,
  });
  app.use(sessionMiddleware);

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      MessageResolver,
      TeamResolver,
      ChannelResolver,
      MemberResolver,
      DirectMessageResolver,
    ],
    validate: false,
  });

  const apolloServer = new ApolloServer({
    schema,

    context: ({ req, res, connection }: MyContext) => ({
      req,
      res,
      redis,
      connection,
    }),
    // uploads: { maxFileSize: 10000000, maxFiles: 10 },
    uploads: false,

    subscriptions: {
      path: "/subscriptions",
      onConnect: async (_, { upgradeReq }: any) =>
        new Promise((res) =>
          sessionMiddleware(upgradeReq, {} as any, () => {
            res({ req: upgradeReq });
          })
        ),
    },
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  const httpServer = createServer(app);

  apolloServer.installSubscriptionHandlers(httpServer);
  //a
  httpServer.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
    console.log(
      `Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
    );
  });
};
main().catch((err) => {
  console.log(err);
});
