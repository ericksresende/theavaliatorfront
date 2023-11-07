import { Card, CardContent, CardActions, Typography } from '@mui/material';
import { styled } from '@mui/material';
import { useState } from 'react';

export default function BasicCard(props) {
  const { text, value, exceedlimit } = props;

  return (
    <Card style={{
      backgroundColor: "#243856",
      color: 'white', // Cor padrão do texto como branco.
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
        {text === "Final Score" ? (
          <Typography variant="h5" style={{ color: value < 88 ? 'red' : value > 100 ? 'lightgreen' : 'white' }}>
            {value}
          </Typography>
        ) : (
          <Typography variant="h5">{value}</Typography>
        )}

        {text !== "Final Score" && exceedlimit ? (
          <Typography variant="body3" style={{ color: exceedlimit === "NO" ? "white" : "red" }}>
            Limite excedido: {exceedlimit === "NO" ? "não" : "sim"}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}
