sdasdsa
import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PhotoPicker = ({ foto, setFoto }) => {
  const selecionarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria!');
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!resultado.canceled && resultado.assets && resultado.assets[0]) {
        setFoto(resultado.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao abrir galeria:", error);
      Alert.alert('Erro', 'Não foi possível abrir a galeria');
    }
  };

  const tirarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua câmera!');
        return;
      }

      const resultado = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!resultado.canceled && resultado.assets && resultado.assets[0]) {
        setFoto(resultado.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao abrir câmera:", error);
      Alert.alert('Erro', 'Não foi possível abrir a câmera');
    }
  };

  return (
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
});

export default PhotoPicker;