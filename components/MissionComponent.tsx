import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import BaseCard from './layout-base/BaseCard'; // Update the import path as per your project structure

const windowWidth = Dimensions.get('window').width;

const scaleFactor = windowWidth / 320; 

const MissionComponent: React.FC = () => {
    return (
        <>
            <BaseCard>
                <Text style={styles.title}>Missão</Text>
                <Text style={styles.content}>
                A Direção-Geral de Agricultura e Desenvolvimento Rural (DGADR) tem por missão contribuir para a execução das políticas nos domínios da regulação da atividade das explorações agrícolas, dos recursos genéticos agrícolas, da qualificação dos agentes rurais e diversificação económica das zonas rurais, da gestão sustentável do território e do regadio, exercendo funções de autoridade nacional do regadio.
                    
                </Text>
            </BaseCard>
        </>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 18 * scaleFactor,
        fontWeight: 'bold',
        marginBottom: '5%',
    },
    content: {
        fontSize: 14 * scaleFactor,
        lineHeight: 20 * scaleFactor, // For better readability
        textAlign: 'justify',
        textAlignVertical: 'top'
    },
});

export default MissionComponent;