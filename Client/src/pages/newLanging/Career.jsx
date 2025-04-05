import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import { memo } from "react";

const Career = () => {
  const jobListings = [
    {
      title: "Product Designer",
      description:
        "We're looking for mid-level product designer to join our team",
      tags: ["Full Time", "Work from Office"],
    },
    {
      title: "Floor Manager",
      description: "We're looking for Floor Manager to join our team",
      tags: ["Full Time", "Work from Office"],
    },
  ];
  const heading={
    title: "Be Part of our mission",
  }

  return (
    <Box sx={{ padding: "20px", fontFamily: "Roboto" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#7B3300" }}>
        Career
      </Typography>
      <Box
        sx={{
          marginY: "10px",
          width: "100%",
          height: "2px",
          backgroundColor: "#000000",
        }}
      />
      <Chip
        label="We’re hiring"
        sx={{
          marginTop: "10px",
          marginBottom: "20px",
          backgroundColor: "#FFFFFF",
          color: "#895129",
          fontWeight: "bold",
          border: "2px solid #895129",
        }}
      />
      <Typography
        variant="h5"
        sx={{ marginBottom: "20px", fontWeight: "bold" }}
      >
       {heading.title}
      </Typography>
      <Divider sx={{ marginBottom: "10px", mt: {lg:"1em",xs:'1em',sm:0} }} />
      {jobListings.map((job, index) => (
        <Card key={index} sx={{ marginBottom: "20px" ,boxShadow:"none"}}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {job.title}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: "10px" }}>
                  {job.description}
                </Typography>
                <Box sx={{ display: "flex", gap: "10px" }}>
                  {job.tags.map((tag, i) => (
                    <Chip
                      key={i}
                      label={tag}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 0,
                        border: "1px solid #000000",
                      }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#904C23",
                    color: "white",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#703A19" },
                  }}
                >
                  Apply
                </Button>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ marginBottom: "10px", mt: {lg:"1em",xs:'1em',sm:0} }} />
        </Card>
        
      ))}
    </Box>
  );
};

export default memo(Career);
