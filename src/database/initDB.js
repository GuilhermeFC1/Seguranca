import { executeQuery } from "./database";

// Inicializa o banco de dados e cria as tabelas:
export const initDatabase = async () => {
    try {
        console.log('Iniciando banco de dados...');

        // Criar tabela 'idoso':
        await executeQuery(
            `CREATE TABLE IF NOT EXISTS idoso (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome VARCHAR(255) NOT NULL,
            idade VARCHAR(255) NOT NULL,
            cpf VARCHAR(255) NOT NULL,
            telefone VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );`
        );
        
        // Criar tabela 'usuario favorito':
        await executeQuery(
            `CREATE TABLE IF NOT EXISTS usuariofavorito(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome VARCHAR(255) NOT NULL,
            idade VARCHAR(255) NOT NULL,
            telefone VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );`
        );

        console.log('Banco de dados inicializado com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao inicializar banco de dados, tente novamente:', error);
        throw error;
    }
};

// Verificar se o banco está funcionando:
export const testDatabase = async () => {
    try {
        await executeQuery('SELECT 1 as test');
        console.log('Teste do banco de dados: OK');
        return true;
    } catch (error) {
        console.error('Teste do banco de dados falhou:', error);
        return false;
    }
};