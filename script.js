let posts = [];
let usuarios = [];

async function buscarPosts() {
  const resposta = await fetch('https://jsonplaceholder.typicode.com/posts');
  posts = await resposta.json();
  exibirPosts(posts);
}

async function buscarUsuarios() {
  const resposta = await fetch('https://jsonplaceholder.typicode.com/users');
  usuarios = await resposta.json();
  exibirUsuarios();
}

function exibirUsuarios() {
  const lista = document.getElementById('list-user');
  const selectCadastro = document.getElementById('f-vendedor');
  const selectEdicao = document.getElementById('edit-vendedor');

  lista.innerHTML = '';
  selectCadastro.innerHTML = '';
  selectEdicao.innerHTML = '';

  usuarios.forEach(function(usuario) {
    const item = document.createElement('li');
    item.textContent = usuario.name;
    lista.appendChild(item);

    const opcao1 = document.createElement('option');
    opcao1.value = usuario.id;
    opcao1.textContent = usuario.name;
    selectCadastro.appendChild(opcao1);

    const opcao2 = document.createElement('option');
    opcao2.value = usuario.id;
    opcao2.textContent = usuario.name;
    selectEdicao.appendChild(opcao2);
  });
}

function gerarDadosExtras(id) {
  const cores = ['Branco', 'Preto', 'Prata', 'Vermelho', 'Azul'];
  const status = ['disponivel', 'reservado', 'vendido'];

  return {
    ano: 2018 + (id % 7),
    cor: cores[id % cores.length],
    preco: 40000 + (id * 1300),
    status: status[id % status.length]
  };
}

function exibirPosts(lista) {
  const grid = document.getElementById('carros-grid');
  grid.innerHTML = '';

  lista.forEach(function(post) {
    const extras = gerarDadosExtras(post.id);

    const ano = post.ano || extras.ano;
    const cor = post.cor || extras.cor;
    const preco = post.preco || extras.preco;
    const status = post.status || extras.status;

    const vendedor = usuarios.find(u => u.id === post.userId);
    const nomeVendedor = vendedor ? vendedor.name : 'Sem vendedor';

    const card = document.createElement('article');
    card.className = 'car-card';
    card.dataset.id = post.id;

    card.innerHTML = `
      <div class="car-card-header">
        <span class="car-modelo">${post.title}</span>
        <span class="badge badge-${status}">${status}</span>
      </div>
      <div class="car-info">
        <span>📅 ${ano}</span>
        <span>🎨 ${cor}</span>
        <span>💰 R$ ${Number(preco).toLocaleString('pt-BR')}</span>
        <span>👤 ${nomeVendedor}</span>
      </div>
      <div class="car-actions">
        <button class="btn btn-primary" onclick="abrirEdicao(${post.id})">EDITAR</button>
        <button class="btn btn-cancel" onclick="removerCarro(${post.id})">REMOVER</button>
      </div>
    `;

    grid.appendChild(card);
  });

  atualizarEstatisticas();
}

function atualizarEstatisticas() {
  document.getElementById('stat-total').textContent = posts.length;

  const disponiveis = posts.filter(p => {
    const extras = gerarDadosExtras(p.id);
    const status = p.status || extras.status;
    return status === 'disponivel';
  });

  const vendidos = posts.filter(p => {
    const extras = gerarDadosExtras(p.id);
    const status = p.status || extras.status;
    return status === 'vendido';
  });

  document.getElementById('stat-disp').textContent = disponiveis.length;
  document.getElementById('stat-vend').textContent = vendidos.length;
}

function removerCarro(id) {
  posts = posts.filter(p => p.id !== id);
  exibirPosts(posts);
}

function cadastrarCarro() {
  const modelo = document.getElementById('f-modelo').value.trim();
  const ano = document.getElementById('f-ano').value;
  const cor = document.getElementById('f-Cor').value.trim();
  const preco = document.getElementById('f-preco').value;
  const status = document.getElementById('f-status').value;
  const userId = Number(document.getElementById('f-vendedor').value);

  if (!modelo || !ano || !cor || !preco) {
    alert('Preencha todos os campos!');
    return;
  }

  const novoId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;

  const novoCarro = {
    id: novoId,
    title: modelo,
    ano: Number(ano),
    cor: cor,
    preco: Number(preco),
    status: status,
    userId: userId
  };

  posts.push(novoCarro);
  exibirPosts(posts);

  document.getElementById('f-modelo').value = '';
  document.getElementById('f-ano').value = '';
  document.getElementById('f-Cor').value = '';
  document.getElementById('f-preco').value = '';
}

document.getElementById('btn-cadastrar').addEventListener('click', cadastrarCarro);

buscarPosts();
buscarUsuarios();