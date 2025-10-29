import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import LoadingOverlay from '../components/LoadingOverlay';
import { createIdoso, createUsuariofavorito } from '../database/asyncDB';

const CadastroScreen = ({ navigation }) => {
  // Estados para Idoso
  const [nomeIdoso, setNomeIdoso] = useState('');
  const [cpfIdoso, setCpfIdoso] = useState('');
  const [idadeIdoso, setIdadeIdoso] = useState('');
  const [telefoneIdoso, setTelefoneIdoso] = useState('');

  // Estados para Usuário Favorito
  const [nomeFavorito, setNomeFavorito] = useState('');
  const [cpfFavorito, setCpfFavorito] = useState('');
  const [idadeFavorito, setIdadeFavorito] = useState('');
  const [telefoneFavorito, setTelefoneFavorito] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Função para formatar CPF
  const formatarCPF = (text, setCpf) => {
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

  // Função para formatar telefone
  const formatarTelefone = (text, setTelefone) => {
    const numericText = text.replace(/\D/g, '');
    let formattedText = numericText;

    if (numericText.length > 0) {
      formattedText = '(' + numericText.substring(0, 2);
    }
    if (numericText.length > 2) {
      formattedText += ') ' + numericText.substring(2, 7);
    }
    if (numericText.length > 7) {
      formattedText += '-' + numericText.substring(7, 11);
    }

    setTelefone(formattedText);
  };

  // Validar formulário
  const validarFormulario = () => {
    if (!nomeIdoso.trim()) {
      Alert.alert('Atenção', 'Preencha o nome do idoso');
      return false;
    }
    if (!cpfIdoso.trim() || cpfIdoso.replace(/\D/g, '').length !== 11) {
      Alert.alert('Atenção', 'CPF do idoso inválido');
      return false;
    }
    if (!idadeIdoso.trim()) {
      Alert.alert('Atenção', 'Preencha a idade do idoso');
      return false;
    }
    if (!telefoneIdoso.trim() || telefoneIdoso.replace(/\D/g, '').length < 10) {
      Alert.alert('Atenção', 'Telefone do idoso inválido');
      return false;
    }
    if (!nomeFavorito.trim()) {
      Alert.alert('Atenção', 'Preencha o nome do contato de emergência');
      return false;
    }
    if (!telefoneFavorito.trim() || telefoneFavorito.replace(/\D/g, '').length < 10) {
      Alert.alert('Atenção', 'Telefone do contato de emergência inválido');
      return false;
    }
    return true;
  };

  // Salvar cadastro
  const salvarCadastro = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      setLoadingMessage('Salvando cadastro...');

      // Salvar idoso
      const resultadoIdoso = await createIdoso(
        nomeIdoso, 
        idadeIdoso, 
        telefoneIdoso,
        cpfIdoso
      );

      if (!resultadoIdoso.success) {
        throw new Error(resultadoIdoso.error);
      }

      // Salvar usuário favorito
      const resultadoFavorito = await createUsuariofavorito(
        nomeFavorito,
        idadeFavorito || 'Não informado',
        telefoneFavorito,
        cpfFavorito
      );

      if (!resultadoFavorito.success) {
        throw new Error(resultadoFavorito.error);
      }

      setLoadingMessage('Finalizando...');
      await new Promise(resolve => setTimeout(resolve, 500));

      Alert.alert(
        'Sucesso!',
        'Cadastro realizado com sucesso!\n\n' +
        `Idoso: ${nomeIdoso}\n` +
        `Contato de Emergência: ${nomeFavorito}\n` +
        `Telefone: ${telefoneFavorito}`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              limparFormulario();
              navigation.goBack();
            }
          }
        ]
      );

    } catch (error) {
      console.error('Erro ao salvar cadastro:', error);
      Alert.alert('Erro', `Falha ao salvar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const limparFormulario = () => {
    setNomeIdoso('');
    setCpfIdoso('');
    setIdadeIdoso('');
    setTelefoneIdoso('');
    setNomeFavorito('');
    setCpfFavorito('');
    setIdadeFavorito('');
    setTelefoneFavorito('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Seção Idoso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados do Idoso</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome Completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome completo"
              value={nomeIdoso}
              onChangeText={setNomeIdoso}
              autoCapitalize='words'
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CPF *</Text>
            <TextInput
              style={styles.input}
              placeholder="000.000.000-00"
              value={cpfIdoso}
              onChangeText={(text) => formatarCPF(text, setCpfIdoso)}
              keyboardType="numeric"
              maxLength={14}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Idade *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 75"
              value={idadeIdoso}
              onChangeText={setIdadeIdoso}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone *</Text>
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              value={telefoneIdoso}
              onChangeText={(text) => formatarTelefone(text, setTelefoneIdoso)}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>
        </View>

        {/* Seção Usuário Favorito */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato de Emergência *</Text>
          <Text style={styles.sectionSubtitle}>
            Este contato receberá os alertas de emergência
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome Completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome completo"
              value={nomeFavorito}
              onChangeText={setNomeFavorito}
              autoCapitalize='words'
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CPF *</Text>
            <TextInput
              style={styles.input}
              placeholder="000.000.000-00"
              value={cpfFavorito}
              onChangeText={(text) => formatarCPF(text, setCpfFavorito)}
              keyboardType="numeric"
              maxLength={14}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Idade *</Text>
            <TextInput
              style={styles.input}
              placeholder="45"
              value={idadeFavorito}
              onChangeText={setIdadeFavorito}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone / WhatsApp *</Text>
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              value={telefoneFavorito}
              onChangeText={(text) => formatarTelefone(text, setTelefoneFavorito)}
              keyboardType="phone-pad"
              maxLength={15}
            />
            <Text style={styles.helperText}>
              O alerta será enviado para este número
            </Text>
          </View>
        </View>

        {/* Botões */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.btnSalvar}
            onPress={salvarCadastro}
          >
            <Text style={styles.btnText}>Salvar Cadastro</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.btnLimpar}
            onPress={limparFormulario}
          >
            <Text style={styles.btnTextSecondary}>Limpar Campos</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <LoadingOverlay visible={loading} message={loadingMessage} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
    fontStyle: 'italic',
  },
  buttonsContainer: {
    marginTop: 10,
  },
  btnSalvar: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnLimpar: {
    backgroundColor: '#95a5a6',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnTextSecondary: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CadastroScreen;