import React, { useEffect, useState } from 'react';
import { 
  ScrollView,
  Alert, 
  KeyboardAvoidingView,
  Button,
  Platform,
  StyleSheet,
  View,
  Text,
  ActivityIndicator 
} from 'react-native';

//    Importações dos componentes
import Header from './src/components/Header';
import UserForm from './src/components/UserForm';
import PhotoPicker from './src/components/PhotoPicker';
import SymptomSelector from './src/components/SymptomSelector';
import SubmitButton from './src/components/SubmitButton';

// Importaações do banco de dados
import { initDatabase, testDatabase, createIdoso, getAllIdoso, countIdoso, createUsuariofavorito, getAllUsuariofavorito, clearAllData } from './src/database/asyncDB';

export default function App() {
  // Estados
  const [usuario, setUsuario] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [sintomasSelecionados, setSintomasSelecionados] = useState([]);
  const [foto, setFoto] = useState(null);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugData, setDebugData] = useState({ idoso: [], usuariofavorito: [] });
  

  // Inicializar banco de dados quando o app carregar
  useEffect(() => {
    initializeDB();
   }, []);

   const initializeDB = async () => {
      try {
        setLoading(true);
        console.log('Iniciando banco de dados...');

        await initDatabase();
        const teste = await testDatabase();

        if (teste) {
        setDbInitialized(true);
        console.log('Banco inicializado com sucesso!');


        const countResult = await countIdoso();
        if (countResult.success) {
          console.log(`Total de registros na tabela idoso: ${countResult.total}`);
        }

        } else {
          Alert.alert('Erro', 'Falha no teste do banco de dados');
        }

      } catch (error) {
          console.log('Erro na inicialização', error);
          Alert.alert('Erro', 'Erro no banco: ${error.message}');
      } finally {
        setLoading(false);
      }
   };

   // Função para formatar CPF:
   const handleFormatarCPF = (text) => {
    const numericText = text.replace(/\D/g, '');
    let formattedText = numericText;
    
    if (numericText.length > 3) {
      formattedText = numericText.replace(/(\d{3})(\d)/, '$1.$2');
    }
    if (numericText.length > 6) {
      formattedText = formattedText.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (numericText.length > 9) {
      formattedText = formattedText.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    }
    
    setCpf(formattedText.substring(0, 14));
  };

  // Função para formatar telefone:
  const handleFormatarTelefone = (text) => {
    const numericText = text.replace(/\D/g, '');
    let formattedText = numericText;

    if (numericText.length > 0) {
      formattedText = '(' + numericText.substring(0, 2);
    }
    if (numericText.length > 2) {
      formattedText += ')' + numericText.substring(2, 7);
    }
    if (numericText.length > 7) {
      formattedText += '-' + numericText.substring(7, 11);
    }

    setTelefone(formattedText);
  };

  // Função para validar telefone:
  const validarTelefone = (tel) => {
    const numeros = tel.replace(/\D/g, '');
    return numeros.length >= 10 && numeros.length <= 11;
  };

 // Função para salvar dados no banco:
 const salvarNoBanco = async () => {
    if (!dbInitialized) {
      Alert.alert('Atenção', 'Banco de dados não inicializado');
      return;
    }

    // Validar telefone:
    if (!validarTelefone(telefone)) {
      Alert.alert('Atenção', 'Por favor, insira um telefone válido');
      return;
    }

    try {
      setLoading(true);

      const resultadoIdoso = await createIdoso(usuario, cpf, telefone);

      if (!resultadoIdoso.success) {
        throw new Error(resultadoIdoso.error);
      }

      const resultadoUsuariofavorito = await createUsuariofavorito(
        `${usuario} - Cadastrado`,
        `Idade: ${cpf}`,
        telefone
      );

      if (!resultadoUsuariofavorito.success){
        throw new Error(resultadoUsuariofavorito.error);
      }

      const todosIdoso = await getAllIdoso();
      const todosUsuariofavorito = await getAllUsuariofavorito();

      Alert.alert(
        'Dados Salvos!',
        `Registros salvos com sucesso!\n\n` +
        `Nome: ${usuario}\n` +
        `CPF: ${cpf}\n` +
        `Telefone: ${telefone}\n` +
        `Sintomas: ${sintomasSelecionados.map(s => s.nome).join(', ')}\n\n` +
        `Tabela tal: ${todosTal.data.length} registros\n` +
        `Tabela taloutra: ${todosTaloutra.data.length} registros`,
        [{ text: 'OK' }]
      );

      console.log('Dados salvos:', {
        usuario,
        cpf,
        telefone,
        sintomas: sintomasSelecionados,
        idoso: todosIdoso.data,
        usuariofavorito: todosUsuariofavorito.data
      });

      if (showDebug) {
        setDebugData({
          idoso: todosIdoso.data,
          usuariofavorito: todosUsuariofavorito.data
        });
      }
      setUsuario('');
      setCpf('');
      setTelefone('');
      setSintomasSelecionados([]);
      setFoto(null);

    } catch (error) {
      console.error('Erro ao salvar no banco:', error);
      Alert.alert('Erro', 'Falha ao salvar dados: ${error.message}')
    } finally {
      setLoading(false);
    }  
  };


  const carregarDebugData = async () => {
    try {
      const todosIdoso = await getAllIdoso();
      const todosUsuariofavorito = await getAllUsuariofavorito();
      
      setDebugData({
        idoso: todosIdoso.data,
        usuariofavorito: todosUsuariofavorito.data
      });
      setShowDebug(true);
    } catch (error) {
      console.error('Erro ao carregar dados de debug:', error);
    }
  };
  
  const limparTodosDados = async () => {
    Alert.alert(
      'Limpar Dados',
      'Tem certeza que deseja apagar TODOS os dados? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar Tudo', 
          style: 'destructive',
          onPress: async () => {
            const resultado = await clearAllData();
            if (resultado.success) {
              Alert.alert('Sucesso', 'Todos os dados foram apagados');
              setDebugData({ idoso: [], usuariofavorito: [] });
              initializeDB();
            } else {
              Alert.alert('Erro', 'Falha ao limpar dados');
            }
          }
        }
      ]
    );
  };
  const enviarFormulario = () => {
    if (!validarFormulario()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
      return;
    }

    salvarNoBanco();
  };

  if (loading && !dbInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Inicializando banco de dados...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header />

        <View style={[
          styles.dbStatus, 
          dbInitialized ? styles.dbStatusSuccess : styles.dbStatusError
        ]}>
          <Text style={styles.dbStatusText}>
            {dbInitialized ? 'Banco AsyncStorage Conectado' : 'Banco Desconectado'}
          </Text>
        </View>

        <View style={styles.debugButtons}>
          <Button
            title={showDebug ? "Ocultar Debug": "Mostrar Debug"}
            onPress={() => setShowDebug(!showDebug)}
            color='#95a5a6'
          />
          <Button
            title='Limpar Tudo'
            onPress={limparTodosDados}
            color="#e74c3c"
          />   
        </View>

        {showDebug && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>📊 Dados Armazenados:</Text>
            <Text>Tabela idoso: {debugData.idoso.length} registros</Text>
            <Text>Tabela usuariofavorito: {debugData.usuariofavorito.length} registros</Text>
            <Button title="Atualizar Debug" onPress={carregarDebugData} />
          </View>
        )}

        <UserForm 
          usuario={usuario}
          setUsuario={setUsuario}
          cpf={cpf}
          setCpf={setCpf}
          telefone={telefone}
          setTelefone={setTelefone}
          formatarCPF={handleFormatarCPF}
          formatarTelefone={handleFormatarTelefone}
        />

        <PhotoPicker 
          foto={foto}
          setFoto={setFoto}
        />
        
        <SymptomSelector 
          sintomasSelecionados={sintomasSelecionados}
          setSintomasSelecionados={setSintomasSelecionados}
        />
        
        <SubmitButton 
          onPress={enviarFormulario} 
          disabled={loading || !dbInitialized}
        />

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={styles.loadingOverlayText}>Salvando...</Text>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  dbStatus: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  dbStatusSuccess: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  dbStatusError: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  dbStatusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  debugButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  debugContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  loadingOverlayText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
});
