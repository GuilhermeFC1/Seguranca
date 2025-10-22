import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [usuario, setUsuario] = useState('');
  const [cpf, setCpf] = useState('');
  const [sintomasSelecionados, setSintomasSelecionados] = useState([]);
  const [foto, setFoto] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);

  // Lista de sintomas pré-definidos
  const listaSintomas = [
    { id : '1', nome: 'Febre', icone: '🌡'},
    { id : '2', nome: 'Dor de Cabeça', icone: '🤕'},
    { id : '3', nome: 'Tontura', icone: '💫'},
    { id : '4', nome: 'Falta de Ar', icone: '😮‍💨'},
    { id : '5', nome: 'Náusea', icone: '🤢'},
    { id : '6', nome: 'Dor no Corpo', icone: '😣'},
    { id : '7', nome: 'Fraqueza', icone: '🙍‍♂'},
    { id : '8', nome: 'Confusão Mental', icone: '🧠'},
    { id : '9', nome: 'Palpitações', icone: '💓'},
    { id : '10', nome: 'Suor Excessivo', icone: '😰'},
    { id : '11', nome: 'Calafrios', icone: '🥶'},
    { id : '12', nome: 'Dormência', icone: '🫨'},
    { id : '13', nome: 'Dor no peito', icone: '🫀'},
    { id : '14', nome: 'Visão turva', icone: '😵‍💫'},
    { id : '15', nome: 'Falta de visão', icone: '😵'},
    { id : '16', nome: 'Dificuldade em falar', icone: '😶'},
    { id : '17', nome: 'Perda de sentido', icone: '🫥'},
  ];

  // Função simplificada para selecionar/deselecionar sintomas
  const toggleSintoma = (sintoma) => {
    // Verifica se o sintoma já está selecionado
    const index = sintomasSelecionados.findIndex(s => s.id === sintoma.id);
    
    if (index > -1) {
      // Remove o sintoma se já estiver selecionado
      const novosSintomas = [...sintomasSelecionados];
      novosSintomas.splice(index, 1);
      setSintomasSelecionados(novosSintomas);
    } else {
      // Adiciona o sintoma se não estiver selecionado
      setSintomasSelecionados([...sintomasSelecionados, sintoma]);
    }
  };

  // Função para selecionar foto da galeria
  const selecionarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria!');
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
        setFoto(resultado.assets[0].uri);
        console.log("Foto selecionada:", resultado.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a foto');
    }
  };

  // Função para tirar foto com a câmera
  const tirarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua câmera!');
        return;
      }

      const resultado = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!resultado.canceled && resultado.assets && resultado.assets[0]) {
        setFoto(resultado.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto');
    }
  };

  // Função para formatar CPF
  const formatarCPF = (text) => {
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

  // Função para enviar formulário
  const enviarFormulario = () => {
    if (!usuario || !cpf || sintomasSelecionados.length === 0) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
      return;
    }

    const dados = {
      usuario,
      cpf,
      sintomas: sintomasSelecionados.map(s => s.nome).join(', '),
      foto: foto || 'Nenhuma foto selecionada'
    };

    Alert.alert(
      'Dados Salvos',
      `Usuário: ${dados.usuario}\nCPF: ${dados.cpf}\nSintomas: ${dados.sintomas}`,
      [{ text: 'OK' }]
    );

    console.log('Dados do formulário:', dados);
  };

  // Função para verificar se um sintoma está selecionado
  const isSintomaSelecionado = (sintomaId) => {
    return sintomasSelecionados.some(s => s.id === sintomaId);
  };

  // Função para renderizar a lista de sintomas em grid
  const renderSintomasGrid = () => {
    const rows = [];
    for (let i = 0; i < listaSintomas.length; i += 2) {
      const sintoma1 = listaSintomas[i];
      const sintoma2 = listaSintomas[i + 1];
      
      rows.push(
        <View key={i} style={styles.sintomasRow}>
          {/* Primeiro sintoma da linha */}
          <TouchableOpacity
            style={[
              styles.itemSintoma,
              isSintomaSelecionado(sintoma1.id) && styles.itemSintomaSelecionado
            ]}
            onPress={() => toggleSintoma(sintoma1)}
          >
            <Text style={styles.iconeSintoma}>{sintoma1.icone}</Text>
            <Text style={[
              styles.nomeSintoma,
              isSintomaSelecionado(sintoma1.id) && styles.nomeSintomaSelecionado
            ]}>
              {sintoma1.nome}
            </Text>
          </TouchableOpacity>
          
          {/* Segundo sintoma da linha (se existir) */}
          {sintoma2 && (
            <TouchableOpacity
              style={[
                styles.itemSintoma,
                isSintomaSelecionado(sintoma2.id) && styles.itemSintomaSelecionado
              ]}
              onPress={() => toggleSintoma(sintoma2)}
            >
              <Text style={styles.iconeSintoma}>{sintoma2.icone}</Text>
              <Text style={[
                styles.nomeSintoma,
                isSintomaSelecionado(sintoma2.id) && styles.nomeSintomaSelecionado
              ]}>
                {sintoma2.nome}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.titulo}>Sistema de Segurança</Text>
        <Text style={styles.subtitulo}>Cadastro do Idoso</Text>

        {/* Campo de Usuário */}
        <View style={styles.campoContainer}>
          <Text style={styles.label}>Nome do Usuário *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome completo"
            value={usuario}
            onChangeText={setUsuario}
          />
        </View>

        {/* Campo de CPF */}
        <View style={styles.campoContainer}>
          <Text style={styles.label}>CPF *</Text>
          <TextInput
            style={styles.input}
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={formatarCPF}
            keyboardType="numeric"
            maxLength={14}
          />
        </View>

        {/* Seção de Foto */}
        <View style={styles.campoContainer}>
          <Text style={styles.label}>Foto do Usuário</Text>
          <View style={styles.fotoContainer}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.foto} />
            ) : (
              <View style={styles.fotoPlaceholder}>
                <Text style={styles.fotoPlaceholderText}>Nenhuma foto</Text>
              </View>
            )}
          </View>
          
          <View style={styles.botoesFotoContainer}>
            <TouchableOpacity style={styles.botaoFoto} onPress={selecionarFoto}>
              <Text style={styles.botaoTexto}>Galeria</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.botaoFoto} onPress={tirarFoto}>
              <Text style={styles.botaoTexto}>Câmera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Campo de Sintomas */}
        <View style={styles.campoContainer}>
          <Text style={styles.label}>Sintomas *</Text>
          
          {/* Botão para abrir o modal de sintomas */}
          <TouchableOpacity 
            style={styles.botaoSelecionarSintomas}
            onPress={() => setModalVisivel(true)}
          >
            <Text style={styles.botaoSelecionarTexto}>
              {sintomasSelecionados.length > 0 
                ? `${sintomasSelecionados.length} sintoma(s) selecionado(s)` 
                : 'Selecionar Sintomas'
              }
            </Text>
          </TouchableOpacity>

          {/* Lista de sintomas selecionados */}
          {sintomasSelecionados.length > 0 && (
            <View style={styles.sintomasSelecionadosContainer}>
              <Text style={styles.sintomasSelecionadosTitulo}>
                Sintomas selecionados:
              </Text>
              <View style={styles.sintomasTags}>
                {sintomasSelecionados.map(sintoma => (
                  <View key={sintoma.id} style={styles.tagSintoma}>
                    <Text style={styles.tagTexto}>
                      {sintoma.icone} {sintoma.nome}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Botão de Enviar */}
        <TouchableOpacity style={styles.botaoEnviar} onPress={enviarFormulario}>
          <Text style={styles.botaoEnviarTexto}>Salvar Cadastro</Text>
        </TouchableOpacity>

        {/* Modal de Seleção de Sintomas */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisivel}
          onRequestClose={() => setModalVisivel(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalConteudo}>
              <View style={styles.modalCabecalho}>
                <Text style={styles.modalTitulo}>Selecione os Sintomas</Text>
                <TouchableOpacity 
                  style={styles.botaoFecharModal}
                  onPress={() => setModalVisivel(false)}
                >
                  <Text style={styles.botaoFecharTexto}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.listaSintomasContainer}
                showsVerticalScrollIndicator={false}
              >
                {renderSintomasGrid()}
              </ScrollView>

              <TouchableOpacity 
                style={styles.botaoConfirmar}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.botaoConfirmarTexto}>
                  Confirmar ({sintomasSelecionados.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  campoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  // Estilos para Foto
  fotoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  foto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#3498db',
  },
  fotoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#bdc3c7',
    borderStyle: 'dashed',
  },
  fotoPlaceholderText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  botoesFotoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  botaoFoto: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  botaoTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilos para Sintomas
  botaoSelecionarSintomas: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  botaoSelecionarTexto: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  sintomasSelecionadosContainer: {
    marginTop: 10,
  },
  sintomasSelecionadosTitulo: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  sintomasTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagSintoma: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 3,
  },
  tagTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  // Estilos do Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalConteudo: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  botaoFecharModal: {
    padding: 5,
  },
  botaoFecharTexto: {
    fontSize: 20,
    color: '#7f8c8d',
  },
  listaSintomasContainer: {
    maxHeight: 400,
  },
  sintomasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemSintoma: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  itemSintomaSelecionado: {
    backgroundColor: '#e3f2fd',
    borderColor: '#3498db',
  },
  iconeSintoma: {
    fontSize: 20,
    marginRight: 8,
  },
  nomeSintoma: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  nomeSintomaSelecionado: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  botaoConfirmar: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoConfirmarTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Botão Enviar
  botaoEnviar: {
    backgroundColor: '#27ae60',
    padding: 18,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  botaoEnviarTexto: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});