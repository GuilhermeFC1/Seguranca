import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🏥</Text>
        <Text style={styles.title}>Saúde do Idoso</Text>
        <Text style={styles.subtitle}>Sistema de Monitoramento e Emergência</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 30,
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
  },
  cardCadastro: {
    borderLeftWidth: 5,
    borderLeftColor: '#27ae60',
  },
  cardEmergencia: {
    borderLeftWidth: 5,
    borderLeftColor: '#e74c3c',
  },
  cardEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#7f8c8d',
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