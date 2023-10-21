import axios from 'axios';

class User {
  constructor(token, codigoTarefa) {
    this.token = token;
    this.url = `http://localhost:5275/api/${codigoTarefa}/users`;
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    };
  }

  async getUsers(){
    try {
      const response = await axios.get(
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

export default User;