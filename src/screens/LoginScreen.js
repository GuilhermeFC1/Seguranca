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
  ScrollView,
  ImageBackground,
  Dimensions
} from 'react-native';
import LoadingOverlay from '../components/LoadingOverlay';
import { getAllIdoso, getAllUsuariofavorito } from '../database/asyncDB';

const { width, height } = Dimensions.get('window');

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

  const irParaCadastro = () => {
    navigation.navigate('Cadastro');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/Gemini_Generated_Image_rp00r3rp00r3rp00.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.topSpacer} />

            <View style={styles.loginContainer}>
              <View style={styles.loginCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.emoji}>🏥</Text>
                  <Text style={styles.title}>Saúde do Idoso</Text>
                  <Text style={styles.subtitle}>Sistema de Monitoramento</Text>
                </View>

                <View style={styles.formSection}>
                  <Text style={styles.formTitle}>Acesse sua conta</Text>
                  <Text style={styles.formSubtitle}>
                    Digite seu CPF para continuar
                  </Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>CPF</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="000.000.000-00"
                      placeholderTextColor="#95a5a6"
                      value={cpf}
                      onChangeText={formatarCPF}
                      keyboardType="numeric"
                      maxLength={14}
                    />
                  </View>

                  <TouchableOpacity 
                    style={styles.btnLogin}
                    onPress={fazerLogin}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnLoginText}>Entrar</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OU</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.registerSection}>
                  <Text style={styles.registerTitle}>Primeiro Acesso?</Text>
                  <Text style={styles.registerSubtitle}>
                    Cadastre-se para acessar os recursos
                  </Text>

                  <TouchableOpacity 
                    style={styles.btnRegister}
                    onPress={irParaCadastro}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnRegisterText}>📝 Fazer Cadastro</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.footerText}>
                    Cuidado e segurança para idosos
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>

      <LoadingOverlay visible={loading} message={loadingMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(39, 174, 96, 0.30)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  topSpacer: {
    height: height * 0.05,
  },
  bottomSpacer: {
    height: height * 0.05,
  },
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loginCard: {
    width: Math.min(width * 0.85, 480),
    backgroundColor: '#ffffff',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: '#27ae60',
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
  },
  formSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  btnLogin: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  btnLoginText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 16,
    backgroundColor: '#ffffff',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#95a5a6',
    fontWeight: '600',
  },
  registerSection: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  registerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  registerSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 16,
  },
  btnRegister: {
    backgroundColor: '#27ae60',
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#27ae60',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  btnRegisterText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  cardFooter: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 11,
    color: '#95a5a6',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default LoginScreen;