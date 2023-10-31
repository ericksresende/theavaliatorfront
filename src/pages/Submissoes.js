import React, { useState, useEffect } from 'react';
import { Box, Container, ListItem, ListItemText, ListItemButton } from '@mui/material';
import '../pages/css/Base.module.css'
import Navbar from './components/Navbar';
import Submission from '../services/Submission';
import SubmissionTeacher from '../services/SubmissionTeacher';
import SourceCode from '../services/SourceCode';
import ScoreSourceCode from '../services/ScoreSourceCode';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';

const Submissoes = () => {
  const [submissionData, setSubmissionData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [sourceCodeData, setSourceCodeData] = useState([]);
  const token = sessionStorage.getItem('token');
  const idproblema = sessionStorage.getItem('idproblema');
  const nometarefa = sessionStorage.getItem('nometarefa');
  const nometurma = sessionStorage.getItem('nometurma');
  const nomealuno = sessionStorage.getItem('nomealuno');
  const nomeproblema = sessionStorage.getItem("nomeproblema");
  console.log(idproblema);
  const idusuario = sessionStorage.getItem('idusuario');
  const datalimite = sessionStorage.getItem('datalimite');
  const submission = new Submission(token, idproblema, idusuario, datalimite);
  const submissionteacher = new SubmissionTeacher(token, idproblema);
  const navigate = useNavigate();

  if (!sessionStorage.getItem('token')) {
    // Redirecione o usuário para a página de login ou exiba uma mensagem de erro
    navigate("/");
  }

  function acessarPontuacoes(id, name, token) {
    sessionStorage.setItem("idsubmissao", id);
    sessionStorage.setItem("nomealuno", name);
    sessionStorage.setItem("token", token);
    navigate("/pontuacoes");
  }

  const [loadingSourceCode, setLoadingSourceCode] = useState(true); // Adicione este estado local

  useEffect(() => {
    submission.getSubmissions()
      .then((data) => {
        const maxTries = Math.max(...data.map(({ tries }) => tries));
        const bestSubmissions = data.filter(({ tries }) => tries === maxTries);
        const sourcecodeAluno = new SourceCode(token, bestSubmissions[0].id);
        sourcecodeAluno.getSourceCode()
          .then((codigo) => {
            setSourceCodeData(codigo);
            setLoadingSourceCode(false); // Marque o carregamento como concluído
          })
          .catch((error) => {
            console.error('Erro ao buscar o código-fonte', error);
          });
          // const score = new ScoreSourceCode(idproblema, codigo, codigoProfessor, nomeProblema, idturma, idtarefa)
        setSubmissionData(bestSubmissions);
      });
  }, []);

  useEffect(() => {
    if (sourceCodeData.length > 0) {
      console.log("Dados do código-fonte atualizados:", sourceCodeData);
      
      // Agora você pode realizar qualquer ação ou lógica que precisa com sourceCodeData.
      // Por exemplo, chame sua função ScoreSourceCode ou outras funções aqui.
    }
  }, [sourceCodeData]);

  // useEffect(() => {
  //   if (sourceCodeTeacherData.length > 0) {
  //     console.log("Dados do código-fonte do professor atualizados:", sourceCodeTeacherData);
      
  //     // Faça o que precisa ser feito com sourceCodeTeacherData aqui.
  //   }
  // }, [sourceCodeTeacherData]);

  // const handleSourceCodeClick = (token, idsubmissao, submissionTeacherData, title) => {
  //   // Crie uma instância de SourceCode com base no ID clicado
  //   const sourcecode = new SourceCode(token, idsubmissao);
    
  //   // Chame a função getsourcecode da instância sourcecode
  //   sourcecode.getSourceCode().then((data) =>{
  //     setSourceCodeData(data);
  //     console.log(data);
  //   }); // Certifique-se de implementar essa função

  //   const firstCorrectSubmission = submissionTeacherData.find(({ evaluation }) => evaluation === "CORRECT");

  //   if (firstCorrectSubmission) {
  //     // Aqui, firstCorrectSubmission contém o primeiro item de evaluate que é "CORRECT"
  //     const sourcecodeteacher = new SourceCode(token, firstCorrectSubmission.id);
  //     sourcecodeteacher.getSourceCode().then((data) =>{
  //       setSourceCodeTeacherData(data);
  //       console.log(data);
  //       console.log("PROFESSOR");
  //     });
  //   } else {
  //     // Se não houver nenhum item com evaluation igual a "CORRECT"
  //     console.log("Nenhum item com evaluation igual a 'CORRECT' encontrado.");
  //   }

  //   const score = new ScoreSourceCode(idproblema, idsubmissao, sourceCodeData, sourceCodeTeacherData, title);
  //   const pontuacao = score.getScore();
  //   console.log(pontuacao);

  //   // Chame a função acessarPontuacoes para redirecionar para a página de pontuações
  //   // acessarPontuacoes(id, name, token);
  // };

  return (
    <React.Fragment>
      <Navbar />
      <Container style={{
        width: "100vw",
        height: "100vh",
        background: "white",
        alignItems: "center",
      }}>
        <h2>{nometurma} {<KeyboardArrowRightIcon />} {nometarefa} {<KeyboardArrowRightIcon />} {nomealuno} {<KeyboardArrowRightIcon />} {nomeproblema} </h2>
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
            {submissionData
              .filter(({ evaluation }) => evaluation === "CORRECT")
              .map(({ id, evaluation, filename }) => (
                <ListItem
                  key={id}
                  component="div"
                  disablePadding
                  secondaryAction={<ListItemText primary={"Status: " + evaluation} />}
                  style={{
                    borderBottom: "1px solid black",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  <ListItemButton component="a">
                    <ListItemText primary={"Submissão " + id} />
                  </ListItemButton>
                </ListItem>
              ))
            }
            <ListItem
              key={2}
              component="div"
              disablePadding
              style={{
                backgroundColor: "black",
                color: "white",
                borderBottom: "1px solid black",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
              }}
            >
              {loadingSourceCode ? (
                <>
                <ListItemButton component="a">
                  <ListItemText primary={"Carregando código..."} />
                </ListItemButton>
                </>
              ) : (
                <>
                <ListItemText > <code>{sourceCodeData}</code></ListItemText>
                </>
              )}
            </ListItem>
          </div>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default Submissoes;
