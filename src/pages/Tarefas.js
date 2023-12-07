import React, { useState, useEffect } from 'react';
import { Box, Container, ListItem, ListItemText, ListItemButton } from '@mui/material';
import '../pages/css/Base.module.css'
import Navbar from './components/Navbar';
import Quiz from '../services/Quiz';
import { useNavigate } from 'react-router-dom';
import QuizIcon from '@mui/icons-material/Quiz';
import SendIcon from '@mui/icons-material/Send';

const Tarefas = () => {
  const [quizData, setQuizData] = useState([]);
  const token = sessionStorage.getItem('token');
  const idturma = sessionStorage.getItem('idturma');
  const nometurma = sessionStorage.getItem('nometurma');
  const quiz = new Quiz(token, idturma);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      navigate("/");
    } else {
      quiz.getQuiz()
        .then((data) => {
          setQuizData(data);
        });
    }
  }, []);

  function acessarProblema(id, title, endDate) {
    sessionStorage.setItem("idtarefa", id);
    sessionStorage.setItem("nometarefa", title);
    sessionStorage.setItem("datalimite", endDate);
    navigate("/alunos");
  }

  const quizListItems = quizData.length === 0 ? (<ListItem style={{color: "red", fontSize: "18px", border: "1px solid black"}}>Sem tarefas cadastradas na turma</ListItem>) : (quizData.map(({ id, title, endDate }) => (
    <ListItem key={id} component="div" disablePadding secondaryAction={<ListItemButton component="a" onClick={() => acessarProblema(id, title, endDate)}>
      <SendIcon />
    </ListItemButton>} style={{
      padding: "5px",
      borderBottom: "1px solid black",
      borderLeft: "1px solid black",
      borderRight: "1px solid black",
    }}>
      <QuizIcon />
      <ListItemText primary={title} style={{ marginLeft: "5px" }} />
    </ListItem>
  )));

  return (
    <React.Fragment>
      <Navbar />
      <Container style={{
        width: "100vw",
        height: "100vh",
        background: "white",
        alignItems: "center",
      }}>
        <h2>Turma: {nometurma}</h2>
        <br></br>
        <Box>
          <Box style={{
            background: "#243856",
            padding: "20px",
            borderRadius: '10px',
            borderBottomLeftRadius: '0',
            borderBottomRightRadius: '0',
            border: "1px solid black",
          }}>
          </Box>
          <div>
            {quizListItems}
          </div>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default Tarefas;
