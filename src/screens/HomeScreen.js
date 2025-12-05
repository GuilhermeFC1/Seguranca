import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const headerHeight = height * 0.28;
  const buttonsHeight = height * 0.72;
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Cabeçalho com imagem de fundo - 28% da tela */}
      <View style={[styles.header, { height: headerHeight }]}>
        <ImageBackground 
          source={require('../../assets/Gemini_Generated_Image_ab4tciab4tciab4t.png')}
          style={styles.headerImage}
          resizeMode="cover"
        >
          {/* Overlay com a mesma cor da tela de login */}
          <View style={styles.headerOverlay} />
          
          {/* Logo no canto superior esquerdo com transparência */}
          <SafeAreaView style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Text style={styles.logoIcon}>🏥</Text>
              <View style={styles.logoTextContainer}>
                <Text style={styles.logoTitle}>Saúde do Idoso</Text>
                <Text style={styles.logoSubtitle}>Sistema de Monitoramento</Text>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
      
      {/* Área dos botões - 72% da tela */}
      <View style={[styles.buttonsArea, { height: buttonsHeight }]}>
        {/* Container dos botões com espaço adicional na parte inferior */}
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonsRow}>
            {/* Botão Cadastro */}
            <TouchableOpacity 
              style={[styles.button, styles.cadastroButton]}
              onPress={() => navigation.navigate('Cadastro')}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>📝</Text>
                <Text style={styles.buttonTitle}>Cadastro</Text>
                <Text style={styles.buttonDescription}>
                  Cadastrar idoso e contato de emergência
                </Text>
              </View>
            </TouchableOpacity>
            
            {/* Espaço entre botões levemente aumentado */}
            <View style={styles.spaceBetween} />
            
            {/* Botão Emergência */}
            <TouchableOpacity 
              style={[styles.button, styles.emergenciaButton]}
              onPress={() => navigation.navigate('Emergencia')}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>🚨</Text>
                <Text style={styles.buttonTitle}>Emergência</Text>
                <Text style={styles.buttonDescription}>
                  Enviar alerta com sintomas
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Espaço adicional entre botões e rodapé */}
        <View style={styles.bottomSpacer} />
        
        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Cuidado e segurança para idosos
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9', // Mesma cor da tela de login
  },
  header: {
    width: '100%',
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(39, 174, 96, 0.30)', // Mesma cor do overlay da tela de login
  },
  logoContainer: {
    width: '100%',
    height: '100%',
  },
  logoWrapper: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  logoIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  logoTextContainer: {
    alignItems: 'flex-start',
  },
  logoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  logoSubtitle: {
    fontSize: 10,
    color: '#2c3e50',
    fontWeight: '500',
  },
  buttonsArea: {
    width: '100%',
    backgroundColor: '#e8f5e9', // Mesma cor da tela de login
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingBottom: 30, // Espaço adicional na parte inferior dos botões
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.575,
    minHeight: height * 0.575,
  },
  cadastroButton: {
    borderLeftWidth: 8,
    borderLeftColor: '#0d4d1f',
    backgroundColor: '#8bc34a',
  },
  emergenciaButton: {
    borderLeftWidth: 8,
    borderLeftColor: '#7a1c1c',
    backgroundColor: '#e57373',
  },
  spaceBetween: {
    width: 15, // Levemente aumentado de 10 para 15
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 35,
    paddingHorizontal: 15,
    width: '100%',
  },
  buttonIcon: {
    fontSize: 58,
    marginBottom: 35,
  },
  buttonTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonDescription: {
    fontSize: 17,
    color: '#333',
    lineHeight: 21,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  bottomSpacer: {
    height: 25, // Espaço adicional entre botões e rodapé
  },
  footer: {
    height: 60, // Levemente aumentado
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 20,
    marginBottom: 10, // Espaço adicional na parte inferior da tela
  },
  footerText: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HomeScreen;