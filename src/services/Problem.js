import api from './Api';

// Pega a lista de problemas e utiliza o token, o ID da tarefa e o ID do usuario

class Problem {
  constructor(token, codigoTarefa, codigoUsuario) {
    this.token = token;
    this.url = `/${codigoTarefa}/${codigoUsuario}/problems`;
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    };
  }

  async getProblems(){
    try {
      const response = await api.get(
        this.url,
        this.config
      );
      return response.data;
    } catch (error) {
      console.error('Erro na solicitação: ', error);
      throw error; // Lançar o erro para que possa ser tratado em outro lugar, se necessário.
    }
  }
}

export default Problem;