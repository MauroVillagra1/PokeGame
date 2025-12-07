export const POKEMON_TYPES = [
  'normal', 'fuego', 'agua', 'eléctrico', 'planta', 'hielo',
  'lucha', 'veneno', 'tierra', 'volador', 'psíquico', 'bicho',
  'roca', 'fantasma', 'dragón', 'siniestro', 'acero', 'hada'
]

const TYPE_TRANSLATION = {
  'normal': 'normal',
  'fire': 'fuego',
  'water': 'agua',
  'electric': 'eléctrico',
  'grass': 'planta',
  'ice': 'hielo',
  'fighting': 'lucha',
  'poison': 'veneno',
  'ground': 'tierra',
  'flying': 'volador',
  'psychic': 'psíquico',
  'bug': 'bicho',
  'rock': 'roca',
  'ghost': 'fantasma',
  'dragon': 'dragón',
  'dark': 'siniestro',
  'steel': 'acero',
  'fairy': 'hada'
}

// Tabla de efectividad de tipos (desde perspectiva de ATAQUE)
// Cada tipo tiene: a qué tipos es súper efectivo, no muy efectivo, e inmune
const TYPE_EFFECTIVENESS = {
  normal: { 
    superEffective: [], 
    notVeryEffective: ['roca', 'acero'], 
    noEffect: ['fantasma'] 
  },
  fuego: { 
    superEffective: ['planta', 'hielo', 'bicho', 'acero'], 
    notVeryEffective: ['fuego', 'agua', 'roca', 'dragón'], 
    noEffect: [] 
  },
  agua: { 
    superEffective: ['fuego', 'tierra', 'roca'], 
    notVeryEffective: ['agua', 'planta', 'dragón'], 
    noEffect: [] 
  },
  eléctrico: { 
    superEffective: ['agua', 'volador'], 
    notVeryEffective: ['eléctrico', 'planta', 'dragón'], 
    noEffect: ['tierra'] 
  },
  planta: { 
    superEffective: ['agua', 'tierra', 'roca'], 
    notVeryEffective: ['fuego', 'planta', 'veneno', 'volador', 'bicho', 'dragón', 'acero'], 
    noEffect: [] 
  },
  hielo: { 
    superEffective: ['planta', 'tierra', 'volador', 'dragón'], 
    notVeryEffective: ['fuego', 'agua', 'hielo', 'acero'], 
    noEffect: [] 
  },
  lucha: { 
    superEffective: ['normal', 'hielo', 'roca', 'siniestro', 'acero'], 
    notVeryEffective: ['veneno', 'volador', 'psíquico', 'bicho', 'hada'], 
    noEffect: ['fantasma'] 
  },
  veneno: { 
    superEffective: ['planta', 'hada'], 
    notVeryEffective: ['veneno', 'tierra', 'roca', 'fantasma'], 
    noEffect: ['acero'] 
  },
  tierra: { 
    superEffective: ['fuego', 'eléctrico', 'veneno', 'roca', 'acero'], 
    notVeryEffective: ['planta', 'bicho'], 
    noEffect: ['volador'] 
  },
  volador: { 
    superEffective: ['planta', 'lucha', 'bicho'], 
    notVeryEffective: ['eléctrico', 'roca', 'acero'], 
    noEffect: [] 
  },
  psíquico: { 
    superEffective: ['lucha', 'veneno'], 
    notVeryEffective: ['psíquico', 'acero'], 
    noEffect: ['siniestro'] 
  },
  bicho: { 
    superEffective: ['planta', 'psíquico', 'siniestro'], 
    notVeryEffective: ['fuego', 'lucha', 'veneno', 'volador', 'fantasma', 'acero', 'hada'], 
    noEffect: [] 
  },
  roca: { 
    superEffective: ['fuego', 'hielo', 'volador', 'bicho'], 
    notVeryEffective: ['lucha', 'tierra', 'acero'], 
    noEffect: [] 
  },
  fantasma: { 
    superEffective: ['psíquico', 'fantasma'], 
    notVeryEffective: ['siniestro'], 
    noEffect: ['normal'] 
  },
  dragón: { 
    superEffective: ['dragón'], 
    notVeryEffective: ['acero'], 
    noEffect: ['hada'] 
  },
  siniestro: { 
    superEffective: ['psíquico', 'fantasma'], 
    notVeryEffective: ['lucha', 'siniestro', 'hada'], 
    noEffect: [] 
  },
  acero: { 
    superEffective: ['hielo', 'roca', 'hada'], 
    notVeryEffective: ['fuego', 'agua', 'eléctrico', 'acero'], 
    noEffect: [] 
  },
  hada: { 
    superEffective: ['lucha', 'dragón', 'siniestro'], 
    notVeryEffective: ['fuego', 'veneno', 'acero'], 
    noEffect: [] 
  }
}

