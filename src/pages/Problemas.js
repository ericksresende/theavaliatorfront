import React, { useState, useEffect } from 'react';
import { Box, Container, ListItem, ListItemText, ListItemButton } from '@mui/material';
import '../pages/css/Base.module.css'
import Navbar from './components/Navbar';
import Problem from '../services/Problem';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

const Problemas = () => {
  const [problemData, setProblemData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const token = sessionStorage.getItem('token');
  const idtarefa = sessionStorage.getItem('idtarefa');
  const idusuario = sessionStorage.getItem('idusuario');
  const nometarefa = sessionStorage.getItem('nometarefa');
  const nometurma = sessionStorage.getItem('nometurma');
  const nomealuno = sessionStorage.getItem('nomealuno');
  const submissoesruins = sessionStorage.getItem('submissoesruins');
  const submissoesboas = sessionStorage.getItem('submissoesboas');
  const problem = new Problem(token, idtarefa, idusuario);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      navigate("/");
    } else {
      problem.getProblems().then((data) => {
        setProblemData(data.problems);
        setScoreData(data.scores);
      });
    }
  }, []);

  function acessarSubmissoes(id, name) {
    sessionStorage.setItem("idproblema", id);
    sessionStorage.setItem("nomeproblema", name);
    navigate("/submissoes");
  }

  const combinedListItems = problemData.map(({ id, name }) => {
    const matchingScore = scoreData.find((score) => score.problem_id === id);
    return (
      <div key={id}>
        <ListItem key={id} component="div" disablePadding secondaryAction={<ListItemText primary={"Pontuação: " + matchingScore.user_score} />} style={{ borderBottom: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black", }}>
          <ListItemButton component="a" onClick={() => acessarSubmissoes(id, name)}>
            <ListItemText primary={name} />
          </ListItemButton>
        </ListItem>
      </div>
    );
  });

  return (
    <React.Fragment>
      <Navbar />
      <Container style={{
        width: "100vw",
        height: "100vh",
        background: "white",
        alignItems: "center",
      }}>
        <h2>{nometurma} {<KeyboardArrowRightIcon />} {nometarefa} {<KeyboardArrowRightIcon />} {nomealuno} </h2>
        <br></br>
        <Box>
          <Box style={{
            background: "#243856",
            padding: "25px",
            borderRadius: '10px',
            borderBottomLeftRadius: '0',
            borderBottomRightRadius: '0',
          }}>
          </Box>
          <div>
            {combinedListItems}
          </div>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default Problemas;
