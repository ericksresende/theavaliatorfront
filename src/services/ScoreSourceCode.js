/* eslint-disable eqeqeq */
import axios from 'axios';

class ScoreSourceCode {
  constructor(idproblema, codigoAluno, codigoProfessor, nomeProblema, idturma, idtarefa, IdSubmissaoProf) {
    this.urlsource = `https://bancotheavaliator-316d4dc95349.herokuapp.com/api/avaliarsubmissoes?idTurma=${idturma}&idTarefa=${idtarefa}&IdSubmissaoProf=${IdSubmissaoProf}`;
    this.configsource = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      };
    this.jsonData = {
      id: idproblema,
      alunos: codigoAluno,
      professor: codigoProfessor,
      problema: nomeProblema
    };
    this.jsonString = JSON.stringify(this.jsonData);
}   

async getScore() {
    try {
      const response = await axios.post(this.urlsource, this.jsonData);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error; // Lança o erro para ser tratado em níveis superiores
    }
  }
  

  // async obter(evaluations, max = '10', offset = '0', order = 'desc', problemId, sort = 'submissionDate', submissionDateGe, submissionDateLe) {
  //   let queryParams = [];

  //   if (evaluations) {
  //     queryParams.push(`evaluations=${evaluations}`);
  //   }

  //   queryParams.push(`max=${max}`);
  //   queryParams.push(`offset=${offset}`);
  //   queryParams.push(`order=${order}`);

  //   if (problemId) {
  //     queryParams.push(`problem=${problemId}`);
  //   }

  //   queryParams.push(`sort=${sort}`);

  //   if (submissionDateGe) {
  //     queryParams.push(`submissionDateGe=${submissionDateGe}`);
  //   }

  //   if (submissionDateLe) {
  //     queryParams.push(`submissionDateLe=${submissionDateLe}`);
  //   }

  //   const queryString = queryParams.join('&');
  //   const requestUrl = `${this.url}?${queryString}`;

  //   console.log(requestUrl);
  //   return axios.get(requestUrl, this.config);
  // }    
}

export default ScoreSourceCode;
