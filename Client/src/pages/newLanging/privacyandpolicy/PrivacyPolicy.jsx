import { Typography, Box, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

const intro = {
  content: "Our website address is: http://bestnewshub.com",
  description: "What personal data we collect and why we collect it",
};

const commentsection = {
  content1:
    "When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor’s IP address and browser user agent string to help spam detection.",
  content2:
    "An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: http://bestnewshub.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment.",
};

const mediasection = {
  content:
    "If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.",
};

const cookies = {
  content1:
    "If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.",
  content2:
    "If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.",
  content3:
    "When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select “Remember Me”, your login will persist for two weeks. If you log out of your account, the login cookies will be removed.",
  content4:
    "If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.",
};

const embeded = {
  content1:
    "Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.",
  content2:
    "These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.",
  content3: " Analytics.",
};

const sharedata = {
  content1:
    "If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.",
  content2:
    "For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.",
  content3: "What rights you have over your data",
  content4:
    "If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.",
  content5: "Where we send your data",
  content6:
    "Visitor comments may be checked through an automated spam detection service.",
  content7: "Your contact information",
  content8: "Additional information",
  content9: "How we protect your data",
  content10: "What data breach procedures we have in place",
  content11: "What third parties we receive data from",
  content12:
    "What automated decision making and/or profiling we do with user data",
  content13: "Industry regulatory disclosure requirements",
};

function PrivacyPolicy() {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "80%", margin: "auto", mt: "2em" }}>
      <Typography variant="h1" sx={{ color: "#7B3300", fontWeight: 600 }}>
        {" "}
        Privacy Policy{" "}
      </Typography>
      <Box sx={{ borderBottom: "1px solid #000000" }} />
      <Box sx={{ mt: "1em", maxWidth: "90%" }}>
        <Typography variant="h6">Privacy Policy</Typography>
        <Box sx={{ mt: "1em", mb: "1em" }}>
          <Typography variant="h6">Who we are</Typography>
          <Typography>{intro.content}</Typography>
          <Typography>{intro.description}</Typography>
        </Box>
        <Box sx={{ mt: "1em", mb: "1em" }}>
          <Typography variant="h6">Comments</Typography>
          <Typography sx={{ mb: "1em" }}>{commentsection.content1}</Typography>
          <Typography>{commentsection.content2}</Typography>
        </Box>
        <Box sx={{ mt: "1em", mb: "1em" }}>
          <Typography variant="h6">Media</Typography>
          <Typography>{mediasection.content}</Typography>
        </Box>
        <Box sx={{ mt: "1em", mb: "1em" }}>
          <Typography variant="h6" sx={{ mb: "1em" }}>
            Contact forms
          </Typography>
          <Typography variant="h6">Cookies</Typography>
          <Typography>{cookies.content1}</Typography>
          <Typography sx={{ mt: "1em", mb: "1em" }}>
            {cookies.content2}
          </Typography>
          <Typography sx={{ mb: "1em" }}>{cookies.content3}</Typography>
          <Typography sx={{ mb: "1em" }}>{cookies.content4}</Typography>
        </Box>
        <Box sx={{ mt: "1em", mb: "1em" }}>
          <Typography variant="h6" sx={{ mb: "1em" }}>
            Embedded content from other websites
          </Typography>
          <Typography sx={{ mb: "1em" }}>{embeded.content1}</Typography>
          <Typography>{embeded.content2}</Typography>
          <Typography>{embeded.content3}</Typography>
        </Box>
        <Box sx={{ mt: "1em", mb: "1em" }}>
          <Typography variant="h5" sx={{ mb: "1em", fontWeight: "bold" }}>
            Who we share your data with
          </Typography>
          <Typography variant="h6" sx={{ mb: "1em" }}>
            How long we retain your data
          </Typography>
          <Typography sx={{ mb: "1em" }}>{sharedata.content1}</Typography>
          <Typography>{sharedata.content2}</Typography>
          <Typography sx={{ mb: "1em" }}>{sharedata.content3}</Typography>
          <Typography sx={{ mb: "1em" }}>{sharedata.content4}</Typography>
          <Typography>{sharedata.content5}</Typography>
          <Typography sx={{ mb: "1em" }}>{sharedata.content6}</Typography>
          <Typography>{sharedata.content7}</Typography>
          <Typography>{sharedata.content8}</Typography>
          <Typography>{sharedata.content9}</Typography>
          <Typography sx={{ mb: "1em" }}>{sharedata.content10}</Typography>
          <Typography sx={{ mb: "1em" }}>{sharedata.content11}</Typography>
          <Typography>{sharedata.content12}</Typography>
          <Typography>{sharedata.content13}</Typography>
        </Box>
      </Box>
      {/* <Box sx={{mt:'2em', }}>
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={handleChange}
          sx={{
            '&.Mui-checked': {
              color: '#895129', 
            },
          }}
        />
      }
      label={
        <Typography sx={{ fontWeight: 'bold', color: '#000',fontSize:{xs:"12px"}, mt:{xs:'0.8em'} }}>
          Accepting every Privacy Policy and Cookies which is placed about statement.
        </Typography>
      }
    />
    </Box> */}
    </Box>
  );
}

export default PrivacyPolicy;
