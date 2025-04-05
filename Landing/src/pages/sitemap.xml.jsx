export const getServerSideProps = async ({ res }) => {
  const baseUrl = "https://bestnewshub.com";
  let posts = [];
  let categories = [];
  let pages = [];

  try {
    const postApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/landing/posts/getAll`;
    const categoryApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/landing/category/getAll/slugs`;
    const pagesApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/landing/pages/getAll/slugs`;
    // Fetch posts
    const postResponse = await fetch(postApiUrl);
    if (postResponse.ok) {
      const postData = await postResponse.json();
      posts = postData.data || [];
    }

    // Fetch categories
    const categoryResponse = await fetch(categoryApiUrl);
    if (categoryResponse.ok) {
      const categoryData = await categoryResponse.json();
      categories = categoryData.data || [];
    }
    // Fetch pages
    const pageResponse = await fetch(pagesApiUrl);
    if (pageResponse.ok) {
      const pageData = await pageResponse.json();

      pages = pageData.data || [];
    }
  } catch (error) {
    console.error("Error fetching data for sitemap:", error);
  }

  // Generate XML Sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>

       <url>
          <loc>${baseUrl}/404</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>

      ${posts
        .map(
          (post) => `
        <url>
          <loc>${baseUrl}/news/${post.permalink?.toLowerCase()}</loc>
          <lastmod>${post.updatedAt}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `
        )
        .join("")}

      ${categories
        .map(
          (category) => `
        <url>
          <loc>${baseUrl}/news/category/${category.slug?.toLowerCase()}</loc>
          <lastmod>${category.updatedAt}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `
        )
        .join("")}

      ${pages
        .map((page) => {
          let pagePath;
          if (page.permalink?.includes("contact")) {
            pagePath = "pages/contact";
          } else if (page.permalink?.includes("advertise")) {
            pagePath = "pages/advertise";
          } else {
            pagePath = `pages`;
          }
          return `
    <url>
      <loc>${baseUrl}/${pagePath}/${page.permalink?.toLowerCase()}</loc>
      <lastmod>${page.updatedAt}</lastmod>
      <changefreq>yearly</changefreq>
      <priority>0.6</priority>
    </url>
  `;
        })
        .join("")}
    </urlset>
  `;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null; // No need to render anything
}
