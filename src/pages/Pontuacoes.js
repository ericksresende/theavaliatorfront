// import React from 'react'
// import { Box, Container, ListItem, ListItemText, ListItemButton } from '@mui/material'
// import Styles from '../pages/Turmas.css'
// import Navbar from './components/Navbar'
// import { FixedSizeList } from 'react-window'
// import Submission from '../services/Submission'
// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'

// const Pontuacoes = () => {
//   const [submissionData, setSubmissionData] = useState([]);
//   const token = sessionStorage.getItem('token');
//   console.log(token);
//   const idsubmissao = sessionStorage.getItem('idsubmissao');
//   const nomealuno = sessionStorage.getItem('nomealuno');
//   const submission = new Submission(token, idturma, idtarefa);
//   const navigate = useNavigate();
//   console.log(idtarefa);

// //   function acessarSubmissoes(id, title, token) {
// //     sessionStorage.setItem("id", id);
// //     sessionStorage.setItem("nomeproblema", title);
// //     sessionStorage.setItem("token", token);
// //     navigate("/submissoes"); // Navega para a rota "/turmas"
// //   }

//   useEffect(() => {
//     console.log(idtarefa);
//     submission.getSubmissions()
//       .then((data) => {
//         setSubmissionData(data);
//         console.log(submissionData);
//       });
//   }, []); // O segundo argumento vazio garante que o useEffect seja executado apenas uma vez, quando o componente for montado.

//   const turmas = [
//     { id: 1, name: 'Turma 1', qntd: 25 },
//     { id: 2, name: 'Turma 2', qntd: 50 },
//     { id: 3, name: 'Turma 3', qntd: 75 },
//     // Adicione mais itens aqui...
//   ];

//   return (
//     <React.Fragment>
//       <Navbar />
//       <Container style={{
//         width: "100vw",
//         height: "100vh",
//         background: "white",
//         alignItems: "center",
//       }}>
//         <h2>Lista de Submissões</h2>
//         <br></br>
//         <Box>
//           <Box style={{
//             background: "#243856",
//             padding: "25px",
//             borderRadius: '10px',
//             borderBottomLeftRadius: '0',
//             borderBottomRightRadius: '0',
//           }}>
//           </Box>
//           <div>
//             {submissionData.filter(item => item.evaluation === "CORRECT").map(({ id, user: {name}}) => (
//               <ListItem key={id} component="div" disablePadding secondaryAction={<ListItemText primary={"ID da Submissão: " + id} />} style={{
//                 border: "1px solid black"
//               }}>
//                 <ListItemButton component="a" >
//                 {/* onClick={() => acessarSubmissoes(id, name, token)} */}
//                   <ListItemText primary={name} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </div>
//         </Box>
//       </Container>
//     </React.Fragment>
//   )
// }

// export default Pontuacoes;
