/**
 * Representa a classe de serviços do token de autenticação.
 * */
class Token {
    /**
     * @constructor
     * Carrega o token nas propriedades.
     * */
    constructor() {
      this.token = sessionStorage.getItem('token');
    }
  
    /**
     * Retorna o token que foi carregado na inicialização da classe.
     * @returns {string} Token cadastrado
     * */
    getToken() {
      if (!this.token) {
        this.token = sessionStorage.getItem('token');
      }
      return this.token;
    }
  
    /**
     * Define o token na classe e atualiza o sessionStorage.
     * @param {string} novoToken - Token que será cadastrado.
     * */
    definirToken(novoToken) {
      sessionStorage.setItem('token', novoToken);
      this.token = novoToken;
    }
  }
  
  export default Token;
  