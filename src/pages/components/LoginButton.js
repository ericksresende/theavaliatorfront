import React from 'react'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const LoginB = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    width: '77%',
    padding: '10px 5px 10px',
    backgroundColor: '#2AA416',
    borderRadius: '0px',
    marginLeft: '55px',
    fontFamily: [
      'Segoe UI Light'
    ].join(','),
    '&:hover': {
      backgroundColor: '##2AA416# #15500b',
    },
    '&:active': {
      backgroundColor: ' #15500b',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgb(42, 164, 22)',
    },
  });

const LoginButton = (props) => {
  const {text, action} = props;
  
  return (
    <LoginB variant='contained' color='success' size='large' onClick={action}>
          {text}
    </LoginB>
  )
}

export default LoginButton