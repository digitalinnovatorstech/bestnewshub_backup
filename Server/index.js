require("dotenv").config();

const express = require("express");
var bodyParser = require("body-parser");
const expressIp = require("express-ip");

const cors = require("cors");
const api = require("./routes/api");
const path = require("path");
const databases = require("./config/database/databases");
const app = express();

let whitelist;
try {
  whitelist = JSON.parse(process.env.WHITELIST_DOMAINS);
} catch (error) {
  console.error("Error parsing WHITELIST_DOMAINS:", error);
  process.exit(1);
}

var corsOptions = {
  origin: function (origin, callback) {
    if (process.env.NODE_ENV == "development") {
      callback(null, true);
    } else {
      if (whitelist?.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Unauthorized Domain"));
      }
    }
  },
};
// app.use(cors(corsOptions));
app.use((err, req, res, next) => {
  if (err) {
    return res.status(403).json({ error: err.message });
  }
  next();
});

app.use(
  cors({
    origin: "https://bestnewshub.com" || "https://www.bestnewshub.com",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    exposedHeaders: ["Content-Length", "Content-Range"],
  })
);
const buildPath = path.join(__dirname, "../Client/build");

app.get("/ads.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ads.txt"));
});
app.get("/robots.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "robots.txt"));
});
app.use(express.static(buildPath));

const icon = async (req, res) => {
  try {
    const icon = await databases.generalSetting.findOne({
      where: { _user: 1 },
      attributes: ["favicon"],
    });
    if (icon && icon.favicon) {
      res.redirect(icon.favicon);
    } else {
      const faviconPath = path.join(buildPath, "favicon.png");
      return res.sendFile(faviconPath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        }
      });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Static file serving
app.use(express.static(buildPath));
app.use("/assets", express.static(path.join(buildPath, "assets")));

app.get("/*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(buildPath, "index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.use(expressIp().getIpInfoMiddleware);
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

const init = async () => {
  app.use("/api/favicon.ico", icon);
  app.use("/api/v1", api);

  app.listen(process.env.PORT, () => {
    console.log(`app running on ${process.env.PORT}`);
  });
};
init();
