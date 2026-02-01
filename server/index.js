const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const app = express();

// Inicialización de Firestore (Detecta credenciales automáticamente en Cloud Run)
// En local necesitas configurar la variable GOOGLE_APPLICATION_CREDENTIALS
admin.initializeApp({
  credential: admin.credential.applicationDefault() 
});
const db = admin.firestore();

app.use(express.json());

// --- LÓGICA DE GAMIFICACIÓN (Niveles) ---

// Generador de ejercicios según nivel
const generateProblem = (level) => {
    // Generador de ternas pitagóricas simples (3-4-5, 6-8-10, 5-12-13)
    const triplets = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]];
    const [a, b, h] = triplets[Math.floor(Math.random() * triplets.length)];

    switch (parseInt(level)) {
        case 1:
            return {
                level: 1,
                type: "identify",
                question: "Identifica el Cateto Opuesto respecto al ángulo marcado.",
                data: { a: "A", b: "B", h: "H", anglePos: "top" },
                options: ["Lado A", "Lado B", "Hipotenusa"],
                correct: "Lado B"
            };
        case 2:
            return {
                level: 2,
                type: "calculate",
                question: `¿Cuál es el valor de sin(θ)? (Seno = Opuesto / Hipotenusa)`,
                data: { a, b, h, anglePos: "top" },
                options: [(b/h).toFixed(2), (a/h).toFixed(2), (b/a).toFixed(2)],
                correct: (b/h).toFixed(2)
            };
        case 3:
            // NIVEL 3: Teorema de Pitágoras para hallar la Hipotenusa
            return {
                level: 3,
                type: "pythagoras",
                question: `Si el Cateto A mide ${a} y el Cateto B mide ${b}, ¿cuánto mide la Hipotenusa?`,
                data: { a, b, h: "?", anglePos: "none" },
                options: [h.toString(), (a + b).toString(), (a * b / 2).toString(), "sqrt(a+b)"],
                correct: h.toString()
            };
        case 4:
            // NIVEL 4: Aplicación (Problema de la sombra/escalera)
            const angle = 30; // Ángulo fijo para simplificar
            const shadow = 10;
            // altura = shadow * tan(30) => 10 * 0.577 = 5.77
            const height = (shadow * Math.tan(angle * Math.PI / 180)).toFixed(1);
            
            return {
                level: 4,
                type: "application",
                question: `Un árbol proyecta una sombra de ${shadow}m con un ángulo de elevación de ${angle}°. ¿Cuál es su altura?`,
                data: { a: "?", b: shadow, h: "Tree", anglePos: "bottom" },
                options: [height, "10.0", "17.3", "5.0"],
                correct: height
            };
        default:
            return { level: 1, question: "Fin del juego", options: [] };
    }
};

// API: Obtener Problema
app.get('/api/problem/:level', (req, res) => {
    const level = req.params.level;
    const problem = generateProblem(level);
    res.json(problem);
});

// API: Guardar Progreso en Firestore
app.post('/api/progress', async (req, res) => {
    const { userId, level, score } = req.body;
    try {
        await db.collection('users').doc(userId).set({
            currentLevel: level,
            totalScore: admin.firestore.FieldValue.increment(score),
            lastPlayed: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- SERVIR EL FRONTEND (React) ---
// Cualquier petición que no sea API, devuelve el index.html de React
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor Trigono-Gamificado corriendo en puerto ${PORT}`);
});