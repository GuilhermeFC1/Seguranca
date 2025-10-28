import { executeQuery } from "./database";

// CREATE - Inserir novo registro:
export const createUsuariofavorito = async (nome, idade, telefone) => {
    try {
        const result = await executeQuery(
            'INSERT INTO usuariofavorito (nome, idade, telefone) VALUES (?, ?, ?)',
            [nome, idade, telefone]
        );

        console.log('Registro inserido na tabela usuariofavorito:', result.insertId);
        return {
            success: true,
            id: result.insertId,
            message: 'Registro criado com sucesso!'
        };
    } catch (error) {
        console.error('Erro ao criar registro na tabela usuariofavorito:', error);
        return {
            success: false,
            error: error.message
        };
    }
    
};

// READ - Buscar todos os registros:
export const getAllUsuariofavorito = async () => {
    try {
        const result = await executeQuery(db, 'SELECT * FROM usuariofavorito ORDER BY created_at DESC');
        const registros = [];

        for (let i = 0; i < result.rows.length; i++) {
            registros.push(result.rows.item(i));
        }

        console.log('${registros.length} registros encontrados na tabela usuariofavorito.');
        return {
            success: true,
            data: registros
        };
    } catch (error) {
        console.error('Erro ao buscar registros da tabela usuariofavorito:', error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
};

// READ - Buscar registro por ID
export const getUsuariofavoritoById = async (id) => {
    try {
        const db = openDatabase();
        const result = await executeQuery(db, 'SELECT * FROM usuariofavorito WHERE id = ?', [id]);
        const registro = result.rows._array[0];

        if (registro) {
            return {
                success: true,
                data: registro
            };
        } else {
            return {
                success: false,
                error: 'Registro não encontrado'
            };
        }
    } catch (error) {
        console.error('Erro ao buscar registro por ID:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// UPDATE - Atualizar registro:
export const updateUsuariofavorito = async (id, nome, idade, telefone) => {
    try {
        const db = openDatabase();
        const result = await executeQuery(
            db,
            'UPDATE usuariofavorito SET nome = ?, idade = ?, telefone = ? WHERE id = ?',
            [nome, idade, telefone, id]
        );

        if (result.rowsAffected > 0) {
            console.log('Registro atualizado na tabela usuariofavorito:', id);
            return {
                success: true,
                message: 'Registro atualizado com sucesso!'
            };
        } else {
            return {
                success: false,
                error: 'Registro não encontrado'
            };
        }
    } catch (error) {
        console.error('Erro ao atualizar registro:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// DELETE - Excluir registro
export const deleteUsuariofavorito = async (id) => {
    try {
        const db = openDatabase();
        const result = await executeQuery(db, 'DELETE FROM usuariofavorito WHERE id = ?', [id]);

        if (result.rowsAffected > 0) {
            console.log('Registro excluído da tabela usuariofavorito:', id);
            return {
                success: true,
                message: 'Registro excluído com sucesso!'
            };
        } else {
            return {
                success: false,
                error: 'Registro não encontrado'
            };
        }
    } catch (error) {
        console.error('Erro ao excluir registro:', error);
        return {
            success: false,
            error: error.message
        };
    }
};