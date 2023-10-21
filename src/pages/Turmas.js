import React from 'react'
import { Box, Container, ListItem, ListItemText, ListItemButton } from '@mui/material'
import '../pages/css/Base.module.css'
import Navbar from './components/Navbar'
import { FixedSizeList } from 'react-window'
import Classes from '../services/Classes'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom'
import FolderIcon from '@mui/icons-material/Folder';
import SendIcon from '@mui/icons-material/Send';

const Turmas = () => {

  // Instanciando as variáveis que serão utilizadas

  // Variável da lista de turmas
  const [classesData, setClassesData] = useState([]);
  // Puxando o token
  const token = sessionStorage.getItem('token');
  // Instanciando a classe referente ao serviço das Turmas
  const classes = new Classes(token);
  // Instanciando a classe que irá realizar a navegação
  const navigate = useNavigate();

  // Função que irá realizar a navegação   
  function acessarTurma(id, name, token) {
    sessionStorage.setItem("idturma", id);
    sessionStorage.setItem("nometurma", name);
    sessionStorage.setItem("token", token);
    navigate("/tarefas");
  }

  // Função que irá puxar a lista de turmas
  useEffect(() => {
    classes.getClasses()
      .then((data) => {
        setClassesData(data);
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
        <h2>Lista de Turmas</h2>
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
            {classesData.map(({ id, name}) => (
              <ListItem key={id} component="div" disablePadding secondaryAction={<ListItemButton component="a" onClick={() => acessarTurma(id, name, token)}>
              <SendIcon/>
            </ListItemButton>} style={{ padding: "5px",
                borderBottom: "1px solid black", borderLeft: "1px solid black", borderRight: "1px solid black",
              }}>
                <FolderIcon/>
                <ListItemText primary={name} style={{marginLeft: "5px"}}/>
              </ListItem>
            ))}
      
          </div>
        </Box>
      </Container>
    </React.Fragment>
  )
}

export default Turmas;
