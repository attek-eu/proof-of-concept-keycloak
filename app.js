require('dotenv').config();
var express = require("express");
const Keycloak = require("keycloak-connect");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

var app = express();
app.set("view engine", "ejs");
app.use(cookieParser());

const keycloakPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqI9Sfk/jCDXnXWYQ6RSWCgxxyCThzUvqtEjakH3F9dAFoUE6262XAMu5DwqFt30RKhbxuseEB8X88VjPWNQ/vLSXC0feYuotbM5uWjRwLbI7oX48dPFoA6++8s/kB0llZWu/DZNFMndfLQ6tf1Kh+vpZlQe+VzUiR/Q+li0+Z2LDEblBbjSWXoBsPx/WKWQ2BMHthsoi8CPxO0FFkbLAN0F2ZvVWtbWmNyc67/V6V5m7KTZCj06GPKkeaSRY9gLhN/aDupBeuZtoPIddbmalvWy+jjGmC64d1Gsmc+BzzPok3FPSPTGN0F/myaUBYDBrzrO0PhqSWW91GmWI9OKjuwIDAQAB
-----END PUBLIC KEY-----`;

const validateToken = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.status(403).send("A token is required for authenticication");
  }

  try {
    const decoded = jwt.verify(token, keycloakPublicKey, {
      algorithms: ["RS256"],
    });
    console.log("Token is valid", decoded);
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};
let memoryStore = new session.MemoryStore();
let keycloak = new Keycloak({ store: memoryStore }, process.env.KEYCLOAK_CONFIG_PATH);

app.use(
  session({
    secret: "Secret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

app.use(keycloak.middleware());
app.use(
  "/views/img",
  express.static(process.env.STATIC_FILES_PATH)
);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/bye", keycloak.protect(), async function (req, res) {
  try {
    const grant = await keycloak.getGrant(req, res);
    const token = grant.access_token.token;
    console.log(`Found token: ${JSON.stringify(token)}`);
    req.session.token = token;

    const userProfile = await keycloak.grantManager.userInfo(token);
    console.log("Found user profile", userProfile);

    res.render("bye", { userProfile: userProfile });
  } catch (err) {
    console.error("Error fetching user profile or token", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/ressource", validateToken, (req, res) => {
  res.render("ressource");
});

app.listen((port = process.env.PORT), function () {
  console.log("server is running on port " + port);
});

app.use(
  keycloak.middleware({
    logout: "/logout",
    admin: "/",
    protected: "/protected/resource",
  })
);
