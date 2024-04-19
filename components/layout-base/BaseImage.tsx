import React from 'react';
import { Image, StyleSheet } from 'react-native';

type ImageBaseProps = {
    bsource: string; // Image source
};

const BaseImage: React.FC<ImageBaseProps> = ({ bsource }) => {
    return <Image source={{ uri: bsource }} style={styles.image} />;
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        aspectRatio: 1.5, // Adjust aspect ratio as per your need
        borderRadius: 10,
        resizeMode: 'cover',
        margin: '5%',
    },
});

export default BaseImage;
