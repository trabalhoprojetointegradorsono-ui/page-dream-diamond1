document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-feedback");
  const input = document.getElementById("comentario");
  const lista = document.getElementById("comentarios-lista");
  const dataFeedback = document.getElementById("data-feedback");
  const botoes = document.querySelectorAll(".avaliacao");

  let avaliacaoSelecionada = "neutro";

  function formatarData() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  function atualizarData() {
    dataFeedback.textContent = formatarData();
  }

  function carregarComentarios() {
    const comentarios = JSON.parse(localStorage.getItem("feedbacksServicos") || "[]");
    comentarios.forEach(adicionarComentarioNaTela);
  }

  function adicionarComentarioNaTela(comentario) {
    const artigo = document.createElement("article");
    artigo.className = "comentario-item";

    const imagem = document.createElement("img");
    imagem.src = "Imagens/Servicos/perfil.png";
    imagem.alt = "Foto do usuário";

    const conteudo = document.createElement("div");
    conteudo.className = "comentario-conteudo";

    const cabecalho = document.createElement("div");
    cabecalho.className = "comentario-cabecalho";

    const data = document.createElement("time");
    data.textContent = comentario.data;

    const avaliacao = document.createElement("span");
    avaliacao.className = `comentario-avaliacao ${comentario.avaliacao}`;

    const avaliacoes = {
      positivo: "Positivo",
      negativo: "Negativo",
      neutro: "Sem avaliação"
    };

    avaliacao.textContent = avaliacoes[comentario.avaliacao];

    const texto = document.createElement("p");
    texto.className = "comentario-texto";
    texto.textContent = comentario.texto;

    cabecalho.append(data, avaliacao);
    conteudo.append(cabecalho, texto);
    artigo.append(imagem, conteudo);

    lista.prepend(artigo);
  }

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      if (avaliacaoSelecionada === botao.dataset.avaliacao) {
        avaliacaoSelecionada = "neutro";
        botoes.forEach((item) => {
          item.classList.remove("ativo");
          item.setAttribute("aria-pressed", "false");
        });
        return;
      }

      avaliacaoSelecionada = botao.dataset.avaliacao;

      botoes.forEach((item) => {
        const selecionado = item === botao;
        item.classList.toggle("ativo", selecionado);
        item.setAttribute("aria-pressed", String(selecionado));
      });
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const texto = input.value.trim();

    if (!texto) {
      input.focus();
      return;
    }

    const comentario = {
      texto,
      avaliacao: avaliacaoSelecionada,
      data: formatarData()
    };

    adicionarComentarioNaTela(comentario);

    const comentarios = JSON.parse(localStorage.getItem("feedbacksServicos") || "[]");
    comentarios.push(comentario);
    localStorage.setItem("feedbacksServicos", JSON.stringify(comentarios));

    input.value = "";
    avaliacaoSelecionada = "neutro";
    botoes.forEach((botao) => {
      botao.classList.remove("ativo");
      botao.setAttribute("aria-pressed", "false");
    });
  });

  atualizarData();
  carregarComentarios();

  setInterval(atualizarData, 60000);
});
