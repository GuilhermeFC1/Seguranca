// Sistema de banco usando WebSQL
let db = null;

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    console.log('Iniciando banco de dados WebSQL...');
    
    // WebSQL é nativamente suportado no React Native
    db = window.openDatabase('meuapp.db', '1.0', 'Meu App Database', 5 * 1024 * 1024);
    
    if (!db) {
      reject(new Error('Não foi possível abrir o banco de dados'));
      return;
    }

    console.log('Banco de dados WebSQL aberto com sucesso!');
    resolve(db);
  });
};

export const executeQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    initDatabase().then(database => {
      database.transaction(tx => {
        tx.executeSql(
          sql,
          params,
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            console.error('Erro SQL:', error, 'Query:', sql);
            reject(error);
          }
        );
      });
    }).catch(reject);
  });
};