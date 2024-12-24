import express from "express";
import multer from "multer";
import cors from "cors";
import { atualizarNovoPost, listarPosts, postarNovoPost, uploadImagem } from "../controllers/postsController.js";

const corsOptions = {
  origin:"http://localhost:8000",
  optionsSuccessStatus: 200 
}

// Configura o armazenamento de arquivos enviados pelo usuário
const storage = multer.diskStorage({
  // Define o diretório de destino para os arquivos
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Arquivos serão salvos na pasta 'uploads'
  },
  // Define o nome do arquivo a ser salvo
  filename: function (req, file, cb) {
    cb(null, file.originalname); // O arquivo será salvo com o nome original
  }
});

// Cria uma instância do multer com as configurações de armazenamento
const upload = multer({dest:"./uploads", storage});

// Função para configurar as rotas da aplicação
const routes = (app) => {
  // Habilita o middleware para analisar o corpo das requisições JSON
  app.use(express.json());
  app.use(cors(corsOptions))

  // Rota para listar todos os posts
  app.get("/posts", listarPosts); // Chama a função listarPosts do controlador para buscar os posts
  
  // Rota para criar um novo post
  app.post("/posts", postarNovoPost); // Chama a função postarNovoPost do controlador para criar um novo post
  
  // Rota para fazer upload de uma imagem
  app.post("/upload", upload.single("imagem"), uploadImagem);
    // O middleware `upload.single('imagem')` configura o multer para lidar com um único arquivo com o nome 'imagem'
    // A função uploadImagem do controlador será chamada após o upload do arquivo

  app.put("/upload/:id", atualizarNovoPost)
};

export default routes;