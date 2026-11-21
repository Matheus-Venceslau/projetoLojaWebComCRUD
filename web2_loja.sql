CREATE DATABASE IF NOT EXISTS web2_loja
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE web2_loja;

CREATE TABLE IF NOT EXISTS categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
    estoque INT NOT NULL DEFAULT 0 CHECK (estoque >= 0),
    categoria_id INT NULL,
    CONSTRAINT fk_produto_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categoria(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

INSERT IGNORE INTO categoria (nome)
VALUES ('Informática'), ('Papelaria');

INSERT INTO produto (nome, preco, estoque)
SELECT dados.nome, dados.preco, dados.estoque
FROM (
    SELECT 'Teclado USB' AS nome, 89.90 AS preco, 15 AS estoque
    UNION ALL SELECT 'Mouse sem fio', 59.90, 30
    UNION ALL SELECT 'Caderno 10 mat.', 24.50, 50
    UNION ALL SELECT 'Caneta azul', 2.30, 200
) AS dados
WHERE NOT EXISTS (
    SELECT 1
    FROM produto p
    WHERE p.nome = dados.nome
);

CREATE USER IF NOT EXISTS 'app_web2'@'localhost'
IDENTIFIED BY 'senha';

GRANT SELECT, INSERT, UPDATE, DELETE
ON web2_loja.*
TO 'app_web2'@'localhost';

SELECT * FROM categoria;
SELECT * FROM produto;
