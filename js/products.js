// Catálogo de Produtos e Destaques — Casa Tia Rosa

const PRODUCTS_DATA = [
  {
    id: 1,
    name: 'Kit Cobreleito Cereja Casal',
    cat: 'Cama',
    price: 360.00,
    oldPrice: 420.00,
    installments: '3x de R$ 120,00 sem juros',
    img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=85',
    tag: 'Mais vendido',
    tagColor: 'bg-wine text-white',
    description: 'Confeccionado em micropercal 200 fios acetinado com toque de seda. Acompanha 2 portas-travesseiro matelados e detalhe em viés contrastante.',
    details: ['1 Cobreleito 2,40m x 2,20m', '2 Portas-travesseiros 70cm x 50cm', 'Tecido 100% hipoalergênico', 'Lavável em máquina']
  },
  {
    id: 2,
    name: 'Colcha Matelassê 200 Fios Queen',
    cat: 'Cama',
    price: 180.00,
    oldPrice: 220.00,
    installments: '3x de R$ 60,00 sem juros',
    img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=85',
    tag: 'Queridinho',
    tagColor: 'bg-rose text-wineDark',
    description: 'Leveza e sofisticação para os dias mais amenos. Acabamento ultrassônico que não solta fios com padronagem clássica floral.',
    details: ['1 Colcha Queen 2,60m x 2,40m', 'Toque macio aveludado', 'Secagem ultra rápida', 'Não precisa passar']
  },
  {
    id: 3,
    name: 'Cortina Blackout Linho Rústico 3,60m',
    cat: 'Cortinas',
    price: 220.00,
    oldPrice: 260.00,
    installments: '3x de R$ 73,33 sem juros',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85',
    tag: 'Prático',
    tagColor: 'bg-sage text-white',
    description: 'Bloqueia até 80% da luminosidade preservando a estética nobre do linho rústico. Ilhós cromados de alta durabilidade.',
    details: ['2 Folhas de 1,80m larg. x 2,50m alt.', 'Indicada para varão de até 2,80m', 'Ilhós cromado 28mm', 'Bloqueio de calor e luz']
  },
  {
    id: 4,
    name: 'Edredom Sherpa Toque Pele de Carneiro',
    cat: 'Cama',
    price: 240.00,
    oldPrice: 289.00,
    installments: '3x de R$ 80,00 sem juros',
    img: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=85',
    tag: 'Conforto',
    tagColor: 'bg-rose text-wineDark',
    description: 'O abraço mais quente do inverno. Dupla face: de um lado manta canelada aveludada e do outro sherpa fofinha.',
    details: ['1 Edredom Casal 2,40m x 2,20m', 'Enchimento plumado 300g/m²', 'Dupla face aconchegante', 'Hipoalergênico']
  },
  {
    id: 5,
    name: 'Tapete Artesanal Sala 1,40 × 2,00m',
    cat: 'Sala',
    price: 160.00,
    oldPrice: 195.00,
    installments: '3x de R$ 53,33 sem juros',
    img: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=85',
    tag: 'Novo',
    tagColor: 'bg-sage text-white',
    description: 'Feito em tear manual com fios de algodão sustentável. Base com pontos antiderrapantes para maior segurança da sua família.',
    details: ['Medida: 1,40m x 2,00m', 'Algodão reciclado premium', 'Acabamento em franjas feitas à mão', 'Lavável em ciclo suave']
  },
  {
    id: 6,
    name: 'Kit Toalhas de Banho Premium 5 Peças',
    cat: 'Banho',
    price: 119.90,
    oldPrice: 149.90,
    installments: '3x de R$ 39,96 sem juros',
    img: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=85',
    tag: 'Delicado',
    tagColor: 'bg-rose text-wineDark',
    description: 'Toalhas encorpadas em fio penteado 100% algodão com barra decorativa jacquard. Absorção imediata e toque carinhoso na pele.',
    details: ['2 Toalhas de Banho 70cm x 140cm', '2 Toalhas de Rosto 50cm x 80cm', '1 Piso atoalhado 50cm x 70cm', 'Gramatura 480g/m²']
  },
  {
    id: 7,
    name: 'Jogo de Lençol Solteirão 3 Peças 400 Fios',
    cat: 'Cama',
    price: 180.00,
    oldPrice: 210.00,
    installments: '3x de R$ 60,00 sem juros',
    img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=85',
    tag: 'Economize',
    tagColor: 'bg-wine text-white',
    description: 'Lençol com elástico reforçado em toda a borda para não escapar do colchão e fronha com aba americana.',
    details: ['1 Lençol com elástico (90cm x 190cm x 30cm)', '1 Lençol de cima plano (160cm x 240cm)', '1 Fronha (70cm x 50cm)', 'Não gera bolinhas']
  },
  {
    id: 8,
    name: 'Kit Almofadas Decorativas Boho (Par)',
    cat: 'Sala',
    price: 79.90,
    oldPrice: 99.00,
    installments: '3x de R$ 26,63 sem juros',
    img: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=800&q=85',
    tag: 'Destaque',
    tagColor: 'bg-sage text-white',
    description: 'Transforme o visual da sua sala instantaneamente com texturas bordadas e zíper invisível embutido.',
    details: ['2 Capas 45cm x 45cm', '2 Refis de fibra de silicone', 'Zíper invisível embutido', 'Tecido sarja aveludada']
  }
];

const STORIES_DATA = [
  {
    id: 'novidades',
    title: 'Novidades',
    icon: '✨',
    badge: 'Novo',
    img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    content: 'Chegaram novas estampas florais e cores quentes para aquecer a casa nesta estação!'
  },
  {
    id: 'mais-pedidos',
    title: 'Mais Pedidos',
    icon: '❤️',
    badge: 'Top',
    img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    content: 'Os queridinhos das nossas clientes: confira os kits de cobreleito campeões de vendas.'
  },
  {
    id: 'dicas-cuidado',
    title: 'Dicas de Cuidado',
    icon: '🧺',
    badge: 'Dicas',
    img: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=600&q=80',
    content: 'Como lavar suas toalhas e lençóis para ficarem sempre macios e cheirosos como novos.'
  },
  {
    id: 'sobre-rosa',
    title: 'Tia Rosa',
    icon: '🌸',
    badge: 'História',
    img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    content: 'Cada peça passa por uma curadoria pessoal feita com muito amor para seu lar.'
  }
];

const TESTIMONIALS_DATA = [
  {
    name: 'Mariana Silveira',
    city: 'Juazeiro do Norte',
    stars: '★★★★★',
    comment: 'O kit cobreleito cereja é perfeito! Tecido maravilhoso e a embalagem veio com um cheirinho de casa nova sem igual.',
    item: 'Kit Cobreleito Cereja'
  },
  {
    name: 'Cláudia Fontes',
    city: 'Crato',
    stars: '★★★★★',
    comment: 'Comprei pelo WhatsApp e o atendimento foi super atencioso. Chegou super rápido e bem embalado!',
    item: 'Kit Toalhas Premium'
  },
  {
    name: 'Renata Albuquerque',
    city: 'Barbalha',
    stars: '★★★★★',
    comment: 'A cortina blackout salvou meu quarto. Ficou lindo e aconchegante. Recomendo de olhos fechados!',
    item: 'Cortina Blackout'
  }
];
