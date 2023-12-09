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
import Typography from '@mui/material/Typography';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SendIcon from '@mui/icons-material/Send';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';

const Usuarios = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState({}); // Inicialmente, o estado de carregamento está definido como verdadeiro
  const [error, setError] = useState({}); // Inicialmente, o estado de carregamento está definido como verdadeiro
  const [errorTeacher, setErrorTeacher] = useState({});
  const [errorCalculo, setErrorCalculo] = useState({});
  const [warning, setWarning] = useState({}); // Inicialmente, o estado de carregamento está definido como verdadeiro
  const [goodwarning, setGoodWarning] = useState({});
  const [submissoesruins, setSubmissoesRuins] = useState([]);
  const [submissoesboas, setSubmissoesBoas] = useState([]);
  const [submissoesnormais, setSubmissoesNormais] = useState([]);
  const arraySubmissoesAluno = [];
  const arrayPontuacoes = [];

  const token = sessionStorage.getItem('token');
  const idtarefa = sessionStorage.getItem('idtarefa');
  const nometarefa = sessionStorage.getItem('nometarefa');
  const datalimite = sessionStorage.getItem('datalimite');
  const nometurma = sessionStorage.getItem('nometurma');
  const idturma = sessionStorage.getItem('idturma');
  const dadosusuario = sessionStorage.getItem('dadosusuario');

  const user = new User(token, idtarefa);
  const navigate = useNavigate();
  const scoreSourceCodeData = [[]];

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      navigate("/");
    } else {
      user.getUsers().then((data) => {
        setUserData(data);
        obterProblemas(data);
        const loadingState = {};
        data.forEach((user) => {
          loadingState[user.id] = true; // Inicialize o estado de carregamento para cada usuário
        });
        setLoading(loadingState);
        sessionStorage.setItem('dadosusuario', userData);
        sessionStorage.setItem('dadoswarning', warning);
        sessionStorage.setItem('dadosusuario', userData);
        console.log("dados salvos");
      });
    }
  }, []);

  function acessarSubmissoes(id, nome, ruins, boas, normais) {
    sessionStorage.setItem('idusuario', id);
    sessionStorage.setItem('nomealuno', nome);
    sessionStorage.setItem('ruins', JSON.stringify(ruins));
    sessionStorage.setItem('boas', JSON.stringify(boas));
    sessionStorage.setItem('normais', JSON.stringify(normais));
    window.open('/problemas', '_blank');
  }

  async function obterSubmissoes(index, token, submissionStudentData, submissionTeacherData, arrayProblemas, title) {
    const sourceCodeAlunosData = [];

    for (let j = 0; j < submissionStudentData.length; j++) {
      for (let k = 0; k < arrayProblemas.length; k++) {
        sourceCodeAlunosData.push([]);
        if (submissionStudentData[j][0].problem.id === arrayProblemas[k].id) {
          const sourcecodeAluno = new SourceCode(token, submissionStudentData[j][0].id);

          try {
            const data = await sourcecodeAluno.getSourceCode();
            if (data.length > 0) {
              const array = {
                id: submissionStudentData[j][0].id,
                codigo: data,
              };
              sourceCodeAlunosData[j].push(array);
            } else {
              console.error("array vazio" + data);
              const aviso = "vazio";
              return aviso;
            }
          } catch (error) {
            console.error("Erro ao obter o código-fonte:", error);
          }
        }
      }
    }

    return sourceCodeAlunosData;
  }

  async function obterSubmissoesProfessor(data) {
    const arraySubmissoesProfessor = [];
    let tudovazio = true;

    if (Array.isArray(data) && data) {
      const promises = data.map(async ({ id }) => {
        const submissionteacher = new SubmissionTeacher(token, id);
        const submissions = await submissionteacher.getSubmissions();
        console.log(submissions.length);
        if (submissions.length !== 0){
          console.log("caiu aqui");
          tudovazio = false;
        }
        return submissions;
      });

      arraySubmissoesProfessor.push(...await Promise.all(promises));
    } else {
      console.error("Data não é um array válido:", data);
    }

    const arrayError = ["erro", "erro", "erro"];
    if (tudovazio === true){
      return arrayError;
    }
    else{
      return arraySubmissoesProfessor;
    }
  }

  async function obterPontuacoes(index, token, submissionStudentData, submissionTeacherData, arrayProblemas, title) {
    const scoreData = [[]];
    const sourceCodeAlunosData = await obterSubmissoes(index, token, submissionStudentData, submissionTeacherData, arrayProblemas, title);

    const sourceCodeProfessorData = [];
    for (const [index] of submissionTeacherData.entries()) {
      console.log(submissionTeacherData);
      try{
        const sourcecodeProfessor = new SourceCode(token, submissionTeacherData[index][0].id);
        await sourcecodeProfessor.getSourceCode().then((data) => {
          sourceCodeProfessorData.push(data);
        });
      }
      catch (error) {
        console.error(sourceCodeAlunosData);
      }
    }
    console.log(submissionTeacherData);

    const arrayerros = [];
    if (submissionStudentData.length == arrayProblemas.length) {
      const scoreSourceCodeData = []; // Crie um array para armazenar as pontuações

      for (const [index, problema] of arrayProblemas.entries()) {
        const score = new ScoreSourceCode(problema.id, sourceCodeAlunosData[index], sourceCodeProfessorData[arrayProblemas.indexOf(problema)], problema.name, idturma, idtarefa, submissionTeacherData[0][0].user.id);

        try {
          const pontuacao = await score.getScore();
          scoreSourceCodeData.push(pontuacao);
          arrayerros.push("erro");
        } catch (error) {
          console.error(sourceCodeAlunosData);
          console.log(arrayerros);
        }
      }
      return scoreSourceCodeData; // Retorna todas as pontuações após o loop ter sido completamente executado
    } else {
      const scoreSourceCodeDataDiferente = [];
      for (let i = 0; i < arrayProblemas.length; i++) {
        const problema = arrayProblemas[i];
        for (let j = 0; j < submissionStudentData.length; j++) {
          const submissionStudent = submissionStudentData[j];
          if (problema.id === submissionStudent[0].problem.id) {
            const score = new ScoreSourceCode(problema.id, sourceCodeAlunosData[j], sourceCodeProfessorData[arrayProblemas.indexOf(problema)], problema.name, idturma, idtarefa, submissionTeacherData[0][0].id);
            try {
              const pontuacao = await score.getScore();
              console.log(pontuacao);
              scoreSourceCodeDataDiferente.push(pontuacao);
              arrayerros.push("erro");
            } catch (error) {
              console.error(scoreSourceCodeDataDiferente);
              console.log(arrayerros);
            }
          }
        }
      }
      console.log(scoreSourceCodeDataDiferente);
      return scoreSourceCodeDataDiferente;
    }
  }

  function toggleLoading(userId) {
    setLoading((prevLoading) => ({
      ...prevLoading,
      [userId]: !prevLoading[userId], // Altera o estado de carregamento para um ID de usuário específico
    }));
  }

  function toggleError(userId) {
    setError((prevError) => ({
      ...prevError,
      [userId]: !prevError[userId], // Altera o estado de aviso para um ID de usuário específico
    }));
  }

  function toggleErrorCalculo(userId) {
    setErrorCalculo((prevErrorCalculo) => ({
      ...prevErrorCalculo,
      [userId]: !prevErrorCalculo[userId], // Altera o estado de aviso para um ID de usuário específico
    }));
  }
  
  function toggleErrorTeacher(userId) {
    setErrorTeacher((prevErrorTeacher) => ({
      ...prevErrorTeacher,
      [userId]: !prevErrorTeacher[userId], // Altera o estado de aviso para um ID de usuário específico
    }));
  }

  function toggleWarning(userId) {
    setWarning((prevWarning) => {
      // Verifica se o aviso já é verdadeiro para o usuário específico
      if (prevWarning[userId]) {
        // Se já for verdadeiro, retorna o estado atual sem fazer alterações
        return prevWarning;
      }
  
      // Se não for verdadeiro, altera o estado de aviso para o ID de usuário específico
      return {
        ...prevWarning,
        [userId]: true,
      };
    });
  }
  

  function toggleGoodWarning(userId) {
    setGoodWarning((prevGoodWarning) => {
      // Verifica se o aviso já é verdadeiro para o usuário específico
      if (prevGoodWarning[userId]) {
        // Se já for verdadeiro, retorna o estado atual sem fazer alterações
        return prevGoodWarning;
      }
  
      // Se não for verdadeiro, altera o estado de aviso para o ID de usuário específico
      return {
        ...prevGoodWarning,
        [userId]: true,
      };
    });
  }  

  async function obterProblemas(userData) {
    if (userData.length === 0) {
      return;
    }
    const problems = new Problem(token, idtarefa, userData[0].id);
    const data = await problems.getProblems();

    const jsonArray = data.problems;

    const arraySubmissoesProfessor = await obterSubmissoesProfessor(jsonArray);
    if (arraySubmissoesProfessor[0] === "erro"){
      for (const [index, { id }] of userData.entries()) {
        toggleErrorTeacher(id);
        toggleLoading(id);
      }
    }
    else{
      for (const [index, { id }] of userData.entries()) {
        obterPontuacoesCadaAluno(index, id, data, arraySubmissoesProfessor)
      }
    }
  }

  async function obterSubmissaoPorAluno(index, idusuario, data, arraySubmissoesProfessor) {
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
    return submissoesAlunoAtual;
  }

  async function obterPontuacoesCadaAluno(index, idusuario, data, arraySubmissoesProfessor) {
    const submissoesAlunoAtual = await obterSubmissaoPorAluno(index, idusuario, data, arraySubmissoesProfessor);

    console.log(arraySubmissoesProfessor);
    if (submissoesAlunoAtual.length > 0) {
      if (arraySubmissoesProfessor.length === 0){
        toggleErrorTeacher(idusuario);
        toggleLoading(idusuario);
      }
      else {

          const pontuacao = await obterPontuacoes(index, token, submissoesAlunoAtual, arraySubmissoesProfessor, data.problems, "teste");
          if (pontuacao.length === 0){
            toggleErrorCalculo(idusuario);
            toggleLoading(idusuario);
          }
          try {
            for (let i = 0; i < pontuacao.length; i++) {
              const pontuacaonumero = parseFloat(pontuacao[i][0].finalScore);
              if (pontuacaonumero < 88.0) {
                toggleWarning(idusuario);
                console.log(pontuacaonumero);
                setSubmissoesRuins((prev) => [...prev, parseInt(pontuacao[i][0].solution)]);
              } else if (pontuacaonumero > 103.0) {
                toggleGoodWarning(idusuario);
                console.log(pontuacaonumero);
                setSubmissoesBoas((prev) => [...prev, parseInt(pontuacao[i][0].solution)]);
              }
              else if (pontuacaonumero > 88.0 && pontuacaonumero < 103.0) {
                console.log(pontuacaonumero);
                setSubmissoesNormais((prev) => [...prev, parseInt(pontuacao[i][0].solution)]);
              }
              if (i === pontuacao.length - 1) {
                toggleLoading(idusuario);
              }
            }
          } catch {
            console.error("nao foi possivel ler a pontuacao")
            console.error(submissoesAlunoAtual);
          }
        }
      } 
    else {
      toggleLoading(idusuario);
      toggleError(idusuario);
    }
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
            {userData.length === 0 ? (
              <ListItem variant="body2" style={{color: "red", fontSize: "18px", border: "1px solid black"}}>Nenhum aluno cadastrado na turma</ListItem>
            ) : (
                userData.map(({ id, name }) => (
                  <ListItem key={id} component="div" disablePadding secondaryAction={<ListItemButton component="a" >
                    {loading[id] ? (
                      <CircularProgress size={24} />
                    ) :
                      error[id] ? (
                        <Typography variant="body2" color="error">SEM SUBMISSÕES DO ALUNO</Typography>
                      )
                      :
                      errorCalculo[id] ? (
                        <Typography variant="body2" color="error">ERRO NO CÁLCULO DAS PONTUAÇÕES </Typography>
                      )
                      :
                      errorTeacher[id] ? (
                        <Typography variant="body2" color="error">SEM SUBMISSÕES DO PROFESSOR </Typography>
                      ) : warning[id] && goodwarning[id] ? (
                        <>
                          <Typography variant="body2" color="orange">PONTUAÇÃO BAIXA </Typography>
                          <Typography variant="body2" color="black">&</Typography>
                          <Typography variant="body2" color="blue">PONTUAÇÃO ALTA </Typography>
                          <SendIcon onClick={() => acessarSubmissoes(id, name, submissoesruins, submissoesboas, submissoesnormais)} />
                        </>
                      )
                      : warning[id] ? (
                        <>
                          <Typography variant="body2" color="orange">PONTUAÇÃO BAIXA</Typography>
                          <SendIcon onClick={() => acessarSubmissoes(id, name, submissoesruins, submissoesboas, submissoesnormais)} />
                        </>
                      )
                        : goodwarning[id] ? (
                          <>
                            <Typography variant="body2" color="blue">PONTUAÇÃO ALTA </Typography>
                            <SendIcon onClick={() => acessarSubmissoes(id, name, submissoesruins, submissoesboas, submissoesnormais)} />
                          </>
                        )
                        : (
                          <>
                            <Typography variant="body2" color="green">OK</Typography>
                            <SendIcon onClick={() => acessarSubmissoes(id, name, submissoesruins, submissoesboas, submissoesnormais)} />
                          </>
                        )}
                  </ListItemButton>} style={{
                    padding: "5px",
                    borderBottom: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black",
                  }}>
                    <AccountBoxIcon />
                    <ListItemText primary={name} style={{ marginLeft: "5px" }} />
                  </ListItem>
            )))}
          </div>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default Usuarios;
