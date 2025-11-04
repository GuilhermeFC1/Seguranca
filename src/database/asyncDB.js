import AsyncStorage from "@react-native-async-storage/async-storage";

const IDOSO_TABLE = 'idoso_table';
const USUARIOFAVORITO_TABLE = 'usuariofavorito_table';

export const initDatabase = async () => {
    try {
        console.log('Inicializando banco de dados AsyncStorage...');

        const idosoData = await AsyncStorage.getItem(IDOSO_TABLE);
        if (!idosoData) {
            await AsyncStorage.setItem(IDOSO_TABLE, JSON.stringify([]));
        }

        const usuariofavoritoData = await AsyncStorage.getItem(USUARIOFAVORITO_TABLE);
        if (!usuariofavoritoData) {
            await AsyncStorage.setItem(USUARIOFAVORITO_TABLE, JSON.stringify([]));
        }

        console.log('Banco de dados AsyncStorage inicializado com sucesso!');
        return true;

    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
        throw error;
    }
};

// Funções para a tabela idosos:
export const createIdoso = async (nome, idade, telefone, cpf = '') => {
    try {
        const idosoData = await AsyncStorage.getItem(IDOSO_TABLE);
        const registros = idosoData ? JSON.parse(idosoData) : [];

        const newId = registros.length > 0 ? Math.max(...registros.map(r => r.id)) + 1 : 1;

        const novoRegistro = {
            id: newId,
            nome,
            idade,
            telefone,
            cpf,
            created_at: new Date().toISOString()
        };

        registros.push(novoRegistro);
        await AsyncStorage.setItem(IDOSO_TABLE, JSON.stringify(registros));

        console.log('Registro inserido na tabela idoso:', newId);
        return {
            success: true,
            id: newId,
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

export const getAllIdoso = async () => {
    try {
        const idosoData = await AsyncStorage.getItem(IDOSO_TABLE);
        const registros = idosoData ? JSON.parse(idosoData) : [];

        console.log(`${registros.length} registros encontrados na tabela idoso`);
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

export const getIdosoById = async (id) => {
    try {
        const idosoData = await AsyncStorage.getItem(IDOSO_TABLE);
        const registros = idosoData ? JSON.parse(idosoData) : [];
        const registro = registros.find(r => r.id === id);

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

export const updateIdoso = async (id, nome, idade, telefone) => {
    try {
        const idosoData = await AsyncStorage.getItem(IDOSO_TABLE);
        const registros = idosoData ? JSON.parse(idosoData) : []; 
        const index = registros.findIndex(r => r.id === id);

        if (index !== -1) {
            registros[index] = {
                ...registros[index],
                nome,
                idade,
                telefone
            };

            await AsyncStorage.setItem(IDOSO_TABLE, JSON.stringify(registros));
            console.log('Registro atualizado na tabela idoso', id);
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

export const deleteIdoso = async (id) => {
    try {
        const idosoData = await AsyncStorage.getItem(IDOSO_TABLE);
        const registros = idosoData ? JSON.parse(idosoData) : [];
        const filteredRegistros = registros.filter(r => r.id !== id);

        if (filteredRegistros.length < registros.length) {
            await AsyncStorage.setItem(IDOSO_TABLE, JSON.stringify(filteredRegistros));

            console.log('Registro excluído da tabela idoso:', id);
            return {
                success: true,
                message: 'Registro excluído com sucesso'
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

export const countIdoso = async () => {
  try {
    const idosoData = await AsyncStorage.getItem(IDOSO_TABLE);
    const registros = idosoData ? JSON.parse(idosoData) : [];
    
    return {
      success: true,
      total: registros.length
    };
  } catch (error) {
    console.error('Erro ao contar registros:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const createUsuariofavorito = async (nome, idade, telefone) => {
    try {
        const usuariofavoritoData = await AsyncStorage.getItem(USUARIOFAVORITO_TABLE);
        const registros = usuariofavoritoData ? JSON.parse(usuariofavoritoData) : [];

        const newId = registros.length > 0 ? Math.max(...registros.map(r => r.id)) + 1 : 1;

        const novoRegistro = {
            id: newId,
            nome,
            idade,
            telefone,
            created_at: new Date().toISOString()
        };

        registros.push(novoRegistro);
        await AsyncStorage.setItem(USUARIOFAVORITO_TABLE, JSON.stringify(registros));

        console.log('Registro inserido na tabela usuariofavorito:', newId);
        return {
            success: true,
            id: newId,
            message: 'Registro criado com sucesso'
        };
    } catch (error) {
        console.error('Erro ao criar registro na tabela usuariofavorito:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const getAllUsuariofavorito = async () => {
  try {
    const usuariofavoritoData = await AsyncStorage.getItem(USUARIOFAVORITO_TABLE);
    const registros = usuariofavoritoData ? JSON.parse(usuariofavoritoData) : [];
    
    console.log(`${registros.length} registros encontrados na tabela usuariofavorito`);
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

export const viewDatabase = async () => {
    try {
        const idosoData = await AsyncStorage.getItem(IDOSO_TABLE);
        const usuariofavoritoData = await AsyncStorage.getItem(USUARIOFAVORITO_TABLE);

        const idoso = idosoData ? JSON.parse(idosoData) : [];
        const usuariofavorito = usuariofavoritoData ? JSON.parse(usuariofavoritoData) : [];

        console.log('=== DADOS DA TABELA IDOSO ===');
        console.table(idoso);
        console.log('=== DADOS DA TABELA USUARIO FAVORITO ===');
        console.table(usuariofavorito);

        return {
            idoso,
            usuariofavorito
        };
    } catch (error) {
        console.error('Erro ao visualizar banco de dados:', error);
        return { idoso: [], usuariofavorito: [] };
    }
};

export const debugDatabase = async () => {
    try {
        const idosoData = await AsyncStorage.getItem(IDOSO_TABLE);
        const usuariofavoritoData = await AsyncStorage.getItem(USUARIOFAVORITO_TABLE);

        let idoso = [];
        let usuariofavorito = [];
        
        try {
            idoso = idosoData ? JSON.parse(idosoData) : [];
            if (!Array.isArray(idoso)) {
                console.warn('Dados de idosos não são um array, convertendo...');
                idoso = [];
            }
        } catch (parseError) {
            console.error('Erro ao fazer parse dos idosos:', parseError);
            idoso = [];
        }

        try{
            usuariofavorito = usuariofavoritoData ? JSON.parse(usuariofavoritoData) : [];
            if (!Array.isArray(usuariofavorito)) {
                console.warn('Dados de favoritos não são um array, convertendo...');
                usuariofavorito = [];
            }
        } catch (parseError) {
            console.error('Erro ao fazer parse dos favoritos:', parseError);
        }
        console.log('DEBUG DO BANCO DE DADOS');
        console.log('Idosos: ${idoso.length} registros');
        
        if(Array.isArray(idoso)) {
            idoso.forEach(idoso => {
                console.log('ID: ${idoso.id} | Nome: ${idoso.nome} | Idade: ${idoso.idade}');
            });
        } else {
            console.log('Dados de idosos não estão em formato de array');
        }

        console.log('Usuários Favoritos: ${usuariofavorito.length} registros');
        
        if(Array.isArray(usuariofavorito)) {
            usuariofavorito.forEach(usuariofavorito => {
                console.log('ID: ${usuariofavorito.id} | Nome: ${usuariofavorito.nome} | Idade: ${usuariofavorito.idade}');
            });
        } else {
            console.log('Dados de Usuário Favorito não estão em formato de array');
        }
        return {
            totalIdoso: Array.isArray(idoso) ? idoso.length : 0,
            totalUsuarioFavorito: Array.isArray(usuariofavorito) ? usuariofavorito.length : 0,
            idoso: Array.isArray(idoso) ? idoso : [],
            usuariofavorito: Array.isArray(usuariofavorito) ? usuariofavorito : []
        };    
    } catch (error) {
        console.error('Erro no debug:', error);
        return { totalIdoso: 0, totalUsuarioFavorito: 0, idoso: [], usuariofavorito: [] };
    }
};


// Teste do banco de dados
export const testDatabase = async () => {
  try {
    await initDatabase();
    console.log('Teste do banco de dados: OK');
    return true;
  } catch (error) {
    console.error('Teste do banco de dados falhou:', error);
    return false;
  }
};

// Limpar todos os dados 
export const clearAllData = async () => {
  try {
    await AsyncStorage.removeItem(IDOSO_TABLE);
    await AsyncStorage.removeItem(USUARIOFAVORITO_TABLE);
    console.log('Todos os dados foram limpos');
    return { success: true };
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return { success: false, error: error.message };
  }
};

