import express from 'express';
import 'dotenv/config';
import pool from './db.js';

const app = express();
const PORT = Number(process.env.PORT || 3000);

// Middlewares
app.use(express.json());
app.use(express.static('public'));

/*
Por que concatenar a entrada seria perigoso?

Se você colocasse diretamente o texto digitado pelo usuário dentro da consulta SQL, alguém poderia inserir comandos SQL maliciosos.
Por exemplo, uma entrada maliciosa poderia tentar alterar a consulta para acessar ou modificar dados indevidamente.
Com ? e pool.execute(), o valor da busca é tratado como dado, e não como parte do comando SQL
*/

// GET /produtos
// GET /produtos?busca=tec
app.get('/produtos', async (req, res) => {
    try {
        const busca = String(req.query.busca ?? '').trim();

        let sql = `
            SELECT
                p.id,
                p.nome,
                p.preco,
                p.estoque,
                p.categoria_id,
                c.nome AS categoria
            FROM produto p
            LEFT JOIN categoria c
                ON c.id = p.categoria_id
        `;

        const parametros = [];

        if (busca) {
            sql += ' WHERE p.nome LIKE ?';
            parametros.push(`%${busca}%`);
        }

        sql += ' ORDER BY p.id';

        const [produtos] = await pool.execute(sql, parametros);

        res.json(produtos);

    } catch (erro) {
        console.error('Erro ao buscar produtos:', erro);

        res.status(500).json({
            erro: 'Erro ao buscar produtos.'
        });
    }
});

// GET /categorias
app.get('/categorias', async (req, res) => {
    try {
        const [categorias] = await pool.execute(
            'SELECT id, nome FROM categoria ORDER BY nome'
        );

        res.json(categorias);

    } catch (erro) {
        console.error('Erro ao buscar categorias:', erro);

        res.status(500).json({
            erro: 'Erro ao buscar categorias.'
        });
    }
});

// POST /categorias
app.post('/categorias', async (req, res) => {
    try {
        const nome = String(req.body.nome ?? '').trim();

        if (!nome || nome.length > 100) {
            return res.status(400).json({
                erro: 'Informe um nome válido para a categoria.'
            });
        }

        const [resultado] = await pool.execute(
            'INSERT INTO categoria (nome) VALUES (?)',
            [nome]
        );

        res.status(201).json({
            id: resultado.insertId,
            nome
        });

    } catch (erro) {
        console.error('Erro ao cadastrar categoria:', erro);

        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                erro: 'Essa categoria já existe.'
            });
        }

        res.status(400).json({
            erro: 'Não foi possível cadastrar a categoria.'
        });
    }
});

// DELETE /produtos/:id
app.delete('/produtos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: 'ID do produto inválido.'
            });
        }

        const [resultado] = await pool.execute(
            'DELETE FROM produto WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: 'Produto não encontrado.'
            });
        }

        res.status(204).end();

    } catch (erro) {
        console.error('Erro ao excluir produto:', erro);

        res.status(500).json({
            erro: 'Não foi possível excluir o produto.'
        });
    }
});

// Tratamento de erros
app.use((erro, req, res, next) => {
    console.error(erro);

    if (res.headersSent) {
        return next(erro);
    }

    res.status(500).json({
        erro: 'Erro interno do servidor.'
    });
});

// Inicialização
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});