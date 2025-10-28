import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SubmitButton = ({ onPress, disabled = false }) => {
  return (
    <TouchableOpacity
       style={[
        styles.botaoEnviar,
        disabled && styles.botaoEnviarDisabled
        ]}
        onPress={onPress}
        disabled={disabled}
        >
      <Text style={styles.botaoEnviarTexto}>{disabled ? 'Salvando...': 'Salvar Cadastro'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botaoEnviar: {
    backgroundColor: '#27ae60',
    padding: 18,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  botaoEnviarDisabled:{
    backgroundColor: '#95a5a6',
  },
  botaoEnviarTexto: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SubmitButton;