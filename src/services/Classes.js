import api from './Api';

// Pega a lista de turmas e precisa do token para realizar a requisição

class Classes {
  constructor(token) {
    this.token = token;
    this.url = '/classes';
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    };
  }
  
  async getClasses(){
    try {
      const response = await api.get(
        this.url,
        this.config
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro na solicitação: ', error);
      throw error;
    }
  }
}

export default Classes;
