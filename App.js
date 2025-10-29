import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar telas
import HomeScreen from './src/screens/HomeScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import EmergenciaScreen from './src/screens/EmergenciaScreen';

// Importações do banco de dados
import { initDatabase, testDatabase } from './src/database/asyncDB';

const Stack = createNativeStackNavigator();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeDB();
  }, []);

  const initializeDB = async () => {
    try {
      console.log('Iniciando banco de dados...');
      await initDatabase();
      const teste = await testDatabase();

      if (teste) {
        setDbInitialized(true);
        console.log('Banco inicializado com sucesso!');
      } else {
        Alert.alert('Erro', 'Falha no teste do banco de dados');
      }
    } catch (error) {
      console.log('Erro na inicialização', error);
      Alert.alert('Erro', `Erro no banco: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Inicializando aplicativo...</Text>
      </View>
    );
  }

  if (!dbInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Erro ao inicializar banco de dados</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Saúde do Idoso' }}
        />
        <Stack.Screen 
          name="Cadastro" 
          component={CadastroScreen}
          options={{ title: 'Cadastro' }}
        />
        <Stack.Screen 
          name="Emergencia" 
          component={EmergenciaScreen}
          options={{ title: 'Emergência' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    padding: 20,
  },
});