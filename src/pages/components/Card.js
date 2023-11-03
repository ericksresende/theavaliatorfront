import { Container, Paper, Typography, Box, Button, Card, CardContent, Grid, Divider, CardActions } from '@mui/material';
import { styled } from '@mui/material';
import { useState } from 'react';

export default function BasicCard(props) {
  const {text, value, exceedlimit} = props;

  return (
    <Card color="primary" style={{
        backgroundColor: "#243856",
        color: "white",
        height: "110px",
      }}>
        <CardContent style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "75%",
        }}>
          <Typography variant="body3" textTransform="uppercase">{text}</Typography>
          <Typography variant="h5">{value}</Typography>
          {exceedlimit ? (
            <CardActions variant="body3">
              Limite excedido: {exceedlimit === "NO" ? "não" : "sim"}
            </CardActions>
          ) : null}
        </CardContent>
      </Card>
      
  );
}
