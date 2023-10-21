import React, { useState, useEffect } from 'react';
import { Box, Container, ListItem, ListItemText, ListItemButton } from '@mui/material';
import Navbar from './components/Navbar';
import Submission from '../services/Submission';
import SubmissionTeacher from '../services/SubmissionTeacher';
import SourceCode from '../services/SourceCode';
import ScoreSourceCode from '../services/ScoreSourceCode';
import { useNavigate } from 'react-router-dom';

const Submissoes = () => {
  const [submissionData, setSubmissionData] = useState([]);
  const [submissionTeacherData, setSubmissionTeacherData] = useState([]);
  const [sourceCodeData, setSourceCodeData] = useState([]);
  const [sourceCodeTeacherData, setSourceCodeTeacherData] = useState([]);
  const token = sessionStorage.getItem('token');
  const idproblema = sessionStorage.getItem('idproblema');
  console.log(idproblema);
  const idusuario = sessionStorage.getItem('idusuario');
  const datalimite = sessionStorage.getItem('datalimite');
  const submission = new Submission(token, idproblema, idusuario, datalimite);
  const submissionteacher = new SubmissionTeacher(token, idproblema);
  const navigate = useNavigate();

  function acessarPontuacoes(id, name, token) {
    sessionStorage.setItem("idsubmissao", id);
    sessionStorage.setItem("nomealuno", name);
    sessionStorage.setItem("token", token);
    navigate("/pontuacoes");
  }

  useEffect(() => {
    submission.getSubmissions()
      .then((data) => {
        setSubmissionData(data);
        console.log(data);
      });
    submissionteacher.getSubmissions()
      .then((data) => {
        setSubmissionTeacherData(data);
        console.log(data);
      });
  }, []);

  useEffect(() => {
    if (sourceCodeData.length > 0) {
      console.log("Dados do código-fonte atualizados:", sourceCodeData);
      
      // Agora você pode realizar qualquer ação ou lógica que precisa com sourceCodeData.
      // Por exemplo, chame sua função ScoreSourceCode ou outras funções aqui.
    }
  }, [sourceCodeData]);

  useEffect(() => {
    if (sourceCodeTeacherData.length > 0) {
      console.log("Dados do código-fonte do professor atualizados:", sourceCodeTeacherData);
      
      // Faça o que precisa ser feito com sourceCodeTeacherData aqui.
    }
  }, [sourceCodeTeacherData]);

  const handleSourceCodeClick = (token, idsubmissao, submissionTeacherData, title) => {
    // Crie uma instância de SourceCode com base no ID clicado
    const sourcecode = new SourceCode(token, idsubmissao);
    
    // Chame a função getsourcecode da instância sourcecode
    sourcecode.getSourceCode().then((data) =>{
      setSourceCodeData(data);
      console.log(data);
    }); // Certifique-se de implementar essa função

    const firstCorrectSubmission = submissionTeacherData.find(({ evaluation }) => evaluation === "CORRECT");

    if (firstCorrectSubmission) {
      // Aqui, firstCorrectSubmission contém o primeiro item de evaluate que é "CORRECT"
      const sourcecodeteacher = new SourceCode(token, firstCorrectSubmission.id);
      sourcecodeteacher.getSourceCode().then((data) =>{
        setSourceCodeTeacherData(data);
        console.log(data);
        console.log("PROFESSOR");
      });
    } else {
      // Se não houver nenhum item com evaluation igual a "CORRECT"
      console.log("Nenhum item com evaluation igual a 'CORRECT' encontrado.");
    }

    const score = new ScoreSourceCode(idproblema, idsubmissao, sourceCodeData, sourceCodeTeacherData, title);
    const pontuacao = score.getScore();
    console.log(pontuacao);

    // Chame a função acessarPontuacoes para redirecionar para a página de pontuações
    // acessarPontuacoes(id, name, token);
  };

  return (
    <React.Fragment>
      <Navbar />
      <Container style={{
        width: "100vw",
        height: "100vh",
        background: "white",
        alignItems: "center",
      }}>
        <h2>Problemas da Tarefa</h2>
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
                <ListItemButton component="a" onClick={() => handleSourceCodeClick(token, id, submissionTeacherData, filename)}>
                  <ListItemText primary={"Submissão " + id} />
                </ListItemButton>
              </ListItem>
            ))
          }

          </div>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default Submissoes;
