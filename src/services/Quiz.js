import api from './Api';

// Pega a lista de tarefas e utiliza o token e o ID da turma

class Quiz {
  constructor(token,idturma) {
    this.token = token;
    this.url = `/quiz/${idturma}`;
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    };
  }

  async getQuiz(){
    const response = await api.get(
        this.url,
        this.config
      );
      console.log(this.url);
      console.log(response.data);
      return response.data;
  }
}

export default Quiz;