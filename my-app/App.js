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
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [usuario, setUsuario] = useState('');
  const [cpf, setCpf] = useState('');
  const [sintomas, setSintomas] = useState('');
  const [foto, setFoto] = useState(null);

  // Função para selecionar foto da galeria
  const selecionarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria!');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  // Função para tirar foto com a câmera
  const tirarFoto = async () => {
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

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
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
    if (!usuario || !cpf || !sintomas) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
      return;
    }

    const dados = {
      usuario,
      cpf,
      sintomas,
      foto: foto || 'Nenhuma foto selecionada'
    };

    Alert.alert(
      'Dados Salvos',
      `Usuário: ${dados.usuario}\nCPF: ${dados.cpf}\nSintomas: ${dados.sintomas}`,
      [{ text: 'OK' }]
    );

    // Aqui você pode enviar os dados para sua API
    console.log('Dados do formulário:', dados);
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
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva os sintomas observados..."
            value={sintomas}
            onChangeText={setSintomas}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Botão de Enviar */}
        <TouchableOpacity style={styles.botaoEnviar} onPress={enviarFormulario}>
          <Text style={styles.botaoEnviarTexto}>Salvar Cadastro</Text>
        </TouchableOpacity>
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
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