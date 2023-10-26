import api from './Api';

/**
 * Realiza a autenticação do usuário.
 * @param {string} username - E-mail do usuário.
 * @param {string} password - Senha do usuário.
 * @returns {Promise} - Uma promessa que resolve com a resposta da solicitação.
 */
async function getToken(username, password) {
  return api.post(
    "/auth",
    {
      username,
      password,
    }
  );
}

export default getToken;
