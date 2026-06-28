import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const MiniAppScreen: React.FC<any> = ({ route, navigation }) => {
    const { url, title } = route.params || {};

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.title}>{title || 'App'}</Text>
                <View style={{ width: 24 }} />
            </View>
            <View style={styles.webviewContainer}>
                {url ? (
                    <WebView
                        source={{ uri: url }}
                        style={styles.webview}
                        startInLoadingState={true}
                        renderLoading={() => (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                            </View>
                        )}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                    />
                ) : (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Invalid URL</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: COLORS.backgroundSoft,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        padding: 5,
    },
    title: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    webviewContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: COLORS.primary,
        fontSize: 16,
    },
});

export default MiniAppScreen;
