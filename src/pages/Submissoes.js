import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, Divider, Grid } from '@mui/material';
import BasicCard from './components/Card';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Navbar from './components/Navbar';
import Submission from '../services/Submission';
import SubmissionTeacher from '../services/SubmissionTeacher';
import SourceCode from '../services/SourceCode';
import ScoreSourceCode from '../services/ScoreSourceCode';

const Submissoes = () => {
  const [submissionData, setSubmissionData] = useState([]);
  const [sourceCodeData, setSourceCodeData] = useState('');
  const [sourceCodeTeacherData, setSourceCodeTeacherData] = useState('');
  const [pontuacao, setPontuacao] = useState(null);
  const [pontuacaoCarregando, setPontuacaoCarregando] = useState(true);
  const [codesLoaded, setCodesLoaded] = useState(false); // Novo estado para rastrear códigos carregados
  const [loading, setLoading] = useState({});
  const token = sessionStorage.getItem('token');
  const idproblema = sessionStorage.getItem('idproblema');
  const idturma = sessionStorage.getItem('idturma');
  const idtarefa = sessionStorage.getItem('idtarefa');
  const nometarefa = sessionStorage.getItem('nometarefa');
  const nometurma = sessionStorage.getItem('nometurma');
  const nomealuno = sessionStorage.getItem('nomealuno');
  const nomeproblema = sessionStorage.getItem('nomeproblema');
  const idusuario = sessionStorage.getItem('idusuario');
  const datalimite = sessionStorage.getItem('datalimite');
  const submission = new Submission(token, idproblema, idusuario, datalimite);
  const submissionteacher = new SubmissionTeacher(token, idproblema);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await submission.getSubmissions();
        const maxTries = Math.max(...data.map(({ tries }) => tries));
        const bestSubmissions = data.filter(({ tries, language }) => tries === maxTries && language.name === "Python3");
        setSubmissionData(bestSubmissions);

        const firstCorrectSubmission = bestSubmissions.find(({ evaluation }) => evaluation === 'CORRECT');

        if (firstCorrectSubmission) {
          const sourcecodeAluno = new SourceCode(token, firstCorrectSubmission.id);
          const codigoAluno = await sourcecodeAluno.getSourceCode();
          setSourceCodeData(codigoAluno);

          const teacherData = await submissionteacher.getSubmissions();

          // Filtrando as submissões corretas do professor
          const correctTeacherSubmissions = teacherData.filter(submission => submission.evaluation === 'CORRECT');

          // Encontrando o número máximo de tentativas do professor
          const maxTriesTeacher = Math.max(...correctTeacherSubmissions.map(({ tries }) => tries));

          // Filtrando as melhores submissões do professor (com o mesmo número máximo de tentativas e linguagem Python3)
          const bestTeacherSubmissions = correctTeacherSubmissions.filter(({ tries, language }) => tries === maxTriesTeacher && language.name === 'Python3');

          // Encontrando a primeira submissão correta do professor
          const firstCorrectSubmissionTeacher = bestTeacherSubmissions[0];


          if (firstCorrectSubmissionTeacher) {
            const sourcecodeTeacher = new SourceCode(token, firstCorrectSubmissionTeacher.id);
            const codigoProfessor = await sourcecodeTeacher.getSourceCode();
            setSourceCodeTeacherData(codigoProfessor);
          
            // Agora que você tem o código do professor, defina o estado codesLoaded como true
            setCodesLoaded(true);
          }
          
          // Fora do bloco anterior, verifique se os códigos foram carregados
          if (codesLoaded) {
            console.log(firstCorrectSubmissionTeacher);
            const alunoinfos = [{
              id: firstCorrectSubmission.id,
              codigo: sourceCodeData,
            }];
            const score = new ScoreSourceCode(idproblema, alunoinfos, sourceCodeTeacherData, nomeproblema, idturma, idtarefa, firstCorrectSubmissionTeacher.id);
            const pontuacao = await score.getScore();
            setPontuacao(pontuacao);
            setPontuacaoCarregando(false);
          }
           else {
            setPontuacaoCarregando(false);
          }
        } else {
          setPontuacaoCarregando(false);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setPontuacaoCarregando(false);
      }
    };

    fetchData();
  }, [token, idproblema, idusuario, idturma, idtarefa, nomeproblema, datalimite, codesLoaded]);

  function toggleLoading(userId) {
    setLoading((prevLoading) => ({
      ...prevLoading,
      [userId]: !prevLoading[userId], // Altera o estado de carregamento para um ID de usuário específico
    }));
  }

  return (
    <div>
      <Navbar />
      <Container>
        <h2>
          {nometurma} <KeyboardArrowRightIcon /> {nometarefa} <KeyboardArrowRightIcon /> {nomealuno} <KeyboardArrowRightIcon /> {nomeproblema}
        </h2>
        <Box mt={2}>
          <Paper elevation={3} style={{ marginBottom: '20px', padding: '16px' }}>
            <Typography variant="h5" component="div">
              Submissão ID: {submissionData.length > 0 ? submissionData[0].id : 'Carregando ID...'}
            </Typography>
            <Divider />
            <Grid container spacing={1}>
              <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" p={2}>
                <BasicCard text="Cyclomatic Complexity" value={pontuacao ? pontuacao[0].cyclomaticComplexity : "Carregando..."} exceedlimit={pontuacao ? pontuacao[0].exceededLimitCC : "Carregando..."} />
                <BasicCard text="Lines of Code" value={pontuacao ? pontuacao[0].linesOfCode : "Carregando..."} exceedlimit={pontuacao ? pontuacao[0].exceededLimitLOC : "Carregando..."} />
                <BasicCard text="Logical Lines of Code" value={pontuacao ? pontuacao[0].logicalLinesOfCode : "Carregando..."} exceedlimit={pontuacao ? pontuacao[0].exceededLimitLLOC : "Carregando..."} />
                <BasicCard text="Source Lines of Code" value={pontuacao ? pontuacao[0].sourceLinesOfCode : "Carregando..."} exceedlimit={pontuacao ? pontuacao[0].limitSLOC : "Carregando..."} />
                <BasicCard text="Final Score" value={pontuacao ? pontuacao[0].finalScore : "Carregando..."} />
              </Box>
              </Grid>
            </Grid>
            <Divider />
            <pre style={{ whiteSpace: 'pre-wrap', padding: '10px' }}>
              <Typography variant="h5" component="div">
                Código-fonte do Aluno
              </Typography>
              <pre style={{ whiteSpace: 'pre-wrap', padding: '10px', fontSize: '15px' }}>
                {sourceCodeData || 'Carregando código...'}
              </pre>
            </pre>
          </Paper>
        </Box>
          <Paper elevation={3} style={{ marginBottom: '20px', padding: '16px', fontSize: '15px' }}>
          <Typography variant="h5" component="div">
                Submissão do Professor
          </Typography>
          <Divider />
          <Grid container spacing={1}>
                <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" p={2}>
                  <BasicCard text="Cyclomatic Complexity" value={pontuacao ? pontuacao[1].cyclomaticComplexity : "Carregando..."} />
                  <BasicCard text="Lines of Code" value={pontuacao ? pontuacao[1].linesOfCode : "Carregando..."} />
                  <BasicCard text="Logical Lines of Code" value={pontuacao ? pontuacao[1].logicalLinesOfCode : "Carregando..."} />
                  <BasicCard text="Source Lines of Code" value={pontuacao ? pontuacao[1].sourceLinesOfCode : "Carregando..."} />
                  <BasicCard text="Final Score" value={pontuacao ? pontuacao[1].finalScore : "Carregando..."} />
                </Box>
                </Grid>
            </Grid>
          <Typography variant="h5" component="div">
            Código-fonte do Professor
          </Typography>
          <pre style={{ whiteSpace: 'pre-wrap', padding: '10px' }}>
            {sourceCodeTeacherData || 'Carregando código...'}
          </pre>
        </Paper>
      </Container>
    </div>
  );
};

export default Submissoes;
