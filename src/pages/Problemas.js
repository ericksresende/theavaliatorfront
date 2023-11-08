import React, { useState, useEffect } from 'react';
import { Box, Container, ListItem, ListItemText, ListItemButton, Typography } from '@mui/material';
import '../pages/css/Base.module.css';
import Navbar from './components/Navbar';
import Problem from '../services/Problem';
import Submission from '../services/Submission';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

const Problemas = () => {
  const [problemData, setProblemData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [submissionsStatus, setSubmissionsStatus] = useState([]); // Adicionamos um estado para o status das submissões
  const token = sessionStorage.getItem('token');
  const idtarefa = sessionStorage.getItem('idtarefa');
  const idusuario = sessionStorage.getItem('idusuario');
  const datalimite = sessionStorage.getItem('datalimite');
  const nometarefa = sessionStorage.getItem('nometarefa');
  const nometurma = sessionStorage.getItem('nometurma');
  const nomealuno = sessionStorage.getItem('nomealuno');
  const submissoesruins = JSON.parse(sessionStorage.getItem('ruins'));
  const submissoesboas = JSON.parse(sessionStorage.getItem('boas'));
  const submissoesnormais = JSON.parse(sessionStorage.getItem('normais'));
  console.log(submissoesnormais);
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

  useEffect(() => {
    async function fetchSubmissionsStatus() {
      if (problemData.length === 0) {
        // Verifique se problemData está vazio e retorne se for o caso
        return;
      }

      const submissionStatusPromises = problemData.map(({ id }) => {
        return new Submission(token, id, idusuario, datalimite)
          .getSubmissions()
          .then((data) => {
            const maxTries = Math.max(...data.map(({ tries }) => tries));
            const bestSubmissions = data.filter(({ tries }) => tries === maxTries);
            const firstCorrectSubmission = bestSubmissions.find(({ evaluation }) => evaluation === 'CORRECT');
            console.log(firstCorrectSubmission);
            let isBoa;
            let isRuim;
            let isNormal;
            if (firstCorrectSubmission){
              isBoa = submissoesboas.indexOf(firstCorrectSubmission.id) !== -1;
              isRuim = submissoesruins.indexOf(firstCorrectSubmission.id) !== -1;
              isNormal = submissoesnormais.indexOf(firstCorrectSubmission.id) !== -1;
            }
            return { id, isBoa, isRuim, isNormal };
          });
      });

      const results = await Promise.all(submissionStatusPromises);
      setSubmissionsStatus(results);
    }

    fetchSubmissionsStatus();
  }, [problemData, submissoesboas, submissoesruins]);

  function acessarSubmissoes(id, name) {
    sessionStorage.setItem("idproblema", id);
    sessionStorage.setItem("nomeproblema", name);
    window.open('/submissoes', '_blank');
  }

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
            padding: "20px",
            borderRadius: '10px',
            borderBottomLeftRadius: '0',
            borderBottomRightRadius: '0',
            border: "1px solid black",
          }}>
          </Box>
          <div>
            {problemData.map(({ id, name }, index) => (
              <div key={id}>
                <ListItem key={id} component="div" disablePadding secondaryAction={<ListItemButton component="a" >
                {submissionsStatus[index] && submissionsStatus[index].isRuim ? (
                          <>
                          <Typography variant="body2" color="orange">PONTUAÇÃO BAIXA</Typography>
                          <SendIcon onClick={() => acessarSubmissoes(id, name)}/>
                          </>
                        )
                        : submissionsStatus[index] && submissionsStatus[index].isBoa ? (
                          <>
                          <Typography variant="body2" color="blue">PONTUAÇÃO ALTA</Typography>
                          <SendIcon onClick={() => acessarSubmissoes(id, name)}/>
                          </>
                        )
                        : submissionsStatus[index] && submissionsStatus[index].isNormal ? (
                          <>
                          <Typography variant="body2" color="green">OK</Typography>
                          <SendIcon onClick={() => acessarSubmissoes(id, name)}/>
                          </>
                        ) : (
                          <Typography variant="body2" color="error">SEM CÁLCULO</Typography>
                        )}
                </ListItemButton>} style={{
                  padding: "5px",
                  borderBottom: "1px solid black",
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                }}>
                  <QuestionAnswerIcon />
                  <ListItemText primary={name} style={{ marginLeft: "5px" }} />
                </ListItem>
              </div>
            ))}
          </div>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default Problemas;
