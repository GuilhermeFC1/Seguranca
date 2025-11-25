import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require('../../assets/unnamed.jpg')} // Ajuste o caminho conforme necessário
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          {/* Logo no canto superior esquerdo */}
          <View style={styles.logoContainer}>
            <Image 
              source={{uri: 'https://lh3.googleusercontent.com/rd-gg-dl/ABS2GSlceagFbFfAlG_KdoACXLPw8jAGu3tVOpRDVsf-mG6TtehgnHm-NfXn-GDnplBNRN8adzjzqx92l5XxyAdz5YD9FV3A6AITjrunIbgHQITPBrHghWdbmAZ7UaWZaVcwxQaH9Z3aKygJkS19iyAWs2jC-oDynKyescpYhrDSNxtjv6orjhkkNEko30EaNNpAN_qAAdPwRwKayCF3Jh3AnklOIt38eqwE2xL8gjBsG2PVVUXJjo0qWua8twpBveOznUF0qrtfw4ltlmOJKb_z4B-Ylmlu9bTX1F5hjd1w8zS70UKBhN-RGT7aOfopHfi1ywb6qhHNktBMMmb8x-B_d-Pu9td9PxnpJgkNat66aQuy4rlaZ4_xJXb3mgNTJhfUQ1_Arc6hBw6diic-hA2ic3IMzHD9D5gGrjHAY1uKNlFXXIviHsmiLFBrvpd9klB-f7uvMx4a-6MO0ROoq3rikTvf5V4qCNqgAggLAVMU07czYedwPLQCv6O6j4vDH-f4aNdAadOGNx-MhITZJRXHiNlJE5_GloARL1G6DCUBf_NgGloYI2m4VCVsmTd20aDNSpwsWfqbyqAIXk56e58HKVNHwlMQVNrKQxgKlRiiEoMWI4yQHYvxqVIX5DvG8ftrP1ajTkIexJJx6wRbcumFKp4q_TSXrZvozaohjKCCRfwlkNhOauL3i5e9j8688rPGp763luB5WWz3spjSYAcqYgpdQmMjdNqKTf4AzTawVc9DUVrsSuuxB2qk9bvL931FLg7iknYkSORewZAOu5s1L1BSjpgQ0qQhxer7bBnAOxZAtofUVKZtAmUJhuvLSDBjV2sl_Bi3XclZR7mynIaTNqIWdCtEKtfGVH8fIimkT_rkk4mzCt8QU1ZmszOsLJK1hTKm5Zz2PdSgDyUKbQhOsvmKp2IXip4m9xrE35YKhjdTc94VuxYuTMOUlMltCqicgTDAfvcZFP-5Q8kEA6iBqd8deSILssBrEMYDq2KLtbDLQTjrb_cEjHwjMfw-OQ-DlvO-cegjJeCd5TNm_nPYbVDm9s6QqS4jS-KClt9Bgm50VbdQz6ECHFT4pGn0kMiCQjXr1vZIZeCSyPWObkGPAwWYRtq5wDat6El5PMJoPtDKxp2yb0YdfOR4T_JHz0Q4td8_sK5JGkTFe5mVmxO2knXVr3q1VosFUhMrZ9G7pZ-kvntSFUE=s1024-rj'}}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.cardsContainer}>
            <TouchableOpacity 
              style={[styles.card, styles.cardCadastro]}
              onPress={() => navigation.navigate('Cadastro')}
            >
              <Text style={styles.cardEmoji}>📝</Text>
              <Text style={styles.cardTitle}>Cadastro</Text>
              <Text style={styles.cardDescription}>
                Cadastrar idoso e contato de emergência
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.card, styles.cardEmergencia]}
              onPress={() => navigation.navigate('Emergencia')}
            >
              <Text style={styles.cardEmoji}>🚨</Text>
              <Text style={styles.cardTitle}>Emergência</Text>
              <Text style={styles.cardDescription}>
                Enviar alerta com sintomas para contato de emergência
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Desenvolvido para cuidado e segurança dos idosos
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.9,
    resizeMode: 'cover',
    transform: [{ scale: 1.1 }, { translateX: 50 }], // Movendo a imagem para a direita
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(180, 220, 180, 0.6)',
  },
  container: {
    flex: 1,
  },
  logoContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  logo: {
    width: 80,
    height: 60,
  },
  cardsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  card: {
    backgroundColor: 'white',
    padding: 20, // Reduzido o padding vertical
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '65%', // Diminuído no sentido horizontal
  },
  cardCadastro: {
    borderLeftWidth: 5,
    borderLeftColor: '#0d4d1f',
    backgroundColor: '#8bc34a',
  },
  cardEmergencia: {
    borderLeftWidth: 5,
    borderLeftColor: '#7a1c1c',
    backgroundColor: '#e57373',
  },
  cardEmoji: {
    fontSize: 35, // Emoji um pouco menor
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18, // Fonte um pouco menor
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 11, // Fonte um pouco menor
    color: '#333333',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HomeScreen;