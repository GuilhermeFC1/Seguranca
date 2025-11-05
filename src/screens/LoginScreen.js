import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import LoadingOverlay from '../components/LoadingOverlay';
import { getAllIdoso, getAllUsuariofavorito } from '../database/asyncDB';

const LoginScreen = ({ navigation }) => {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

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

  // Validar CPF
  const validarCPF = () => {
    const cpfNumeros = cpf.replace(/\D/g, '');
    
    if (cpfNumeros.length !== 11) {
      Alert.alert('Atenção', 'CPF deve conter 11 dígitos');
      return false;
    }
    
    return true;
  };

  // Fazer login
  const fazerLogin = async () => {
    if (!validarCPF()) return;

    try {
      setLoading(true);
      setLoadingMessage('Verificando cadastro...');

      const cpfNumeros = cpf.replace(/\D/g, '');

      // Buscar idoso pelo CPF
      const resultIdosos = await getAllIdoso();
      
      if (!resultIdosos.success) {
        throw new Error('Erro ao buscar dados');
      }

      const idosoEncontrado = resultIdosos.data.find(
        idoso => idoso.cpf.replace(/\D/g, '') === cpfNumeros
      );

      if (idosoEncontrado) {
        // Verificar se tem contato de emergência cadastrado
        const resultFavoritos = await getAllUsuariofavorito();
        
        if (resultFavoritos.success && resultFavoritos.data.length > 0) {
          Alert.alert(
            'Bem-vindo!',
            `Olá, ${idosoEncontrado.nome}!\n\nAcesso liberado.`,
            [
              { 
                text: 'OK', 
                onPress: () => navigation.replace('Home')
              }
            ]
          );
        } else {
          Alert.alert(
            'Cadastro Incompleto',
            'Você precisa cadastrar um contato de emergência.',
            [
              {
                text: 'Completar Cadastro',
                onPress: () => navigation.navigate('Cadastro')
              }
            ]
          );
        }
      } else {
        Alert.alert(
          'Cadastro não encontrado',
          'CPF não está cadastrado no sistema.',
          [
            {
              text: 'Fazer Cadastro',
              onPress: () => navigation.navigate('Cadastro')
            },
            { text: 'Tentar Novamente', style: 'cancel' }
          ]
        );
      }

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', `Falha ao verificar cadastro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Ir para tela de cadastro
  const irParaCadastro = () => {
    navigation.navigate('Cadastro');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🏥</Text>
          <Text style={styles.title}>Saúde do Idoso</Text>
          <Text style={styles.subtitle}>Sistema de Monitoramento e Emergência</Text>
        </View>

        {/* Card de Login */}
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Acesse sua conta</Text>
          <Text style={styles.loginSubtitle}>
            Digite seu CPF para continuar
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CPF</Text>
            <TextInput
              style={styles.input}
              placeholder="000.000.000-00"
              value={cpf}
              onChangeText={formatarCPF}
              keyboardType="numeric"
              maxLength={14}
              autoFocus
            />
          </View>

          <TouchableOpacity 
            style={styles.btnLogin}
            onPress={fazerLogin}
          >
            <Text style={styles.btnLoginText}>Entrar</Text>
          </TouchableOpacity>
        </View>

        {/* Divisor */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Card de Cadastro */}
        <View style={styles.cadastroCard}>
          <Text style={styles.cadastroIcon}>📝</Text>
          <Text style={styles.cadastroTitle}>Primeiro Acesso?</Text>
          <Text style={styles.cadastroSubtitle}>
            Cadastre-se agora e tenha acesso aos recursos de emergência
          </Text>

          <TouchableOpacity 
            style={styles.btnCadastro}
            onPress={irParaCadastro}
          >
            <Text style={styles.btnCadastroText}>Fazer Cadastro</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Desenvolvido para cuidado e segurança dos idosos
          </Text>
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
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  emoji: {
    fontSize: 70,
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  loginCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 18,
  },
  btnLogin: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnLoginText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    paddingHorizontal: 15,
    color: '#95a5a6',
    fontSize: 14,
    fontWeight: '600',
  },
  cadastroCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#27ae60',
  },
  cadastroIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  cadastroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  cadastroSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  btnCadastro: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  btnCadastroText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default LoginScreen;