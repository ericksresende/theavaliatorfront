import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import Box from '@mui/system/Box';
import { useNavigate } from 'react-router-dom';
import Styles from './css/Login.module.css';
import BasicInput from './components/BasicInput';
import LoginButton from './components/LoginButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Auth from '../services/Auth';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function Login() {
  
  // Variável do username
  const [username, setUsername] = useState("");
  // Variável do password
  const [password, setPassword] = useState("");
  // Instanciando a função de navegação
  const navigate = useNavigate();
  // Variável da notificação de erro
  const [errorNotification, setErrorNotification] = useState(false);

  // Função para fazer login apertando Enter e funções de outras teclas
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleLogin();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  },);

  // Função que realiza o login e navega para a página de turmas
  function handleLogin() {
    Auth(username, password)
      .then((resposta) => {
        console.log(resposta);
        sessionStorage.setItem("token", resposta?.data.access_token);
        navigate("/turmas");
      })
      .catch((error) => {
        setErrorNotification(true);
      });
  }
  function handleClose() {
    setErrorNotification(false);
  }

  return (
    <div style={{backgroundColor: "#404040",}}>
      <Container style={{
        width: "100vw",
        height: "100vh",

        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}>

        <Snackbar open={errorNotification}>
          <Alert severity="error">
            <AlertTitle>Falha na autenticação</AlertTitle>
            Usuário ou senha incorretos
            <IconButton
              size="medium"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Alert>
        </Snackbar>


        <Box style={{
          width: "500px",
          height: "336px",
          background: "#243856",
        }}>
          <h3 className="title">The Avaliator</h3>
          <p>Preencha com as suas credenciais no The Huxley</p>
          <BasicInput text="Nome de usuário" type="text" captureUsername={(username) => setUsername(username)} />
          <BasicInput text="Senha" type="password" captureUsername={(password) => setPassword(password)} />
          <LoginButton text="ENTRAR" action={handleLogin} />
        </Box>
      </Container>
      </div>
  );
}

export default Login;
