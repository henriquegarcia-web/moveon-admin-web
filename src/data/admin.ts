// src/types/categories.ts

// ======================================================== CATEGORIAS

export interface Subcategory {
  id: string
  name: string
  description?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  subcategories: Subcategory[]
}

export const SPORT_CATEGORIES_V1: Category[] = [
  {
    id: 'cat-001',
    name: 'Futebol',
    description: 'Tudo relacionado ao esporte mais popular do mundo.',
    subcategories: [
      {
        id: 'sub-001-01',
        name: 'Bolas de Futebol',
        description: 'Bolas oficiais, society e futsal.'
      },
      {
        id: 'sub-001-02',
        name: 'Chuteiras',
        description: 'Chuteiras para campo, society, futsal e infantis.'
      },
      {
        id: 'sub-001-03',
        name: 'Uniformes',
        description: 'Camisas, shorts, meiões e kits completos.'
      },
      {
        id: 'sub-001-04',
        name: 'Equipamentos de Treino',
        description: 'Cones, escadas de agilidade, coletes.'
      },
      {
        id: 'sub-001-05',
        name: 'Luvas de Goleiro',
        description: 'Luvas profissionais, amadoras e infantis.'
      },
      {
        id: 'sub-001-06',
        name: 'Acessórios',
        description: 'Caneleiras, mochilas, redes de gol.'
      },
      {
        id: 'sub-001-07',
        name: 'Produtos para Torcedores',
        description: 'Bandeiras, bonés, chaveiros.'
      }
    ]
  },
  {
    id: 'cat-002',
    name: 'Basquete',
    description: 'Produtos para prática e fãs de basquete.',
    subcategories: [
      {
        id: 'sub-002-01',
        name: 'Bolas de Basquete',
        description: 'Bolas para quadra interna, externa e infantil.'
      },
      {
        id: 'sub-002-02',
        name: 'Tênis de Basquete',
        description: 'Calçados especializados para quadra.'
      },
      {
        id: 'sub-002-03',
        name: 'Roupas de Basquete',
        description: 'Regatas, shorts, meias e acessórios.'
      },
      {
        id: 'sub-002-04',
        name: 'Aros e Redes',
        description: 'Aros fixos, móveis e redes de reposição.'
      },
      {
        id: 'sub-002-05',
        name: 'Equipamentos de Treino',
        description: 'Cones, barreiras, bolas medicinais.'
      },
      {
        id: 'sub-002-06',
        name: 'Produtos para Fãs',
        description: 'Camisetas de times, bonés, pôsteres.'
      }
    ]
  },
  {
    id: 'cat-003',
    name: 'Vôlei',
    description: 'Itens para vôlei de quadra e praia.',
    subcategories: [
      {
        id: 'sub-003-01',
        name: 'Bolas de Vôlei',
        description: 'Bolas para quadra, praia e infantil.'
      },
      {
        id: 'sub-003-02',
        name: 'Calçados de Vôlei',
        description: 'Tênis para quadra e sandálias para praia.'
      },
      {
        id: 'sub-003-03',
        name: 'Redes de Vôlei',
        description: 'Redes oficiais, recreativas e portáteis.'
      },
      {
        id: 'sub-003-04',
        name: 'Protetores',
        description: 'Joelheiras, cotoveleiras, munhequeiras.'
      },
      {
        id: 'sub-003-05',
        name: 'Roupas de Vôlei',
        description: 'Uniformes, shorts, tops.'
      },
      {
        id: 'sub-003-06',
        name: 'Acessórios',
        description: 'Bolsas, apitos, bombas de ar.'
      }
    ]
  },
  {
    id: 'cat-004',
    name: 'Ciclismo',
    description: 'Equipamentos e acessórios para ciclistas de todos os níveis.',
    subcategories: [
      {
        id: 'sub-004-01',
        name: 'Bicicletas',
        description: 'Mountain bikes, speed, urbanas, elétricas.'
      },
      {
        id: 'sub-004-02',
        name: 'Capacetes',
        description: 'Capacetes para estrada, trilha e infantil.'
      },
      {
        id: 'sub-004-03',
        name: 'Roupas de Ciclismo',
        description: 'Bretelles, camisas, luvas, jaquetas.'
      },
      {
        id: 'sub-004-04',
        name: 'Acessórios',
        description: 'Bombas, luzes, suportes, GPS.'
      },
      {
        id: 'sub-004-05',
        name: 'Peças de Reposição',
        description: 'Pneus, câmaras, correntes, freios.'
      },
      {
        id: 'sub-004-06',
        name: 'Ferramentas',
        description: 'Chaves, kits de reparo, lubrificantes.'
      },
      {
        id: 'sub-004-07',
        name: 'Equipamentos de Segurança',
        description: 'Coletes refletivos, campainhas.'
      }
    ]
  },
  {
    id: 'cat-005',
    name: 'Natação',
    description: 'Produtos para natação competitiva, recreativa e infantil.',
    subcategories: [
      {
        id: 'sub-005-01',
        name: 'Maiôs e Sungas',
        description: 'Roupas de banho para treino, competição e lazer.'
      },
      {
        id: 'sub-005-02',
        name: 'Óculos de Natação',
        description: 'Óculos antiembaçantes e polarizados.'
      },
      {
        id: 'sub-005-03',
        name: 'Toucas',
        description: 'Toucas de silicone, látex e tecido.'
      },
      {
        id: 'sub-005-04',
        name: 'Equipamentos de Treino',
        description: 'Pranchas, nadadeiras, snorkels, pull buoys.'
      },
      {
        id: 'sub-005-05',
        name: 'Acessórios',
        description: 'Bolsas impermeáveis, toalhas, clipes nasais.'
      },
      {
        id: 'sub-005-06',
        name: 'Produtos Infantis',
        description: 'Boias, coletes, óculos infantis.'
      }
    ]
  },
  {
    id: 'cat-006',
    name: 'Academia e Fitness',
    description: 'Equipamentos e acessórios para treino físico e bem-estar.',
    subcategories: [
      {
        id: 'sub-006-01',
        name: 'Halteres e Pesos',
        description: 'Pesos livres, ajustáveis, kettlebells.'
      },
      {
        id: 'sub-006-02',
        name: 'Roupas de Academia',
        description: 'Leggings, tops, tênis, luvas.'
      },
      {
        id: 'sub-006-03',
        name: 'Equipamentos Cardiovasculares',
        description: 'Esteiras, bicicletas ergométricas, elípticos.'
      },
      {
        id: 'sub-006-04',
        name: 'Acessórios de Treino',
        description: 'Colchonetes, elásticos, cordas, bolas suíças.'
      },
      {
        id: 'sub-006-05',
        name: 'Suplementos',
        description: 'Whey protein, BCAA, pré-treinos, vitaminas.'
      },
      {
        id: 'sub-006-06',
        name: 'Equipamentos de Yoga',
        description: 'Tapetes, blocos, cintos.'
      },
      {
        id: 'sub-006-07',
        name: 'Monitores de Atividade',
        description: 'Relógios fitness, medidores de frequência.'
      }
    ]
  },
  {
    id: 'cat-007',
    name: 'Tênis e Esportes de Raquete',
    description: 'Tudo para tênis, padel, squash e badminton.',
    subcategories: [
      {
        id: 'sub-007-01',
        name: 'Raquetes',
        description: 'Raquetes de tênis, padel, squash, badminton.'
      },
      {
        id: 'sub-007-02',
        name: 'Bolas',
        description: 'Bolas de tênis, petecas, bolas de squash.'
      },
      {
        id: 'sub-007-03',
        name: 'Calçados',
        description: 'Tênis para quadras de saibro, duras e grama.'
      },
      {
        id: 'sub-007-04',
        name: 'Roupas',
        description: 'Saias, polos, shorts, munhequeiras.'
      },
      {
        id: 'sub-007-05',
        name: 'Acessórios',
        description: 'Grips, cordas, redes, mochilas.'
      },
      {
        id: 'sub-007-06',
        name: 'Equipamentos de Treino',
        description: 'Lançadores de bola, cones.'
      }
    ]
  },
  {
    id: 'cat-008',
    name: 'Corrida',
    description: 'Produtos para corredores de rua, trilha e maratona.',
    subcategories: [
      {
        id: 'sub-008-01',
        name: 'Tênis de Corrida',
        description: 'Calçados para asfalto, trilha e minimalistas.'
      },
      {
        id: 'sub-008-02',
        name: 'Roupas de Corrida',
        description: 'Camisetas leves, shorts, meias de compressão.'
      },
      {
        id: 'sub-008-03',
        name: 'Acessórios de Corrida',
        description: 'Relógios GPS, cintos de hidratação, mochilas.'
      },
      {
        id: 'sub-008-04',
        name: 'Equipamentos de Segurança',
        description: 'Coletes refletivos, luzes, pulseiras.'
      },
      {
        id: 'sub-008-05',
        name: 'Suplementos para Corredores',
        description: 'Géis energéticos, isotônicos.'
      }
    ]
  },
  {
    id: 'cat-009',
    name: 'Artes Marciais',
    description: 'Equipamentos para artes marciais e lutas.',
    subcategories: [
      {
        id: 'sub-009-01',
        name: 'Kimono',
        description: 'Kimono para judô, jiu-jitsu, karatê, taekwondo.'
      },
      {
        id: 'sub-009-02',
        name: 'Luvas',
        description: 'Luvas de boxe, MMA, muay thai.'
      },
      {
        id: 'sub-009-03',
        name: 'Protetores',
        description: 'Caneleiras, protetores bucais, capacetes.'
      },
      {
        id: 'sub-009-04',
        name: 'Sacos de Pancada',
        description: 'Sacos, manoplas, suportes.'
      },
      {
        id: 'sub-009-05',
        name: 'Roupas de Treino',
        description: 'Rashguards, shorts, faixas.'
      },
      {
        id: 'sub-009-06',
        name: 'Acessórios',
        description: 'Cordas de pular, tatames portáteis.'
      }
    ]
  },
  {
    id: 'cat-010',
    name: 'Esportes Aquáticos',
    description: 'Produtos para surfe, stand-up paddle, mergulho e mais.',
    subcategories: [
      {
        id: 'sub-010-01',
        name: 'Pranchas',
        description: 'Pranchas de surfe, SUP, bodyboard, skimboard.'
      },
      {
        id: 'sub-010-02',
        name: 'Roupas de Neoprene',
        description: 'Wetsuits, rashguards, botas.'
      },
      {
        id: 'sub-010-03',
        name: 'Acessórios Aquáticos',
        description: 'Leash, remos, quilhas, capas.'
      },
      {
        id: 'sub-010-04',
        name: 'Equipamentos de Mergulho',
        description: 'Máscaras, snorkels, nadadeiras.'
      },
      {
        id: 'sub-010-05',
        name: 'Produtos de Segurança',
        description: 'Coletes salva-vidas, boias.'
      }
    ]
  },
  {
    id: 'cat-011',
    name: 'Esportes de Inverno',
    description: 'Equipamentos para esqui, snowboard e patinação.',
    subcategories: [
      {
        id: 'sub-011-01',
        name: 'Esquis',
        description: 'Esquis alpinos, cross-country, infantis.'
      },
      {
        id: 'sub-011-02',
        name: 'Pranchas de Snowboard',
        description: 'Snowboards para freeride e freestyle.'
      },
      {
        id: 'sub-011-03',
        name: 'Roupas de Frio',
        description: 'Jaquetas, calças térmicas, luvas.'
      },
      {
        id: 'sub-011-04',
        name: 'Patins',
        description: 'Patins de gelo e inline para hóquei ou lazer.'
      },
      {
        id: 'sub-011-05',
        name: 'Acessórios',
        description: 'Capacetes, óculos de proteção, wax.'
      }
    ]
  },
  {
    id: 'cat-012',
    name: 'Golfe',
    description: 'Produtos para prática e amantes do golfe.',
    subcategories: [
      {
        id: 'sub-012-01',
        name: 'Tacos de Golfe',
        description: 'Drivers, ferros, putters.'
      },
      {
        id: 'sub-012-02',
        name: 'Bolas de Golfe',
        description: 'Bolas novas e recicladas.'
      },
      {
        id: 'sub-012-03',
        name: 'Roupas de Golfe',
        description: 'Polos, calças, bonés.'
      },
      {
        id: 'sub-012-04',
        name: 'Acessórios',
        description: 'Bolsas, carrinhos, tees, luvas.'
      },
      {
        id: 'sub-012-05',
        name: 'Equipamentos de Treino',
        description: 'Redes, tapetes de prática.'
      }
    ]
  },
  {
    id: 'cat-013',
    name: 'Skate e Patins',
    description: 'Produtos para skatistas e patinadores.',
    subcategories: [
      {
        id: 'sub-013-01',
        name: 'Skates',
        description: 'Shapes, longboards, cruisers.'
      },
      {
        id: 'sub-013-02',
        name: 'Patins Inline',
        description: 'Patins para freestyle, fitness, velocidade.'
      },
      {
        id: 'sub-013-03',
        name: 'Roupas e Calçados',
        description: 'Tênis, camisetas, bonés.'
      },
      {
        id: 'sub-013-04',
        name: 'Peças de Reposição',
        description: 'Rodas, rolamentos, trucks.'
      },
      {
        id: 'sub-013-05',
        name: 'Equipamentos de Segurança',
        description: 'Capacetes, joelheiras, cotoveleiras.'
      }
    ]
  },
  {
    id: 'cat-014',
    name: 'Camping e Esportes Outdoor',
    description:
      'Equipamentos para atividades ao ar livre e esportes de aventura.',
    subcategories: [
      {
        id: 'sub-014-01',
        name: 'Barracas',
        description: 'Barracas para camping e trekking.'
      },
      {
        id: 'sub-014-02',
        name: 'Mochilas',
        description: 'Mochilas de trilha, cargueiras.'
      },
      {
        id: 'sub-014-03',
        name: 'Roupas Outdoor',
        description: 'Jaquetas impermeáveis, botas, chapéus.'
      },
      {
        id: 'sub-014-04',
        name: 'Equipamentos de Escalada',
        description: 'Cordas, mosquetões, capacetes.'
      },
      {
        id: 'sub-014-05',
        name: 'Acessórios',
        description: 'Lanternas, cantis, fogareiros.'
      },
      {
        id: 'sub-014-06',
        name: 'Equipamentos de Pesca',
        description: 'Varas, iscas, molinetes.'
      }
    ]
  },
  {
    id: 'cat-015',
    name: 'Esportes de Mesa',
    description: 'Produtos para jogos como ping-pong e sinuca.',
    subcategories: [
      {
        id: 'sub-015-01',
        name: 'Mesas',
        description: 'Mesas de ping-pong, sinuca, pebolim.'
      },
      {
        id: 'sub-015-02',
        name: 'Raquetes e Tacos',
        description: 'Raquetes de tênis de mesa, tacos de sinuca.'
      },
      {
        id: 'sub-015-03',
        name: 'Bolas',
        description: 'Bolas de ping-pong, sinuca.'
      },
      {
        id: 'sub-015-04',
        name: 'Acessórios',
        description: 'Redes, giz, suportes.'
      }
    ]
  },
  {
    id: 'cat-016',
    name: 'Outros Esportes e Produtos Relacionados',
    description: 'Itens genéricos ou de esportes menos comuns.',
    subcategories: [
      {
        id: 'sub-016-01',
        name: 'Equipamentos Diversos',
        description: 'Itens para esportes como rugby, críquete, hóquei.'
      },
      {
        id: 'sub-016-02',
        name: 'Roupas Genéricas',
        description: 'Roupas esportivas sem categoria específica.'
      },
      {
        id: 'sub-016-03',
        name: 'Acessórios Gerais',
        description: 'Bolsas, garrafas, toalhas esportivas.'
      },
      {
        id: 'sub-016-04',
        name: 'Produtos para Crianças',
        description: 'Brinquedos esportivos, mini bolas.'
      },
      {
        id: 'sub-016-05',
        name: 'Memorabilia Esportiva',
        description: 'Itens de coleção, autógrafos, réplicas.'
      },
      {
        id: 'sub-016-06',
        name: 'Equipamentos de Fisioterapia',
        description: 'Massageadores, faixas elásticas.'
      }
    ]
  }
]

