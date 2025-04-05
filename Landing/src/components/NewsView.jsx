import { Box, Typography } from "@mui/material";

export default function NewsView({ category, id, slug }) {
  // Check if category and id are provided (query params route)
  if (category && id) {
    return (
      <Box>
        <Typography variant="h4">News Category: {category}</Typography>
        <Typography variant="h6">News ID: {id}</Typography>
        {/* Here you can add logic to fetch data based on the category and id */}
      </Box>
    );
  }

  // Check if slug is provided (dynamic route)
  if (slug) {
    return (
      <Box>
        <Typography variant="h4">News Article: {slug.join(" / ")}</Typography>
        {/* Here you can add logic to fetch article data based on the slug */}
      </Box>
    );
  }

  // Default case if neither query nor slug is found
  return (
    <Box>
      <Typography variant="h6">No news found</Typography>
    </Box>
  );
}
