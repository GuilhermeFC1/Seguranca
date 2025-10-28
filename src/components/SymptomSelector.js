import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  StyleSheet 
} from 'react-native';

const SymptomSelector = ({ sintomasSelecionados, setSintomasSelecionados }) => {
  const [modalVisivel, setModalVisivel] = useState(false);

  const listaSintomas = [
    { id : '1', nome: 'Febre', icone: '🌡'},
    { id : '2', nome: 'Dor de Cabeça', icone: '🤕'},
    { id : '3', nome: 'Tontura', icone: '💫'},
    { id : '4', nome: 'Falta de Ar', icone: '😮‍💨'},
    { id : '5', nome: 'Náusea', icone: '🤢'},
    { id : '6', nome: 'Dor no Corpo', icone: '😣'},
    { id : '7', nome: 'Fraqueza', icone: '🙍‍♂'},
    { id : '8', nome: 'Confusão Mental', icone: '🧠'},
    { id : '9', nome: 'Palpitações', icone: '💓'},
    { id : '10', nome: 'Suor Excessivo', icone: '😰'},
    { id : '11', nome: 'Calafrios', icone: '🥶'},
    { id : '12', nome: 'Dormência', icone: '🫨'},
    { id : '13', nome: 'Dor no peito', icone: '🫀'},
    { id : '14', nome: 'Visão turva', icone: '😵‍💫'},
    { id : '15', nome: 'Falta de visão', icone: '😵'},
    { id : '16', nome: 'Dificuldade em falar', icone: '😶'},
    { id : '17', nome: 'Perda de sentido', icone: '🫥'},
  ];

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

  const renderSintomasGrid = () => {
    const rows = [];
    for (let i = 0; i < listaSintomas.length; i += 2) {
      const sintoma1 = listaSintomas[i];
      const sintoma2 = listaSintomas[i + 1];
      
      rows.push(
        <View key={i} style={styles.sintomasRow}>
          <TouchableOpacity
            style={[
              styles.itemSintoma,
              isSintomaSelecionado(sintoma1.id) && styles.itemSintomaSelecionado
            ]}
            onPress={() => toggleSintoma(sintoma1)}
          >
            <Text style={styles.iconeSintoma}>{sintoma1.icone}</Text>
            <Text style={[
              styles.nomeSintoma,
              isSintomaSelecionado(sintoma1.id) && styles.nomeSintomaSelecionado
            ]}>
              {sintoma1.nome}
            </Text>
          </TouchableOpacity>
          
          {sintoma2 && (
            <TouchableOpacity
              style={[
                styles.itemSintoma,
                isSintomaSelecionado(sintoma2.id) && styles.itemSintomaSelecionado
              ]}
              onPress={() => toggleSintoma(sintoma2)}
            >
              <Text style={styles.iconeSintoma}>{sintoma2.icone}</Text>
              <Text style={[
                styles.nomeSintoma,
                isSintomaSelecionado(sintoma2.id) && styles.nomeSintomaSelecionado
              ]}>
                {sintoma2.nome}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.campoContainer}>
      <Text style={styles.label}>Sintomas *</Text>
      
      <TouchableOpacity 
        style={styles.botaoSelecionarSintomas}
        onPress={() => setModalVisivel(true)}
      >
        <Text style={styles.botaoSelecionarTexto}>
          {sintomasSelecionados.length > 0 
            ? `${sintomasSelecionados.length} sintoma(s) selecionado(s)` 
            : 'Selecionar Sintomas'
          }
        </Text>
      </TouchableOpacity>

      {sintomasSelecionados.length > 0 && (
        <View style={styles.sintomasSelecionadosContainer}>
          <Text style={styles.sintomasSelecionadosTitulo}>
            Sintomas selecionados:
          </Text>
          <View style={styles.sintomasTags}>
            {sintomasSelecionados.map(sintoma => (
              <View key={sintoma.id} style={styles.tagSintoma}>
                <Text style={styles.tagTexto}>
                  {sintoma.icone} {sintoma.nome}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <View style={styles.modalCabecalho}>
              <Text style={styles.modalTitulo}>Selecione os Sintomas</Text>
              <TouchableOpacity 
                style={styles.botaoFecharModal}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.botaoFecharTexto}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.listaSintomasContainer}
              showsVerticalScrollIndicator={false}
            >
              {renderSintomasGrid()}
            </ScrollView>

            <TouchableOpacity 
              style={styles.botaoConfirmar}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.botaoConfirmarTexto}>
                Confirmar ({sintomasSelecionados.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  botaoSelecionarSintomas: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  botaoSelecionarTexto: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  sintomasSelecionadosContainer: {
    marginTop: 10,
  },
  sintomasSelecionadosTitulo: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  sintomasTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagSintoma: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 3,
  },
  tagTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalConteudo: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  botaoFecharModal: {
    padding: 5,
  },
  botaoFecharTexto: {
    fontSize: 20,
    color: '#7f8c8d',
  },
  listaSintomasContainer: {
    maxHeight: 400,
  },
  sintomasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemSintoma: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  itemSintomaSelecionado: {
    backgroundColor: '#e3f2fd',
    borderColor: '#3498db',
  },
  iconeSintoma: {
    fontSize: 20,
    marginRight: 8,
  },
  nomeSintoma: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  nomeSintomaSelecionado: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  botaoConfirmar: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoConfirmarTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SymptomSelector;