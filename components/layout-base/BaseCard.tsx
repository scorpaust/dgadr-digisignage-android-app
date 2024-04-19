import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';

const BaseCard: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
    return <View style={styles.card}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        minHeight: '55%',  // Use minHeight instead of height
        width: '80%',      // Adjust width as needed
        alignItems: 'stretch',
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 3,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginHorizontal: '10%',
        marginTop: '5%',   // Adjust marginVertical to marginTop for better control
        marginBottom: '5%', // and marginBottom
        padding: '5%',
    },
});

export default BaseCard;