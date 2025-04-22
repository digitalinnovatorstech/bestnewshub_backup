require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expressIp = require("express-ip");
const cors = require("cors");
const path = require("path");

const api = require("./routes/api");
const databases = require("./config/database/databases");

const app = express();
 
// Convert env string to array
const allowedOrigins = process.env.WHITELIST_DOMAINS
  ? process.env.WHITELIST_DOMAINS.split(",").map(origin => origin.trim())
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server / Postman / curl
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn("Blocked by CORS:", origin); // helpful log
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// IP middleware
app.use(expressIp().getIpInfoMiddleware);

// JSON and URL-encoded body parsers
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// Static file serving
const buildPath = path.join(__dirname, "../Client/build");
app.use(express.static(buildPath));
app.use("/assets", express.static(path.join(buildPath, "assets")));

// Serve specific static files
app.get("/ads.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ads.txt"));
});

app.get("/robots.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "robots.txt"));
});

// Serve favicon (redirect or static fallback)
const icon = async (req, res) => {
  try {
    const icon = await databases.generalSetting.findOne({
      where: { _user: 1 },
      attributes: ["favicon"],
    });

    if (icon?.favicon) {
      return res.redirect(icon.favicon);
    }

    const fallbackIcon = path.join(buildPath, "favicon.png");
    res.sendFile(fallbackIcon, (err) => {
      if (err) {
        console.error("Favicon error:", err);
        res.status(500).send("Internal Server Error");
      }
    });
  } catch (error) {
    console.error("Icon fetch error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Route for favicon
app.use("/api/favicon.ico", icon);

// API routes
app.use("/api/v1", api);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(403).json({ error: err.message });
});

// Serve index.html for frontend routes (except API)
app.get("/*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();

  res.sendFile(path.join(buildPath, "index.html"), (err) => {
    if (err) {
      res.status(500).send("Error loading frontend");
    }
  });
});

// Start the server
const init = async () => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
};

init();




// require("dotenv").config();

// const express = require("express");
// var bodyParser = require("body-parser");
// const expressIp = require("express-ip");

// const cors = require("cors");
// const api = require("./routes/api");
// const path = require("path");
// const databases = require("./config/database/databases");
// const app = express();

// let whitelist;
// try {
//   whitelist = JSON.parse(process.env.WHITELIST_DOMAINS);
// } catch (error) {
//   console.error("Error parsing WHITELIST_DOMAINS:", error);
//   process.exit(1);
// }

// var corsOptions = {
//   origin: function (origin, callback) {
//     if (process.env.NODE_ENV == "development") {
//       callback(null, true);
//     } else {
//       if (whitelist?.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Unauthorized Domain"));
//       }
//     }
//   },
// };
// // app.use(cors(corsOptions));
// app.use((err, req, res, next) => {
//   if (err) {
//     return res.status(403).json({ error: err.message });
//   }
//   next();
// });

// app.use(
//   cors({
//     origin: "https://bestnewshub.com" || "https://www.bestnewshub.com",
//     credentials: true,
//     methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
//     allowedHeaders: [
//       "Origin",
//       "X-Requested-With",
//       "Content-Type",
//       "Accept",
//       "Authorization",
//     ],
//     exposedHeaders: ["Content-Length", "Content-Range"],
//   })
// );
// const buildPath = path.join(__dirname, "../Client/build");

// app.get("/ads.txt", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "ads.txt"));
// });
// app.get("/robots.txt", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "robots.txt"));
// });
// app.use(express.static(buildPath));

// const icon = async (req, res) => {
//   try {
//     const icon = await databases.generalSetting.findOne({
//       where: { _user: 1 },
//       attributes: ["favicon"],
//     });
//     if (icon && icon.favicon) {
//       res.redirect(icon.favicon);
//     } else {
//       const faviconPath = path.join(buildPath, "favicon.png");
//       return res.sendFile(faviconPath, (err) => {
//         if (err) {
//           console.log(err);
//           res.status(500).send("Internal Server Error");
//         }
//       });
//     }
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// };

// // Static file serving
// app.use(express.static(buildPath));
// app.use("/assets", express.static(path.join(buildPath, "assets")));

// app.get("/*", (req, res, next) => {
//   if (req.path.startsWith("/api")) {
//     return next();
//   }
//   res.sendFile(path.join(buildPath, "index.html"), function (err) {
//     if (err) {
//       res.status(500).send(err);
//     }
//   });
// });

// app.use(expressIp().getIpInfoMiddleware);
// app.use(express.json({ limit: "50mb" }));
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// const init = async () => {
//   app.use("/api/favicon.ico", icon);
//   app.use("/api/v1", api);

//   app.listen(process.env.PORT, () => {
//     console.log(`app running on ${process.env.PORT}`);
//   });
// };
// init();



// CORS setup
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["*"],
//     credentials: false,
//   })
// );

// app.use(
//   cors({
//     origin: "http://localhost:3000", // or whatever your frontend runs on
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true, // only if frontend sends cookies or auth headers
//   })
// );