import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material';
import { useState } from 'react';

export default function BasicInput(props) {
  const {text, type, captureUsername} = props;
  const [value, setValue] = useState("");

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { ml: '55px', mb: '15px', width: '77%', backgroundColor: 'white' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="filled-basic" label={text} variant="filled" type={type} onChange={(e) => {
          setValue(e.target.value);
          captureUsername(e.target.value);
        }}/>
    </Box>
  );
}