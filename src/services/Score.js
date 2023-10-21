/* eslint-disable eqeqeq */
import axios from 'axios';


class Submission {
  constructor(token, idturma, idtarefa) {
    this.token = token;
    this.urlsource = `http://localhost:5275/api/submissions/${idturma}/${idtarefa}`;
    this.configsource = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    };
  }

  async getSubmissions(){
    const response = await axios.get(
        this.urlsource,
        this.configsource
      );
      console.log(response.data);
      return response.data;
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

export default Submission;