import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import BaseCard from './layout-base/BaseCard'; // Update the import path as per your project structure

const windowWidth = Dimensions.get('window').width;

const scaleFactor = windowWidth / 320; 

const ComplaintComponent: React.FC = () => {
    return (
        <>
            <BaseCard>
                <Text style={styles.title}>Livro de Reclamações</Text>
                <Text style={styles.content}>
                Em cumprimento da Resolução do Conselho de Ministros n.º 189/96, de 28 de novembro, informa-se que este Serviço possui LIVRO de RECLAMAÇÕES, e o mesmo se encontra na Direção de Serviços de Informação, Gestão e Administração, Divisão de Planeamento e Gestão de Informação.
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
        textAlign: 'justify'
    },
});

export default ComplaintComponent;