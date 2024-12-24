// Importa o framework Express.js para criar a aplicação web.
import express from 'express';

// Importa as rotas definidas no arquivo postsRoutes.js.
import routes from './src/routes/postsRoutes.js';

// Cria uma instância do Express.js, que será o núcleo da aplicação.
const app = express();

app.use(express.static("uploads"));

// Registra as rotas definidas no arquivo postsRoutes.js na aplicação.
routes(app);

// Inicia o servidor Express.js na porta 3000 e exibe uma mensagem no console quando o servidor estiver pronto.
app.listen(3000, () => {
    console.log("Servidor escutando...");
});


function buscarPostPorID(id){
    return posts.findIndex((post) => {
        return post.id === Number(id);
    })
}

app.get("/posts/:id", (req,res) => {
    const index = buscarPostPorID(req.params.id);
    res.status(200).json(posts[index]);
});