// ======================================================== STATUS DE ANÚNCIO

export interface AdStatus {
  key: string
  label: string
  description: string
  color?: string
}

export const ADS_STATUS_TYPES: AdStatus[] = [
  {
    key: 'draft',
    label: 'Rascunho',
    description:
      'O anúncio foi iniciado, mas ainda não foi enviado para revisão ou publicação.',
    color: 'gray'
  },
  {
    key: 'pending',
    label: 'Pendente',
    description:
      'O anúncio foi enviado e aguarda revisão pela equipe de moderação.',
    color: 'orange'
  },
  {
    key: 'approved',
    label: 'Aprovado',
    description:
      'O anúncio foi revisado e aprovado, mas ainda não está visível publicamente.',
    color: 'blue'
  },
  {
    key: 'published',
    label: 'Publicado',
    description:
      'O anúncio está ativo e visível para todos os usuários na plataforma.',
    color: 'green'
  },
  {
    key: 'editing',
    label: 'Em Edição',
    description:
      'O anúncio publicado está sendo editado pelo vendedor e não está visível temporariamente.',
    color: 'yellow'
  },
  {
    key: 'rejected',
    label: 'Rejeitado',
    description:
      'O anúncio foi recusado pela moderação por violar regras (ex.: item proibido, fotos inadequadas).',
    color: 'red'
  },
  {
    key: 'expired',
    label: 'Expirado',
    description:
      'O anúncio atingiu o prazo máximo de publicação sem ser renovado.',
    color: 'purple'
  },
  {
    key: 'sold',
    label: 'Vendido',
    description:
      'O item foi vendido e o anúncio foi marcado como concluído pelo vendedor.',
    color: 'cyan'
  },
  {
    key: 'removed',
    label: 'Removido',
    description:
      'O anúncio foi excluído permanentemente pelo vendedor ou pela administração.',
    color: 'volcano'
  },
  {
    key: 'archived',
    label: 'Arquivado',
    description:
      'O anúncio foi movido para o arquivo após conclusão ou expiração, mas pode ser reativado.',
    color: 'geekblue'
  }
]

