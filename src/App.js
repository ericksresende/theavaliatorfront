import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Turmas from './pages/Turmas';
import Tarefas from './pages/Tarefas';
import Usuarios from './pages/Usuarios';
import Problemas from './pages/Problemas';
import Submissoes from './pages/Submissoes';

// Aqui são definidas as rotas da aplicação

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path='/' element={<Login />}/>
              <Route path='/turmas' element={<Turmas />}/>
              <Route path='/tarefas' element={<Tarefas />}></Route>
              <Route path='/alunos' element={<Usuarios />}></Route>
              <Route path='/problemas' element={<Problemas />}></Route>
              <Route path='/submissoes' element={<Submissoes />}></Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
