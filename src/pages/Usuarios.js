import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  ListItem,
  ListItemText,
  ListItemButton,
  CircularProgress,
} from '@mui/material';
import '../pages/css/Base.module.css'
import Navbar from './components/Navbar';
import User from '../services/UsersQuizz';
import Problem from '../services/Problem';
import Submission from '../services/Submission';
import SubmissionTeacher from '../services/SubmissionTeacher';
import SourceCode from '../services/SourceCode';
import ScoreSourceCode from '../services/ScoreSourceCode';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SendIcon from '@mui/icons-material/Send';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';

const Usuarios = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState([]); // Inicialmente, o estado de carregamento está definido como verdadeiro
  const arraySubmissoesAluno = [];
  const arrayPontuacoes = [];

  const token = sessionStorage.getItem('token');
  const idtarefa = sessionStorage.getItem('idtarefa');
  const nometarefa = sessionStorage.getItem('nometarefa');
  const datalimite = sessionStorage.getItem('datalimite');
  const nometurma = sessionStorage.getItem('nometurma');
  const idturma = sessionStorage.getItem('idturma');

  const user = new User(token, idtarefa);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      navigate("/");
    } else {
      user.getUsers()
        .then((data) => {
          setUserData(data);
          obterProblemas(data);
          const loadingArray = Array(data.length).fill(true);
          setLoading(loadingArray);
        });
    }
  }, []);

  function acessarSubmissoes(id, title) {
    sessionStorage.setItem('idusuario', id);
    navigate('/problemas');
  }

  async function obterSubmissoes(dataproblems, idusuario, datalimite) {
    const submissoesAlunoAtual = [];

    for (const { id, filename } of dataproblems.problems) {
      const submission = new Submission(token, id, idusuario, datalimite);
      const data = await submission.getSubmissions();
      const correctSubmissions = data.filter(({ evaluation }) => evaluation === "CORRECT");

      if (correctSubmissions.length === 0) {
        continue; // Pule este problema se não houver submissões corretas
      }

      const maxTries = Math.max(...correctSubmissions.map(({ tries }) => tries));
      const bestSubmissions = correctSubmissions.filter(({ tries }) => tries === maxTries);
      submissoesAlunoAtual.push(bestSubmissions);
    }

    arraySubmissoesAluno.push(submissoesAlunoAtual);
    console.log(arraySubmissoesAluno);
  }

  async function obterSubmissoesProfessor(data) {
    const arraySubmissoesProfessor = [];

    if (Array.isArray(data) && data) {
      const promises = data.map(async ({ id }) => {
        const submissionteacher = new SubmissionTeacher(token, id);
        const submissions = await submissionteacher.getSubmissions();
        return submissions;
      });

      arraySubmissoesProfessor.push(...await Promise.all(promises));
    } else {
      console.error("Data não é um array válido:", data);
    }

    return arraySubmissoesProfessor;
  }

  async function obterPontuacoes(index, token, submissionStudentData, submissionTeacherData, arrayProblemas, title) {
    const scoreData = [[]];
    const sourceCodeAlunosData = [];

    for (let j = 0; j < submissionStudentData.length; j++) {
      for (let k = 0; k < arrayProblemas.length; k++) {
        sourceCodeAlunosData.push([]);
        if (submissionStudentData[j][0].problem.id === arrayProblemas[k].id) {
          console.log("teste");
          const sourcecodeAluno = new SourceCode(token, submissionStudentData[j][0].id);
          // const sourcecodeProfessor = new SourceCode(token, submissionTeacherData[k][0].id);

          await sourcecodeAluno.getSourceCode().then((data) => {
            const array =
            {
              id: submissionStudentData[j][0].id, codigo: data
            }

            sourceCodeAlunosData[k].push(array);
          });
        }
      }
    }
    let sourceCodeProfessorData;
    const sourcecodeProfessor = new SourceCode(token, submissionTeacherData[1][0].id);
    await sourcecodeProfessor.getSourceCode().then((data) => {
      sourceCodeProfessorData = data;
    });

    const scoreSourceCodeData = [[]];
    for (const problema of arrayProblemas) {
      const score = new ScoreSourceCode(problema.id, sourceCodeAlunosData[arrayProblemas.indexOf(problema)], sourceCodeProfessorData, problema.name, idturma, idtarefa);

      try {
        const pontuacao = await score.getScore();

        scoreSourceCodeData.push(pontuacao);
      } catch {
        console.error("errado aqui");
      }

    }


    toggleLoading(index);
  }

  function toggleLoading(index) {
    const updatedLoading = [...loading];

    updatedLoading[index] = !updatedLoading[index];
    console.log("mudou");
    setLoading(updatedLoading);
  }


  async function obterProblemas(userData) {
    const problems = new Problem(token, idtarefa, userData[0].id);
    const data = await problems.getProblems();

    const jsonArray = data.problems;

    const arraySubmissoesProfessor = await obterSubmissoesProfessor(jsonArray);
    console.log(arraySubmissoesProfessor);
    for (const [index, { id }] of userData.entries()) {
      obterPontuacoesCadaAluno(index, id, data, arraySubmissoesProfessor)
    }
  }

  async function obterPontuacoesCadaAluno(index, idusuario, data, arraySubmissoesProfessor) {
    const submissoesAlunoAtual = [];

    for (const { id } of data.problems) {
      const submission = new Submission(token, id, idusuario, datalimite);
      const data = await submission.getSubmissions();
      const correctSubmissions = data.filter(({ evaluation }) => evaluation === "CORRECT");

      if (correctSubmissions.length === 0) {
        continue;
      }

      const maxTries = Math.max(...correctSubmissions.map(({ tries }) => tries));
      const bestSubmissions = correctSubmissions.filter(({ tries }) => tries === maxTries);
      submissoesAlunoAtual.push(bestSubmissions);
    }
    await obterPontuacoes(index, token, submissoesAlunoAtual, arraySubmissoesProfessor, data.problems, "teste");
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
        <h2>{nometurma} {<KeyboardArrowRightIcon />} {nometarefa}</h2>
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
            {userData.map(({ id, name },index) => (
              <ListItem key={id} component="div" disablePadding secondaryAction={<ListItemButton component="a" onClick={() => acessarSubmissoes(id, token)}>
                {loading[index] ? (
                  <CircularProgress size={24} />
                ) : (
                  <SendIcon />
                )}
              </ListItemButton>} style={{
                padding: "5px",
                borderBottom: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black",
              }}>
                <AccountBoxIcon />
                <ListItemText primary={name} style={{ marginLeft: "5px" }} />
              </ListItem>
            ))}
          </div>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default Usuarios;