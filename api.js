
// Cria o app e define porta 3000
const express = require('express');
const PORT = 3000 

const app = express();
app.use(express.json());
let { projetos } = require('./data');

app.listen(PORT, () => {
    console.log(`Api rodando na porta ${PORT}`);
});

// GET - Ler (buscar dados)
app.get('/', (req, res) => {
    res.send("Enviado pela api rest.");
});

// POST - Criar (inserir dados de um novo projeto)
app.post('/projetos', (req, res) => {
	try {
		const { novoProjeto } = req.body;
		if (!novoProjeto) {
			return res.status(400).json({message: 'Requisicao mal formulada'});
		}
		projetos.push(novoProjeto);
		res.status(201).json({message: 'Projeto criado com sucesso.'});
		console.log('Projeto criado com sucesso')
	} catch (error) {
		console.error('Ocorreu um erro ao criar o projeto', error);
		res.status(500).json({message: 'Erro ao criar projeto'});
	}
});

// GET - Ler (buscar dados de todos os projetos)
app.get('/projetos', (req, res) => {
	try {
		res.status(200).json(projetos);
	} catch (error) {
		console.error('Erro ao carregar projetos', error);
		res.status(500).json({message: 'Erro ao carregar projetos'});
	}
});

// DELETE - Deletar um projeto pelo id
app.delete('/projetos/:id', (req, res) => {
	try {
		const projetoId = Number(req.params.id);
		if (!projetoId) {
			return res.status(400).json({message: 'Tarefa não encontrada'});
		}
		let novoProjetos = [];
		novoProjetos = projetos.filter((projeto) => {
			if (projeto.id !== projetoId) {
				return projeto;
			}
		});
		projetos = novoProjetos;
		res.status(204);
	} catch (error) {
		console.error('Erro ao deletar projeto', error);
		res.status(500).json({message: 'Erro ao deletar projeto'});
	}
});

// PATCH - Atualizar parcialmente um projeto pelo id
app.patch('/projetos/:id', (req, res) => {
	// Fazer um merge patch dos elementos para substituir apenas aquilo que foi solicitado
	try {
		const projetoId = Number(req.params.id);
		const patchDados = req.body;
		const projetoIndex = projetos.findIndex(projeto => projeto.id === projetoId);
		if (projetoIndex === -1) {
			return res.status(404).json({message: 'Projeto não encontrado'});
		}
		const projetoExistente = projetos[projetoIndex];
		const projetoAtualizado = {
			...projetoExistente,
			...patchDados
		}
		if (patchDados.area_de_conhecimento) {
			projetoExistente.area_de_conhecimento = {
				...projetoExistente.area_de_conhecimento,
				...patchDados.area_de_conhecimento
			}
		}
		if (patchDados.corpo_do_plano_de_trabalho) {
			projetoExistente.corpo_do_plano_de_trabalho = {
				...projetoExistente.corpo_do_plano_de_trabalho,
				...patchDados.corpo_do_plano_de_trabalho
			}
		}
		projetos[projetoIndex] = projetoAtualizado;
		res.status(200).json({message: 'Dados modificados com sucesso'});
	} catch (error) {
		console.error('Erro ao atualizar dados', error);
		res.status(500).json({message: 'Erro ao atualizar dados'});
	}
	
});