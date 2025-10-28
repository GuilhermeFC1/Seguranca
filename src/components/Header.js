import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View>
      <Text style={styles.titulo}>Saúde do Idoso</Text>
      <Text style={styles.subtitulo}>Cadastro do Idoso</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default Header;