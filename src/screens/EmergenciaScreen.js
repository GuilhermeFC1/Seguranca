import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity,
  Alert,
  StyleSheet,
  Linking,
  Platform,
  ActivityIndicator
} from 'react-native';
import * as Location from 'expo-location';
import LoadingOverlay from '../components/LoadingOverlay';
import { getAllIdoso, getAllUsuariofavorito } from '../database/asyncDB';

const EmergenciaScreen = ({ navigation }) => {
  const [sintomasSelecionados, setSintomasSelecionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [idoso, setIdoso] = useState(null);
  const [usuarioFavorito, setUsuarioFavorito] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);
  const [carregandoLocalizacao, setCarregandoLocalizacao] = useState(false);
  const [permissaoLocalizacao, setPermissaoLocalizacao] = useState(null);

  const listaSintomas = [
    { id: '1', nome: 'Febre', icone: '🌡️' },
    { id: '2', nome: 'Dor de Cabeça', icone: '🤕' },
    { id: '3', nome: 'Tontura', icone: '💫' },
    { id: '4', nome: 'Falta de Ar', icone: '😮‍💨' },
    { id: '5', nome: 'Náusea', icone: '🤢' },
    { id: '6', nome: 'Dor no Corpo', icone: '😣' },
    { id: '7', nome: 'Fraqueza', icone: '🙍‍♂️' },
    { id: '8', nome: 'Confusão Mental', icone: '🧠' },
    { id: '9', nome: 'Palpitações', icone: '💓' },
    { id: '10', nome: 'Suor Excessivo', icone: '😰' },
    { id: '11', nome: 'Calafrios', icone: '🥶' },
    { id: '12', nome: 'Dormência', icone: '🫨' },
    { id: '13', nome: 'Dor no Peito', icone: '🫀' },
    { id: '14', nome: 'Visão Turva', icone: '😵‍💫' },
    { id: '15', nome: 'Falta de Visão', icone: '😵' },
    { id: '16', nome: 'Dificuldade em Falar', icone: '😶' },
    { id: '17', nome: 'Perda de Sentido', icone: '🫥' },
  ];

  useEffect(() => {
    carregarDados();
    solicitarPermissaoLocalizacao();
  }, []);

  // Solicitar permissão de localização
  const solicitarPermissaoLocalizacao = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissaoLocalizacao(status === 'granted');
      
      if (status === 'granted') {
        obterLocalizacaoAtual();
      } else {
        Alert.alert(
          'Permissão de Localização',
          'A localização ajuda os socorristas a encontrarem você mais rápido. Você pode ativar nas configurações do dispositivo.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão de localização:', error);
      setPermissaoLocalizacao(false);
    }
  };

  // Obter localização atual
  const obterLocalizacaoAtual = async () => {
    try {
      setCarregandoLocalizacao(true);
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 0,
      });

      setLocalizacao({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp
      });

    } catch (error) {
      console.error('Erro ao obter localização:', error);
      setLocalizacao(null);
    } finally {
      setCarregandoLocalizacao(false);
    }
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      setLoadingMessage('Carregando dados...');

      const resultIdoso = await getAllIdoso();
      const resultFavorito = await getAllUsuariofavorito();

      if (resultIdoso.success && resultIdoso.data.length > 0) {
        setIdoso(resultIdoso.data[0]);
      }

      if (resultFavorito.success && resultFavorito.data.length > 0) {
        setUsuarioFavorito(resultFavorito.data[0]);
      }

      if (!resultIdoso.data.length || !resultFavorito.data.length) {
        Alert.alert(
          'Cadastro Necessário',
          'É necessário cadastrar um idoso e um contato de emergência antes de usar esta função.',
          [
            {
              text: 'Ir para Cadastro',
              onPress: () => navigation.navigate('Cadastro')
            },
            { text: 'Cancelar', style: 'cancel' }
          ]
        );
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Falha ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const toggleSintoma = (sintoma) => {
    const index = sintomasSelecionados.findIndex(s => s.id === sintoma.id);
    
    if (index > -1) {
      const novosSintomas = [...sintomasSelecionados];
      novosSintomas.splice(index, 1);
      setSintomasSelecionados(novosSintomas);
    } else {
      setSintomasSelecionados([...sintomasSelecionados, sintoma]);
    }
  };

  const isSintomaSelecionado = (sintomaId) => {
    return sintomasSelecionados.some(s => s.id === sintomaId);
  };

  // Formatar endereço da localização
  const formatarLocalizacao = (loc) => {
    if (!loc) return 'Localização não disponível';
    
    const googleMapsUrl = `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`;
    const coordenadas = `${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`;
    const precisao = loc.accuracy ? `±${Math.round(loc.accuracy)}m` : '';
    
    return {
      texto: `📍 ${coordenadas} ${precisao}`,
      url: googleMapsUrl
    };
  };

  const enviarAlerta = async () => {
    if (!idoso || !usuarioFavorito) {
      Alert.alert('Erro', 'Dados de cadastro não encontrados');
      return;
    }

    if (sintomasSelecionados.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um sintoma');
      return;
    }

    // Atualizar localização antes de enviar
    if (permissaoLocalizacao) {
      setLoadingMessage('Obtendo localização...');
      setLoading(true);
      await obterLocalizacaoAtual();
      setLoading(false);
    }

    const sintomasTexto = sintomasSelecionados
      .map(s => `${s.icone} ${s.nome}`)
      .join('\n');

    const locInfo = formatarLocalizacao(localizacao);
    
    const mensagem = 
      `🚨 *ALERTA DE EMERGÊNCIA* 🚨\n\n` +
      `👴 Paciente: ${idoso.nome}\n` +
      `📞 Telefone: ${idoso.telefone}\n\n` +
      `*SINTOMAS RELATADOS:*\n${sintomasTexto}\n\n` +
      `*LOCALIZAÇÃO:*\n${locInfo.texto}\n` +
      `🗺️ Mapa: ${locInfo.url}\n\n` +
      `⏰ Horário: ${new Date().toLocaleString('pt-BR')}\n\n` +
      `_Mensagem enviada automaticamente pelo app Saúde do Idoso_`;

    Alert.alert(
      'Enviar Alerta',
      `Você está prestes a enviar um alerta de emergência para:\n\n` +
      `${usuarioFavorito.nome}\n` +
      `${usuarioFavorito.telefone}\n\n` +
      `Sintomas: ${sintomasSelecionados.map(s => s.nome).join(', ')}\n` +
      `${localizacao ? '✅ Localização incluída' : '⚠️ Sem localização'}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Enviar SMS', 
          onPress: () => enviarSMS(mensagem)
        },
        { 
          text: 'Enviar WhatsApp', 
          onPress: () => enviarWhatsApp(mensagem),
          style: 'default'
        }
      ]
    );
  };

  const enviarSMS = async (mensagem) => {
    try {
      setLoading(true);
      setLoadingMessage('Abrindo SMS...');

      const telefone = usuarioFavorito.telefone.replace(/\D/g, '');
      const url = `sms:${telefone}${Platform.OS === 'ios' ? '&' : '?'}body=${encodeURIComponent(mensagem)}`;
      
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
        Alert.alert('Sucesso', 'SMS preparado! Complete o envio.');
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o aplicativo de SMS');
      }
    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      Alert.alert('Erro', 'Falha ao abrir SMS');
    } finally {
      setLoading(false);
    }
  };

  const enviarWhatsApp = async (mensagem) => {
    try {
      setLoading(true);
      setLoadingMessage('Abrindo WhatsApp...');

      const telefone = usuarioFavorito.telefone.replace(/\D/g, '');
      
      let url;
      if (Platform.OS === 'ios') {
        url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
      } else {
        url = `whatsapp://send?phone=55${telefone}&text=${encodeURIComponent(mensagem)}`;
      }
      
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        if (Platform.OS === 'android') {
          const fallbackUrl = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
          const fallbackSupported = await Linking.canOpenURL(fallbackUrl);
          
          if (fallbackSupported) {
            await Linking.openURL(fallbackUrl);
            return;
          }
        }
        
        Alert.alert(
          'WhatsApp não encontrado',
          'Deseja tentar enviar por SMS?',
          [
            { text: 'Não', style: 'cancel' },
            { text: 'Sim', onPress: () => enviarSMS(mensagem) }
          ]
        );
      }
    } catch (error) {
      console.error('Erro ao abrir WhatsApp:', error);
      
      if (Platform.OS === 'android') {
        try {
          const telefone = usuarioFavorito.telefone.replace(/\D/g, '');
          const fallbackUrl = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
          await Linking.openURL(fallbackUrl);
          return;
        } catch (fallbackError) {
          console.error('Erro no fallback:', fallbackError);
        }
      }
      
      Alert.alert(
        'Erro',
        'Não foi possível abrir o WhatsApp. Deseja tentar por SMS?',
        [
          { text: 'Não', style: 'cancel' },
          { text: 'Sim', onPress: () => enviarSMS(mensagem) }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header de emergência */}
        <View style={styles.emergencyHeader}>
          <Text style={styles.emergencyIcon}>🚨</Text>
          <Text style={styles.emergencyTitle}>Alerta de Emergência</Text>
          <Text style={styles.emergencySubtitle}>
            Selecione os sintomas que você está sentindo
          </Text>
        </View>

        {/* Info do paciente */}
        {idoso && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>👴 Paciente:</Text>
            <Text style={styles.infoText}>{idoso.nome}</Text>
          </View>
        )}

        {/* Info do contato */}
        {usuarioFavorito && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>📞 Contato de Emergência:</Text>
            <Text style={styles.infoText}>{usuarioFavorito.nome}</Text>
            <Text style={styles.infoText}>{usuarioFavorito.telefone}</Text>
          </View>
        )}

        {/* Card de Localização */}
        <View style={[styles.infoCard, styles.locationCard]}>
          <View style={styles.locationHeader}>
            <Text style={styles.infoTitle}>📍 Localização</Text>
            {carregandoLocalizacao && (
              <ActivityIndicator size="small" color="#3498db" />
            )}
          </View>
          
          {localizacao ? (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                ✅ Localização capturada
              </Text>
              <Text style={styles.locationCoords}>
                {localizacao.latitude.toFixed(6)}, {localizacao.longitude.toFixed(6)}
              </Text>
              {localizacao.accuracy && (
                <Text style={styles.locationAccuracy}>
                  Precisão: ±{Math.round(localizacao.accuracy)}m
                </Text>
              )}
              <TouchableOpacity 
                style={styles.btnAtualizarLocation}
                onPress={obterLocalizacaoAtual}
              >
                <Text style={styles.btnAtualizarText}>🔄 Atualizar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.locationInfo}>
              {permissaoLocalizacao === false ? (
                <>
                  <Text style={styles.locationWarning}>
                    ⚠️ Permissão de localização negada
                  </Text>
                  <TouchableOpacity 
                    style={styles.btnPermissao}
                    onPress={solicitarPermissaoLocalizacao}
                  >
                    <Text style={styles.btnPermissaoText}>
                      Solicitar Permissão
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.locationWarning}>
                    ⚠️ Localização não disponível
                  </Text>
                  <Text style={styles.locationHelper}>
                    A localização será capturada ao enviar o alerta
                  </Text>
                </>
              )}
            </View>
          )}
        </View>

        {/* Lista de sintomas */}
        <View style={styles.sintomasContainer}>
          <Text style={styles.sintomasTitle}>Selecione os sintomas:</Text>
          
          {listaSintomas.map((sintoma) => (
            <TouchableOpacity
              key={sintoma.id}
              style={[
                styles.sintomaItem,
                isSintomaSelecionado(sintoma.id) && styles.sintomaItemSelecionado
              ]}
              onPress={() => toggleSintoma(sintoma)}
            >
              <Text style={styles.sintomaIcone}>{sintoma.icone}</Text>
              <Text style={[
                styles.sintomaNome,
                isSintomaSelecionado(sintoma.id) && styles.sintomaNomeSelecionado
              ]}>
                {sintoma.nome}
              </Text>
              {isSintomaSelecionado(sintoma.id) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Sintomas selecionados */}
        {sintomasSelecionados.length > 0 && (
          <View style={styles.selecionadosCard}>
            <Text style={styles.selecionadosTitle}>
              ✅ Sintomas Selecionados ({sintomasSelecionados.length}):
            </Text>
            <View style={styles.tagContainer}>
              {sintomasSelecionados.map(sintoma => (
                <View key={sintoma.id} style={styles.tag}>
                  <Text style={styles.tagText}>
                    {sintoma.icone} {sintoma.nome}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>

      {/* Botão fixo no rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.btnEnviar,
            sintomasSelecionados.length === 0 && styles.btnEnviarDisabled
          ]}
          onPress={enviarAlerta}
          disabled={sintomasSelecionados.length === 0}
        >
          <Text style={styles.btnEnviarText}>
            🚨 ENVIAR ALERTA DE EMERGÊNCIA
          </Text>
        </TouchableOpacity>
      </View>

      <LoadingOverlay visible={loading} message={loadingMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  emergencyHeader: {
    backgroundColor: '#e74c3c',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  emergencyIcon: {
    fontSize: 50,
  },
  emergencyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  locationCard: {
    borderLeftColor: '#27ae60',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  locationInfo: {
    marginTop: 5,
  },
  locationText: {
    fontSize: 15,
    color: '#27ae60',
    fontWeight: '600',
    marginBottom: 5,
  },
  locationCoords: {
    fontSize: 13,
    color: '#555',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 3,
  },
  locationAccuracy: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  locationWarning: {
    fontSize: 14,
    color: '#e67e22',
    fontWeight: '600',
    marginBottom: 5,
  },
  locationHelper: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  btnAtualizarLocation: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  btnAtualizarText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  btnPermissao: {
    backgroundColor: '#e67e22',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  btnPermissaoText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  sintomasContainer: {
    marginTop: 10,
  },
  sintomasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  sintomaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  sintomaItemSelecionado: {
    backgroundColor: '#e3f2fd',
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  sintomaIcone: {
    fontSize: 24,
    marginRight: 12,
  },
  sintomaNome: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  sintomaNomeSelecionado: {
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  checkmark: {
    fontSize: 20,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  selecionadosCard: {
    backgroundColor: '#d4edda',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  selecionadosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#155724',
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 3,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  btnEnviar: {
    backgroundColor: '#e74c3c',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnEnviarDisabled: {
    backgroundColor: '#95a5a6',
  },
  btnEnviarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EmergenciaScreen;