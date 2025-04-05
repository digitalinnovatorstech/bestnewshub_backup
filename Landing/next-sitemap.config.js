// module.exports = {
//   siteUrl: "https://bestnewshub.com",
//   generateRobotsTxt: true,
// };

// module.exports = {
//   siteUrl: "https://bestnewshub.com", // Your website URL
//   generateRobotsTxt: true, // Generate robots.txt
//   sitemapSize: 5000, // Adjust the number of URLs per sitemap file
//   exclude: ["/admin", "/dashboard"], // Exclude admin or private pages if any
//   changefreq: "daily",
//   priority: 0.7,
// };

module.exports = {
  siteUrl: "https://bestnewshub.com",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ["/admin", "/dashboard"],
  changefreq: "daily",
  priority: 0.7,
  additionalPaths: async (config) => [
    { loc: "/News", changefreq: "daily", priority: 0.7 },
  ],
};