// ======================================================== CONDIÇÕES DO PRODUTO

export interface ProductCondition {
  key: string
  label: string
  description: string
  value?: number
}

export const PRODUCT_CONDITION_TYPES: ProductCondition[] = [
  {
    key: 'new',
    label: 'Novo',
    description:
      'Produto nunca usado, na embalagem original, com etiquetas e sem sinais de uso.',
    value: 1.0
  },
  {
    key: 'slightly-used',
    label: 'Pouco Usado - Seminovo',
    description:
      'Produto com leves sinais de uso (ex.: arranhões mínimos), mas plenamente funcional.',
    value: 0.85
  },
  {
    key: 'used',
    label: 'Usado',
    description:
      'Produto com sinais moderados de uso (ex.: desgaste visível), mas em bom estado geral.',
    value: 0.7
  },
  {
    key: 'well-used',
    label: 'Bem Usado',
    description:
      'Produto com sinais evidentes de uso (ex.: desgaste significativo), mas funcional.',
    value: 0.5
  },
  {
    key: 'worn',
    label: 'Desgastado',
    description:
      'Produto com desgaste acentuado, mas ainda utilizável com limitações.',
    value: 0.3
  },
  {
    key: 'damaged',
    label: 'Danificado',
    description:
      'Produto com defeitos ou danos que afetam o uso, mas pode ser reparado.',
    value: 0.2
  },
  {
    key: 'for-parts',
    label: 'Para Peças',
    description:
      'Produto não funcional, vendido para retirada de peças ou reparos.',
    value: 0.1
  },
  {
    key: 'refurbished',
    label: 'Recondicionado',
    description:
      'Produto usado que foi restaurado para funcionar como novo, com ou sem garantia.',
    value: 0.9
  }
]
