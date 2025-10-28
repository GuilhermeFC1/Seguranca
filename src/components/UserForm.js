import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const UserForm = ({ usuario, setUsuario, cpf, setCpf, telefone, setTelefone, formatarCPF, formatarTelefone }) => {
  return (
    <View>
      <View style={styles.campoContainer}>
        <Text style={styles.label}>Nome do Idoso *</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome completo"
          value={usuario}
          onChangeText={setUsuario}
          returnKeyType='next'
          autoCapitalize='words'
        />
      </View>

      <View style={styles.campoContainer}>
        <Text style={styles.label}>CPF *</Text>
        <TextInput
          style={styles.input}
          placeholder="000.000.000-00"
          value={cpf}
          onChangeText={formatarCPF}
          keyboardType="numeric"
          maxLength={14}
          returnKeyType='next'
        />
      </View>
      
      <View style={styles.campoContainer}>
        <Text style={styles.label}>Telefone *</Text>
        <TextInput
          style={styles.input}
          placeholder="(00) 00000-0000"
          value={telefone}
          onChangeText={formatarTelefone}
          keyboardType="phone-pad"
          maxLength={15}
          returnKeyType='done'
        />
        <Text style={styles.helperText}>
          Formato: (00) 00000-0000
        </Text>
      </View>
      <View style={styles.requiredInfo}>
        <Text style={styles.requiredText}>* Campos obrigatórios</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  helperText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
    fontStyle: 'italic',
  },
  requiredInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  requiredText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
});

export default UserForm;