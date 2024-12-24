import fs from "fs";
import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModel.js";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Define uma rota GET para listar todos os posts
export async function listarPosts(req, res) {
  // Obtém todos os posts do banco de dados
  const posts = await getTodosPosts();
  // Envia uma resposta HTTP com status 200 (OK) e os posts no formato JSON
  res.status(200).json(posts);
}

// Define uma rota POST para criar um novo post
export async function postarNovoPost(req, res) {
  // Extrai os dados do novo post do corpo da requisição
  const novoPost = req.body;

  // Tenta criar o novo post no banco de dados
  try {
    // Chama a função criarPost para inserir o novo post
    const postCriado = await criarPost(novoPost);
    // Envia uma resposta HTTP com status 200 (OK) e os dados do post criado
    res.status(200).json(postCriado);
  } catch (erro) {
    // Em caso de erro, registra a mensagem de erro no console
    console.error(erro.message);
    // Envia uma resposta HTTP com status 500 (Erro interno do servidor) e uma mensagem de erro genérica
    res.status(500).json({"Erro":"Falha na requisição"})
  }
}

export async function uploadImagem(req, res) {
    // Cria um novo objeto para representar o post a ser criado
    const novoPost = {
      descricao: "", // Descrição do post (pode ser preenchida posteriormente)
      imgUrl: req.file.originalname, // Nome original do arquivo da imagem (obtido do objeto req.file)
      alt: "" // Texto alternativo para a imagem (pode ser preenchido posteriormente)
    };
  
    // Bloco try-catch para tratar possíveis erros durante a execução
    try {
      // Chama a função criarPost para inserir o novo post no banco de dados
      const postCriado = await criarPost(novoPost);
  
      // Gera o novo nome do arquivo da imagem, utilizando o ID do post criado
      const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
  
      // Renomeia o arquivo da imagem para o novo nome, movendo-o para a pasta "uploads"
      fs.renameSync(req.file.path, imagemAtualizada);
  
      // Retorna uma resposta HTTP com status 200 (sucesso) e os dados do post criado
      res.status(200).json(postCriado);
    } catch(erro) {
      // Em caso de erro, imprime a mensagem de erro no console
      console.error(erro.message);
  
      // Retorna uma resposta HTTP com status 500 (erro interno do servidor) e uma mensagem de erro genérica
      res.status(500).json({"Erro":"Falha na requisição"});
    }
  }

  export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`
    const post = {
      imgUrl:urlImagem,
      descricao: req.body.descricao,
      alt: req.body.alt
    }
  
    try {
      const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
      const descricao = await gerarDescricaoComGemini(imgBuffer) 

      const post = {
        imgUrl:urlImagem,
        descricao: descricao,
        alt: req.body.alt
      }

      const postCriado = await atualizarPost(id, post);
      res.status(200).json(postCriado);
    } catch (erro) {
      console.error(erro.message);
      res.status(500).json({"Erro":"Falha na requisição"})
    }
  }