import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../constants/colors';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const ToolCard = ({ title, description, onPress }: { title: string, description: string, onPress: () => void }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }]
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    };

    return (
        <Animated.View style={[animatedStyle, styles.container]}>
            <Pressable
                style={styles.card}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    card: {
        ...COLORS.glass,
        padding: 18,
        borderRadius: COLORS.geometry.radiusMedium,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    description: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginTop: 6,
        lineHeight: 20,
    },
});

export default ToolCard;
