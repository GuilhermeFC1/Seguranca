import { executeQuery } from "./database";

// CREATE - Inserir novo registro:
export const createIdoso = async (nome, idade, cpf, telefone) => {
    try {
        const result = await executeQuery(
            'INSERT INTO idoso (nome, idade, cpf, telefone) VALUES (?, ?, ?, ?)',
            [nome, idade, cpf, telefone]
        );

        console.log('Registro inserido na tabela idoso:', result.insertId);
        return {
            success: true,
            id: result.insertId,
            message: 'Registro criado com sucesso'
        };
    } catch (error) {
        console.error('Erro ao criar registro na tabela idoso:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// READ - Buscar todos os registros:
export const getAllIdoso = async () => {
    try {
        const result = await executeQuery('SELECT * FROM idoso ORDER BY created_at DESC');
        const registros = [];

        for(let i = 0; i < result.rows.length; i++) {
            registros.push(result.rows.item(i));
        }

        console.log('${registros.length} registros encontrados na tabela idoso');
        return {
            success: true,
            data: registros
        };
    } catch (error) {
        console.error('Erro ao buscar registros da tabela idoso:', error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
};


// READ - Buscar registro por ID:
export const getIdosoById = async (id) => {
    try {
        const result = await executeQuery('SELECT * FROM idoso WHERE id = ?', [id]);

        if (result.rows.length > 0) {
            const registro = result.rows.item(0);
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
    }   catch (error) {
        console.error('Erro ao buscar registro por ID:', error);
        return{
            success: false,
            error: error.message
        };
    }
};


// UPDATE - Atualizar registro:
export const updateIdoso = async (id, nome, idade, cpf, telefone) => {
    try {
        const result = await executeQuery(
            'UPDATE idoso SET nome = ?, idade = ?, cpf = ?, telefone =? WHERE id = ?',
            [nome, idade, cpf, telefone, id]
        );

        if (result.rowsAffected > 0) {
            console.log('Registro atualizado na tabela idoso:', id);
            return {
                success: true,
                message: 'Registro atualizado com sucesso'
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

//DELETE - Excluir registro
export const deleteIdoso = async (id) => {
    try {
        const result = await executeQuery('DELETE FROM idoso WHERE id = ?', [id]);

        if (result.rowsAffected > 0) {
            console.log('Registro excluído da tabela idoso:', id);
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

// Contar registros
export const countIdoso = async () => {
    try {
        const result = await executeQuery('SELECT COUNT(*) as total FROM idoso');
        const total = result.rows.item(0).total;

        return {
            success: true,
            total: total
        };
    } catch (error) {
        console.error('Erro ao contar registros:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
