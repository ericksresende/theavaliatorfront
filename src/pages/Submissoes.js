import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, Button, Card, CardContent, Grid, Divider } from '@mui/material';
import BasicCard from './components/Card';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Navbar from './components/Navbar';
import Submission from '../services/Submission';
import SubmissionTeacher from '../services/SubmissionTeacher';
import SourceCode from '../services/SourceCode';

const Submissoes = () => {
  const [submissionData, setSubmissionData] = useState([]);
  const [sourceCodeData, setSourceCodeData] = useState('');
  const [sourceCodeTeacherData, setSourceCodeTeacherData] = useState('');
  const token = sessionStorage.getItem('token');
  const idproblema = sessionStorage.getItem('idproblema');
  const nometarefa = sessionStorage.getItem('nometarefa');
  const nometurma = sessionStorage.getItem('nometurma');
  const nomealuno = sessionStorage.getItem('nomealuno');
  const nomeproblema = sessionStorage.getItem('nomeproblema');
  const idusuario = sessionStorage.getItem('idusuario');
  const datalimite = sessionStorage.getItem('datalimite');
  const submission = new Submission(token, idproblema, idusuario, datalimite);
  const submissionteacher = new SubmissionTeacher(token, idproblema);

  useEffect(() => {
    submission.getSubmissions()
      .then((data) => {
        const maxTries = Math.max(...data.map(({ tries }) => tries));
        const bestSubmissions = data.filter(({ tries }) => tries === maxTries);
        setSubmissionData(bestSubmissions);

        const firstCorrectSubmission = bestSubmissions.find(({ evaluation }) => evaluation === 'CORRECT');

        if (firstCorrectSubmission) {
          const sourcecodeAluno = new SourceCode(token, firstCorrectSubmission.id);
          sourcecodeAluno.getSourceCode()
            .then((codigo) => {
              setSourceCodeData(codigo);
            })
            .catch((error) => {
              console.error('Erro ao buscar o código-fonte do aluno', error);
            });

          submissionteacher.getSubmissions()
            .then((teacherData) => {
              const firstCorrectSubmissionTeacher = teacherData.find(({ evaluation }) => evaluation === 'CORRECT');
              if (firstCorrectSubmissionTeacher) {
                const sourcecodeTeacher = new SourceCode(token, firstCorrectSubmissionTeacher.id);
                sourcecodeTeacher.getSourceCode()
                  .then((codigo) => {
                    setSourceCodeTeacherData(codigo);
                  })
                  .catch((error) => {
                    console.error('Erro ao buscar o código-fonte do professor', error);
                  });
              }
            });
        }
      });
  }, []);

  const submissionDataExample = {
    id: 1,
    name: 'Nome do Aluno',
    code: 'Código-fonte da submissão aqui',
    scores: {
      cyclomaticComplexity: '5',
      exceededLimitCC: 'NO',
      linesOfCode: '12',
      exceededLimitLOC: 'NO',
      logicalLinesOfCode: '11',
      exceededLimitLLOC: 'NO',
      sourceLinesOfCode: '11',
      limitSLOC: 'NO',
      finalScore: '104.8',
    },
  };

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
                  <BasicCard text="Cyclomatic Complexity" value = {submissionDataExample.scores.cyclomaticComplexity} exceedlimit = {submissionDataExample.scores.exceededLimitCC}/>
                  <BasicCard text="Lines of Code" value = {submissionDataExample.scores.linesOfCode} exceedlimit = {submissionDataExample.scores.exceededLimitLOC}/>
                  <BasicCard text="Logical Lines of Code" value = {submissionDataExample.scores.logicalLinesOfCode} exceedlimit = {submissionDataExample.scores.exceededLimitLLOC}/>
                  <BasicCard text="Source Lines of Code" value = {submissionDataExample.scores.sourceLinesOfCode} exceedlimit = {submissionDataExample.scores.limitSLOC}/>
                  <BasicCard text="Final Score" value = {submissionDataExample.scores.finalScore}/>




                </Box>
              </Grid>
            </Grid>
            <Divider />
            <pre style={{ whiteSpace: 'pre-wrap', padding: '10px' }}>
              <Typography variant="h5" component="div">
                Código-fonte do Aluno
              </Typography>
              <pre style={{ whiteSpace: 'pre-wrap', padding: '10px', fontSize:'15px',}}>
                {sourceCodeData || 'Carregando código...'}
              </pre>
            </pre>
          </Paper>
        </Box>
        <Paper elevation={3} style={{ marginBottom: '20px', padding: '16px', fontSize:'15px', }}>
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
}

export default Submissoes;
