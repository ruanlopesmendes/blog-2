/* ===================================================
   1. BARRA DE PROGRESSO DE LEITURA NEON
   =================================================== */
window.addEventListener('scroll', () => {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  
  const progressBar = document.getElementById('progresso-barra');
  if (progressBar) {
    progressBar.style.width = scrolled + '%';
  }
});

/* ===================================================
   2. CONTADOR DE LIKES (LOCALSTORAGE)
   =================================================== */
const likeBtn = document.getElementById('likeBtn');
const likeCount = document.getElementById('likeCount');

if (likeBtn && likeCount) {
  // Recupera o valor salvo no LocalStorage
  let totalLikes = parseInt(localStorage.getItem('blogtech_ruan_likes')) || 0;
  likeCount.textContent = totalLikes;

  likeBtn.addEventListener('click', () => {
    totalLikes++;
    likeCount.textContent = totalLikes;
    localStorage.setItem('blogtech_ruan_likes', totalLikes);

    // Animação/Efeito de clique rápido
    likeBtn.style.transform = 'scale(0.95)';
    setTimeout(() => likeBtn.style.transform = 'scale(1)', 100);
  });
}

/* ===================================================
   3. BOTÃO VOLTAR AO TOPO (SMOOTH SCROLL)
   =================================================== */
const btnTopo = document.getElementById('btn-topo');

if (btnTopo) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btnTopo.classList.add('visivel');
    } else {
      btnTopo.classList.remove('visivel');
    }
  });

  btnTopo.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ===================================================
   4. EFEITO DE PARTÍCULAS INTERATIVAS (CANVAS 2D)
   =================================================== */
const canvas = document.getElementById('canvas-particulas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  let largura, altura;
  let particulasArray = [];

  function redimensionar() {
    largura = canvas.width = window.innerWidth;
    altura = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    redimensionar();
    init();
  });
  redimensionar();

  // Rastreio do cursor do rato para a repulsão interativa
  const mouse = {
    x: null,
    y: null,
    raio: 120
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Classe que representa cada partícula no ecran
  class Particula {
    constructor() {
      this.x = Math.random() * largura;
      this.y = Math.random() * altura;
      this.tamanho = Math.random() * 3 + 1;
      this.velocidadeX = (Math.random() - 0.5) * 1.5;
      this.velocidadeY = (Math.random() - 0.5) * 1.5;
      // Alterna entre as cores do tema (Vermelho Neon e Branco)
      this.cor = Math.random() > 0.3 ? '#ff003c' : '#ffffff';
    }

    desenhar() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
      ctx.fillStyle = this.cor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.cor;
      ctx.fill();
    }

    atualizar() {
      // Movimento contínuo
      this.x += this.velocidadeX;
      this.y += this.velocidadeY;

      // Inverter direção ao atingir as bordas
      if (this.x < 0 || this.x > largura) this.velocidadeX *= -1;
      if (this.y < 0 || this.y > altura) this.velocidadeY *= -1;

      // Repulsão com a aproximação do cursor do rato
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia < mouse.raio) {
          let angulo = Math.atan2(dy, dx);
          let forca = (mouse.raio - distancia) / mouse.raio;
          this.x -= Math.cos(angulo) * forca * 5;
          this.y -= Math.sin(angulo) * forca * 5;
        }
      }

      this.desenhar();
    }
  }

  // Gera a quantidade adequada de partículas proporcional ao tamanho da janela
  function init() {
    particulasArray = [];
    const numParticulas = Math.floor((largura * altura) / 9000);
    for (let i = 0; i < numParticulas; i++) {
      particulasArray.push(new Particula());
    }
  }

  // Desenha linhas conectoras entre partículas próximas
  function conectar() {
    for (let a = 0; a < particulasArray.length; a++) {
      for (let b = a; b < particulasArray.length; b++) {
        let dx = particulasArray[a].x - particulasArray[b].x;
        let dy = particulasArray[a].y - particulasArray[b].y;
        let distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia < 100) {
          let opacidade = 1 - (distancia / 100);
          ctx.strokeStyle = `rgba(255, 0, 60, ${opacidade * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particulasArray[a].x, particulasArray[a].y);
          ctx.lineTo(particulasArray[b].x, particulasArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Loop principal de animação
  function animar() {
    ctx.clearRect(0, 0, largura, altura);
    for (let i = 0; i < particulasArray.length; i++) {
      particulasArray[i].atualizar();
    }
    conectar();
    requestAnimationFrame(animar);
  }

  init();
  animar();
}
