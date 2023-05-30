
require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
var io = require("socket.io")(server);
require("./utils/socketService.js")(io);
const flash = require("express-flash");
const cluster = require("cluster");
const logger = require("./utils/logger.js");
const { iniciarServidorMongo, InitialiceServer } = require("./utils/dbConect.js");
const yargs = require("yargs/yargs")(process.argv.slice(2));
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const userModel = require("./models/userModel.js");
const userHandler = require("./DAO/userMongo.js");
const user = new userHandler(userModel);
const { engine } = require("express-handlebars");
app.engine("hbs", engine({ defaultLayout: false }));
app.set("view engine", "hbs");
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGOURL,
      mongoOptions: advancedOptions,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(process.env.COOKIE_EXPIRATION_TIME),
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const initializePassport = require("./config/passport.js");
initializePassport(
  passport,
  (email) => user.getByMail(email),
  (id) => user.getById(id)
);


const iniciarServidor = async () => {
  InitialiceServer();
  const servidor = server.listen(PORT, () => {
    logger.info(
      `Servidor Express iniciado en modo ${mode} escuchando en el puerto ${
        server.address().port
      } - Proceso N°: ${process.pid} - tipo de ejecución: ${run} `
    );
  });
  servidor.on("error", (error) => logger.error(`Error en servidor ${error}`));
};

const { PORT, mode, run } = yargs
  .alias({
    p: "PORT",
    m: "mode",
    r: "run",
  })
  .default({
    PORT: process.env.PORT || 8080,
    mode: process.env.mode || "FORK",
    run: process.env.run || "prod",
  }).argv;
module.exports = { run };

if (mode == "CLUSTER") {
  if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    logger.info(`Proceso Maestro: ${process.pid}`);
    cluster.on("exit", (worker, code, signal) => {
      logger.info(`el worker ${worker.process.pid} se ha cerrado`);
    });
  } else {
    iniciarServidor();
  }
} else {
  iniciarServidor();
}

const usersRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const mainRoutes = require("./routes/mainRoutes.js");
const main = require("./controllers/main.js");
const ordersRoutes = require("./routes/orderRoutes.js");

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/orders", ordersRoutes);
//app.use("/api/chat", chatRoutes);
app.use("/", mainRoutes);


app.get("*", main.notFound);
