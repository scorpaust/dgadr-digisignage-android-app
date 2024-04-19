import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

interface BaseButtonProps {
    paused: boolean;
    onPress: () => void;
}

const windowWidth = Dimensions.get('window').width;
const scaleFactor = windowWidth / 320;

const BaseButton: React.FC<BaseButtonProps>  = ({paused, onPress })  => {
    
    const iconName = paused ? 'play' : 'pause-outline';

    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Ionicons name={iconName} size={24 * scaleFactor} color="#FFF" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: '35%',
        right: '10%',
        width: '20%',
        height: '10%',
        borderRadius: 30,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // for Android shadow
        shadowColor: '#000', // for iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default BaseButton;


