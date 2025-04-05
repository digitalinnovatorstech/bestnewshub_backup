import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

const DynamicSEO = ({ metaInfo }) => {
  const router = useRouter();
  const url = `https://bestnewshub.com${router.asPath}`;
  const image =
    metaInfo?.SEOImageUrl || "https://admin.bestnewshub.com/logo.png";

  const datePublished = metaInfo?.publishedAt || metaInfo?.createdAt;
  return (
    <>
      <NextSeo
        title={
          metaInfo?.metaTitle ||
          "Best News Hub – The Ultimate News Portal for Global and Local Stories."
        }
        description={
          metaInfo?.metaDescription ||
          "Welcome to Best News Hub – The Ultimate News Portal for Global and Local Stories. Stay informed with our comprehensive coverage of breaking news, in-depth analysis, and engaging features from around the world."
        }
        canonical={url}
        openGraph={{
          type: "website",
          locale: "en_US",
          url: url,
          title:
            metaInfo?.metaTitle ||
            "Best News Hub – The Ultimate News Portal for Global and Local Stories.",
          description:
            metaInfo?.metaDescription ||
            "Welcome to Best News Hub – The Ultimate News Portal for Global and Local Stories. Stay informed with our comprehensive coverage of breaking news, in-depth analysis, and engaging features from around the world.",
          images: [
            {
              url: metaInfo?.SEOImageUrl || image,
              width: 1200,
              height: 630,
              alt: metaInfo?.metaTitle,
            },
          ],
          site_name: "Best News Hub",
          article: {
            publishedTime: datePublished,
          },
        }}
        twitter={{
          handle: "@yourhandle",
          site: "@site",
          cardType: "summary_large_image",
          title:
            metaInfo?.metaTitle ||
            "Best News Hub – The Ultimate News Portal for Global and Local Stories.",
          description:
            metaInfo?.metaDescription ||
            "Welcome to Best News Hub – The Ultimate News Portal for Global and Local Stories. Stay informed with our comprehensive coverage of breaking news, in-depth analysis, and engaging features from around the world.",
          image: metaInfo?.SEOImageUrl || image,
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content:
              metaInfo?.metaTags ||
              "Best News Hub - Breaking news headlines, Latest Breaking News - Best News Hub, Best News Hub | Get News headlines, latest Global news Updates, Best news website for Sports, Breaking News in Hyderabad, Latest Political News- Best News Hub, Latest Entertainment News, Latest Sports News, Latest Technology News, Best News Hub - Latest Business News update, Health- News & Updates, Latest Lifestyle News Updates, Best News Hub | Education News & Updates. Latest Headlines in Hyderabad",
          },
          {
            name: "article:published_time",
            content: datePublished,
          },
        ]}
      />
    </>
  );
};

export default DynamicSEO;
