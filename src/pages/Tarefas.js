import React from 'react'
import { Box, Container, ListItem, ListItemText, ListItemButton } from '@mui/material'
import '../pages/css/Base.module.css'
import Navbar from './components/Navbar'
import Quiz from '../services/Quiz'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QuizIcon from '@mui/icons-material/Quiz';
import SendIcon from '@mui/icons-material/Send';

const Tarefas = () => {

  // Lista de tarefas
  const [quizData, setQuizData] = useState([]);
  
  // Pegando variáveis
  const token = sessionStorage.getItem('token');
  const idturma = sessionStorage.getItem('idturma');
  const nometurma = sessionStorage.getItem('nometurma');

  // Instanciando o serviço das Tarefas
  const quiz = new Quiz(token, idturma);

  // Instanciando o serviço de navegação
  const navigate = useNavigate();

  // Função que navega para a página de alunos
  function acessarProblema(id, title, endDate) {
    sessionStorage.setItem("idtarefa", id);
    sessionStorage.setItem("nometarefa", title);
    sessionStorage.setItem("datalimite", endDate);
    console.log(endDate);
    navigate("/alunos"); // Navega para a rota "/turmas"
  }

  // Função que puxa a lista de tarefas
  useEffect(() => {
    quiz.getQuiz()
      .then((data) => {
        setQuizData(data);
      });
  }, []);

  return (
    <React.Fragment>
      <Navbar />
      <Container style={{
        width: "100vw",
        height: "100vh",
        background: "white",
        alignItems: "center",
      }}>
        <h2>Lista de Tarefas da turma {nometurma}</h2>
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
            {quizData.map(({ id, title, endDate}) => (
              <ListItem key={id} component="div" disablePadding secondaryAction={<ListItemButton component="a" onClick={() => acessarProblema(id, title, endDate)}>
              <SendIcon/>
            </ListItemButton>} style={{ padding: "5px",
                borderBottom: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black",
              }}>
                <QuizIcon/>
                <ListItemText primary={title} style={{marginLeft: "5px"}}/>
              </ListItem>
            ))}
          </div>
        </Box>
      </Container>
    </React.Fragment>
  )
}

export default Tarefas;