const GENERATION_RANGES = {
  1: { start: 1, end: 151 },
  2: { start: 152, end: 251 },
  3: { start: 252, end: 386 },
  4: { start: 387, end: 493 },
  5: { start: 494, end: 649 },
  6: { start: 650, end: 721 },
  7: { start: 722, end: 809 },
  8: { start: 810, end: 905 }
}

export async function fetchPokemonByGeneration(generations) {
  const allPokemon = []
  
  for (const gen of generations) {
    const range = GENERATION_RANGES[gen]
    const promises = []
    
    for (let i = range.start; i <= Math.min(range.end, range.start + 50); i++) {
      promises.push(fetchPokemon(i))
    }
    
    const genPokemon = await Promise.all(promises)
    allPokemon.push(...genPokemon.filter(p => p !== null))
  }
  
  return allPokemon
}

async function fetchPokemon(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    if (!response.ok) return null
    
    const data = await response.json()
    
    // Obtener nombre en español
    const speciesResponse = await fetch(data.species.url)
    const speciesData = await speciesResponse.json()
    const spanishName = speciesData.names.find(n => n.language.name === 'es')?.name || data.name
    
    return {
      id: data.id,
      name: spanishName,
      types: data.types.map(t => TYPE_TRANSLATION[t.type.name] || t.type.name),
      sprite: data.sprites.other['official-artwork'].front_default || data.sprites.front_default
    }
  } catch (error) {
    console.error(`Error fetching pokemon ${id}:`, error)
    return null
  }
}

// Calcular daño OFENSIVO (cuando el Pokémon ataca)
export function getOffensiveRelations(attackerType) {
  const effectiveness = TYPE_EFFECTIVENESS[attackerType]
  
  if (!effectiveness) {
    return {
      superEffective: [],
      notVeryEffective: [],
      noEffect: [],
      neutral: []
    }
  }

  const superEffective = [...effectiveness.superEffective]
  const notVeryEffective = [...effectiveness.notVeryEffective]
  const noEffect = [...effectiveness.noEffect]
  
  const neutral = POKEMON_TYPES.filter(defenderType => 
    !superEffective.includes(defenderType) && 
    !notVeryEffective.includes(defenderType) && 
    !noEffect.includes(defenderType)
  )

  console.log(`Relaciones ofensivas para tipo ${attackerType}:`, {
    superEffective,
    notVeryEffective,
    noEffect,
    neutral,
    todosLosTipos: POKEMON_TYPES
  })

  return {
    superEffective,
    notVeryEffective,
    noEffect,
    neutral
  }
}

// Calcular daño DEFENSIVO (cuando el Pokémon recibe ataques)
export function getDefensiveRelations(pokemonTypes) {
  // Calcular multiplicadores de daño recibido
  const damageReceived = {}
  
  POKEMON_TYPES.forEach(attackType => {
    damageReceived[attackType] = 1
  })

  // Para cada tipo del Pokémon defensor
  pokemonTypes.forEach(defenseType => {
    // Buscar qué tipos son efectivos contra este tipo
    POKEMON_TYPES.forEach(attackType => {
      const attackEffectiveness = TYPE_EFFECTIVENESS[attackType]
      if (attackEffectiveness) {
        // Si este tipo de ataque es súper efectivo contra el tipo defensor
        if (attackEffectiveness.superEffective.includes(defenseType)) {
          damageReceived[attackType] *= 2
        }
        // Si este tipo de ataque es poco efectivo contra el tipo defensor
        if (attackEffectiveness.notVeryEffective.includes(defenseType)) {
          damageReceived[attackType] *= 0.5
        }
        // Si este tipo de ataque no afecta al tipo defensor
        if (attackEffectiveness.noEffect.includes(defenseType)) {
          damageReceived[attackType] = 0
        }
      }
    })
  })

  // Clasificar por multiplicador
  const takes4x = []
  const takes2x = []
  const takes1x = []
  const takes05x = []
  const takes025x = []
  const takes0x = []

  Object.entries(damageReceived).forEach(([attackType, multiplier]) => {
    if (multiplier === 0) {
      takes0x.push(attackType)
    } else if (multiplier === 0.25) {
      takes025x.push(attackType)
    } else if (multiplier === 0.5) {
      takes05x.push(attackType)
    } else if (multiplier === 1) {
      takes1x.push(attackType)
    } else if (multiplier === 2) {
      takes2x.push(attackType)
    } else if (multiplier === 4) {
      takes4x.push(attackType)
    }
  })

  return {
    takes4x,
    takes2x,
    takes1x,
    takes05x,
    takes025x,
    takes0x
  }
}
