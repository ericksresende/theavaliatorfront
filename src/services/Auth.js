import axios from 'axios';

/**
 * Realiza a autenticação do usuário.
 * @param {string} username - E-mail do usuário.
 * @param {string} password - Senha do usuário.
 * @returns {Promise} - Uma promessa que resolve com a resposta da solicitação.
 */
async function getToken(username, password) {
  return axios.post(
    "http://localhost:5275/api/auth",
    {
      username,
      password,
    }
  );
}

export default getToken;
