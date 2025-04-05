
import { Typography, Box, TextField, IconButton, InputAdornment } from "@mui/material";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { useState } from "react";
function AuthorProfilePage() {
    const [editing, setEditing] = useState({
        displayName: false,
        address: false,
      });
    
     
      const [formValues, setFormValues] = useState({
        firstname:"Joshua",
        lastname:"Kumar",
        displayName: 'Joshua',
        email:"josha@gmail.com",
        address: 'Telecom Nagar, 9-335/d... ',
        Password:"****",
        Qualification :'Graduate ',
        SelectedPreferences:'Innovation, News'
      });
    
     
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
          ...prevValues,
          [name]: value,
        }));
      };
    
     
      const handleEditClick = (field) => {
        setEditing((prevState) => ({
          ...prevState,
          [field]: !prevState[field],  
        }));
      };
    
      return (
        <Box sx={{ width: '100%', maxWidth: '80%', margin: 'auto', mt: '2em' }}>
          <Typography variant="h1" sx={{ color: "#7B3300", fontWeight: 600 }}>My Profile</Typography>
          <Box sx={{ borderBottom: "1px solid #000000",mb:"2em" }} />
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
            noValidate
            autoComplete="off"
          >
            <Box sx={{ display: { lg: 'flex' }, gap: { lg: 2 } }}>
              
              <TextField
                fullWidth
                label="First Name"
                variant="standard"
                name="firstname"
                value={formValues.firstname}
                InputProps={{
                  sx: {
                    fontSize: '20px',
                    fontWeight: 600,
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontWeight: 600,
                    color: '#000000',
                    '&.Mui-focused': {
                      color: '#000000',
                    },
                  },
                }}
                sx={{
                  mb:{xs:"1.5em"},
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#777777',
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#777777',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#777777',
                  },
                }}
              />
             
              <TextField
                fullWidth
                label="Last Name"
                variant="standard"
                name="lastname"
                value={formValues.lastname}
                InputProps={{
                  sx: {
                    fontSize: '20px',
                    fontWeight: 600, 
                  },
                }}
                InputLabelProps={{
                  sx: {
                    
                    fontWeight: 600,
                    color: '#000000',
                    '&.Mui-focused': {
                      color: '#000000',
                    },
                  },
                }}
                sx={{
                  
                  fontWeight: 'bold',
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#777777',
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#777777',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#777777',
                  },
                }}
              />
            
            </Box>
            <Box sx={{ display: { lg: 'flex' }, gap: { lg: 2 },}}>
              <TextField
                fullWidth
                label="Display Name"
                variant="standard"
                name="displayName"
                value={formValues.displayName}
                
                onChange={handleChange}
                InputLabelProps={{
                  sx: {
                    fontWeight: 600,
                    color: '#000000',
                    '&.Mui-focused': {
                      color: '#000000',
                    },
                  },
                }}
                InputProps={{
                  sx: {
                    fontSize: '20px',
                    fontWeight: 600,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleEditClick('displayName')}>
                        <DriveFileRenameOutlineIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb:{xs:"1.5em"},
                  '& .MuiInput-underline:before': {
                    borderBottomColor: editing.displayName ? '#777777' : '#777777',  
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: editing.displayName ? '#777777' : '#777777', 
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: editing.displayName ? '#777777' : '#777777', 
                  },
                  backgroundColor: editing.displayName ? '#ffffff' : 'transparent', 
                }}
              />
              <TextField
                fullWidth
                label="Email"
                variant="standard"
                name="email"
                value={formValues.email}
                InputProps={{
                  sx: {
                    fontSize: '20px',
                    fontWeight: 600,
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontWeight: 600,
                    color: '#000000',
                    '&.Mui-focused': {
                      color: '#000000',
                    },
                  },
                }}
                sx={{
                 
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#777777',
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#777777',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#777777',
                  },
                }}
              />
            </Box>
            <Box sx={{ display: { lg: 'flex' }, gap: { lg: 2 },}}>
            <TextField
                fullWidth
                label="Password"
                variant="standard"
                name="Password"
                value={formValues.Password}
                InputProps={{
                  sx: {
                    fontSize: '20px',
                    fontWeight: 600, 
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontWeight: 600,
                    color: '#000000',
                    '&.Mui-focused': {
                      color: '#000000',
                    },
                  },
                }}
                sx={{
                  mb:{xs:"1.5em"},
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#777777',
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#777777',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#777777',
                  },
                }}
              />
            <TextField
              fullWidth
              label="Address"
              variant="standard"
              name="address"
              value={formValues.address}
              onChange={handleChange}
              InputLabelProps={{
                sx: {
                  fontWeight: 600,
                  color: '#000000',
                  '&.Mui-focused': {
                    color: '#000000',
                  },
                },
              }}
              InputProps={{
                  sx: {
                    fontSize: '20px',
                    fontWeight: 600, 
                  },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleEditClick('address')}>
                      <DriveFileRenameOutlineIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
               
                '& .MuiInput-underline:before': {
                  borderBottomColor: editing.address ? '#777777' : '#777777',
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: editing.address ? '#777777' : '#777777', 
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: editing.address ? '#777777' : '#777777', 
                },
                backgroundColor: editing.address ? '#ffffff': 'transparent', 
              }}
            />
            </Box>
            <Box sx={{ display: { lg: 'flex' }, gap: { lg: 2 },}}>
            <TextField
              fullWidth
              label="Qualification "
              variant="standard"
              name="address"
              value={formValues.Qualification}
              onChange={handleChange}
              InputLabelProps={{
                sx: {
                  fontWeight: 600,
                  color: '#000000',
                  '&.Mui-focused': {
                    color: '#000000',
                  },
                },
              }}
              InputProps={{
                  sx: {
                    fontSize: '20px',
                    fontWeight: 600, 
                  },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleEditClick('address')}>
                      <DriveFileRenameOutlineIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb:{xs:"1.5em"},
                '& .MuiInput-underline:before': {
                  borderBottomColor: editing.address ? '#777777' : '#777777',
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: editing.address ? '#777777' : '#777777', 
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: editing.address ? '#777777' : '#777777', 
                },
                backgroundColor: editing.address ? '#ffffff': 'transparent', 
              }}
            />
            <TextField
              fullWidth
              label="Selected Preferences"
              variant="standard"
              name="address"
              value={formValues.SelectedPreferences}
              onChange={handleChange}
              InputLabelProps={{
                sx: {
                  fontWeight: 600,
                  color: '#000000',
                  '&.Mui-focused': {
                    color: '#000000',
                  },
                },
              }}
              InputProps={{
                  sx: {
                    fontSize: '20px',
                    fontWeight: 600, 
                  },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleEditClick('address')}>
                      <DriveFileRenameOutlineIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
              
                '& .MuiInput-underline:before': {
                  borderBottomColor: editing.address ? '#777777' : '#777777',
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: editing.address ? '#777777' : '#777777', 
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: editing.address ? '#777777' : '#777777', 
                },
                backgroundColor: editing.address ? '#ffffff': 'transparent', 
              }}
            />
            </Box>
          </Box>
        </Box>
      );
    }

export default AuthorProfilePage