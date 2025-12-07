# 🎮 Pokémon Type Quiz

Juego web interactivo de preguntas sobre tipos de Pokémon completamente en español.

## 🚀 Cómo ejecutar

```bash
npm install
npm run dev
```

## 🎯 Características

### Pantalla Principal
- Botón grande "Jugar"
- Selector de generaciones (Gen 1-8)
- Tres niveles de dificultad:
  - 🟢 **Novato**: Botón de pista que selecciona el 50% de respuestas correctas + menos opciones
  - 🟡 **Intermedio**: Todas las opciones disponibles, sin ayudas
  - 🔴 **Avanzado**: Oculta los tipos del Pokémon (debes deducirlos por las preguntas)

### Mecánica del Juego
- 10 rondas por partida
- **Dos tipos de preguntas**:

#### Preguntas OFENSIVAS (Pokémon atacando):
- "Imagina que [Nombre del Pokémon] ataca con un ataque de tipo [tipo]"
- Para Pokémon de doble tipo, se selecciona aleatoriamente uno de sus tipos
- **En modo avanzado**: Los tipos del Pokémon están ocultos, pero el tipo del ataque se muestra
- Opciones:
  - **Súper efectivo**: Tipos que reciben x2 o x4 de daño
  - **Poco efectivo**: Tipos que reciben x0.5 o x0.25 de daño
  - **Neutro**: Tipos que reciben x1 de daño
  - **Sin efecto**: Tipos inmunes (x0)

#### Preguntas DEFENSIVAS (Pokémon recibiendo daño):
- "Imagina que tu Pokémon recibe un ataque y le realizan [multiplicador] de daño"
- Considera ambos tipos del Pokémon para calcular debilidades/resistencias
- Opciones:
  - **x4 de daño**: Doble debilidad
  - **x2 de daño**: Debilidad simple
  - **x1 de daño**: Daño normal
  - **x0.5 de daño**: Resistencia simple
  - **x0.25 de daño**: Doble resistencia
  - **x0 de daño**: Inmunidad
- **Selección múltiple**: Debes marcar TODAS las respuestas correctas
- Botón "Probar" para validar tu respuesta
- Hasta 18 opciones de tipos por pregunta
- Puedes presionar "Probar" sin seleccionar nada si la respuesta es "ninguno"
- **Sistema de pistas (solo Novato)**:
  - Botón "💡 Pista" disponible una vez por ronda
  - Si no hay respuestas correctas: Muestra mensaje "No hay ninguna opción correcta"
  - Si hay 1 respuesta: La selecciona automáticamente
  - Si hay múltiples: Selecciona el 50% de las correctas
- **Feedback educativo**:
  - ✅ Si aciertas: Avanza automáticamente en 1.5 segundos
  - ❌ Si fallas: Muestra las respuestas correctas y debes presionar "Siguiente" para continuar
- **Nombres de Pokémon en español** obtenidos de la PokeAPI
- **Tipos traducidos**: fuego, agua, planta, eléctrico, etc.

### Sistema de Puntuación
- **< 5 puntos**: "Tienes que practicar más" 😢
- **5-8 puntos**: "¡Eres increíble!" 😊
- **9-10 puntos**: "¡Eres un experto entrenador Pokémon!" 🔥

## 🔧 Tecnologías
- React 18
- Vite
- PokeAPI (con nombres en español)
- Sass/SCSS para estilos
- Animaciones CSS3
- Fondo temático de Pokémon

## 📦 Estructura
```
src/
├── components/
│   ├── HomeScreen.jsx      # Pantalla inicial
│   ├── HomeScreen.scss     # Estilos de pantalla inicial
│   ├── GameScreen.jsx      # Juego principal
│   ├── GameScreen.scss     # Estilos del juego
│   ├── ResultScreen.jsx    # Pantalla de resultados
│   └── ResultScreen.scss   # Estilos de resultados
├── utils/
│   └── pokeapi.js          # Lógica de API y tipos en español
├── App.jsx                 # Componente principal
├── App.scss                # Estilos globales y fondo
└── main.jsx                # Punto de entrada
```

## 🎨 Características de diseño
- Fondo degradado con imagen temática de Pokémon
- Estilos organizados con Sass/SCSS
- Variables para colores de tipos
- Animaciones suaves y transiciones
- Link al creador en la esquina inferior derecha
- Favicon personalizado con Pokébola
- Interfaz completamente en español
