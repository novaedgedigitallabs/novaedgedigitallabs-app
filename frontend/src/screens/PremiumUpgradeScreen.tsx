import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import ThemeWrapper from '../components/ThemeWrapper';
import { LinearGradient } from 'expo-linear-gradient';
import { marketplaceApi } from '../api/marketplaceApi';
import PrimaryButton from '../components/PrimaryButton';
import { formatCurrency } from '../utils/helpers';
import RazorpayCheckout from 'react-native-razorpay';
import { useAuthStore } from '../store/authStore';

const PremiumUpgradeScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<any>(null);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        const fetchStatus = async () => {
            const res = await marketplaceApi.getPremiumStatus();
            setStatus(res);
        };
        fetchStatus();
    }, []);

    const handleUpgrade = async () => {
        if (!user) {
            Alert.alert('Authentication Required', 'Please login to upgrade your account.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Login', onPress: () => navigation.navigate('Profile') }
            ]);
            return;
        }

        setLoading(true);
        try {
            const order = await marketplaceApi.createPremiumSeekerOrder();

            const options = {
                description: 'NovaEdge Premium Upgrade',
                image: 'https://novaedgedigitallabs.tech/logo.png',
                currency: 'INR',
                key: 'rzp_test_dummy', // Replace with real env key
                amount: 199 * 100,
                name: 'NovaEdge Digital Labs',
                order_id: order.orderId,
                prefill: {
                    email: user.email,
                    contact: '',
                    name: user.name
                },
                theme: { color: COLORS.primary }
            };

            RazorpayCheckout.open(options).then(async (data: any) => {
                const razorpayResponse = {
                    razorpayOrderId: data.razorpay_order_id,
                    razorpayPaymentId: data.razorpay_payment_id,
                    razorpaySignature: data.razorpay_signature,
                };

                await marketplaceApi.verifyPremiumSeeker(razorpayResponse);
                Alert.alert('Welcome to Premium!', 'Your profile now has priority placement and a verified badge.', [
                    { text: 'Awesome', onPress: () => navigation.goBack() }
                ]);
            }).catch((error: any) => {
                console.log('Payment failed:', error);
                Alert.alert('Payment Failed', error.description || 'Transaction cancelled');
            });
        } catch (error: any) {
            console.error('Upgrade error:', error);
            Alert.alert('Payment Error', error.message || 'Failed to initiate upgrade');
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        { icon: 'trending-up', title: 'Priority Placement', desc: 'Your applications appear at the top of the recruiter\'s list.' },
        { icon: 'checkmark-seal', title: 'Verified Badge', desc: 'Get a blue checkmark on your profile to build trust.' },
        { icon: 'notifications', title: 'Early Access', desc: 'Get notified about new jobs 2 hours before others.' },
        { icon: 'eye', title: 'Profile Insights', desc: 'See who viewed your profile and which companies are interested.' }
    ];

    return (
        <ThemeWrapper>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={28} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>NovaEdge Premium</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={['#FFD700', '#FFA500']}
                    style={styles.heroCard}
                >
                    <Ionicons name="star" size={50} color="#FFF" />
                    <Text style={styles.heroTitle}>Upgrade Your Career</Text>
                    <Text style={styles.heroPrice}>{formatCurrency(199)} <Text style={styles.perMonth}>/ month</Text></Text>
                </LinearGradient>

                <View style={styles.benefitsSection}>
                    {benefits.map((b, i) => (
                        <View key={i} style={styles.benefitItem}>
                            <View style={styles.iconContainer}>
                                <Ionicons name={b.icon as any} size={24} color={COLORS.primary} />
                            </View>
                            <View style={styles.benefitText}>
                                <Text style={styles.btnTitle}>{b.title}</Text>
                                <Text style={styles.btnDesc}>{b.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <PrimaryButton
                    title="Upgrade Now"
                    onPress={handleUpgrade}
                    loading={loading}
                    style={styles.upgradeBtn}
                />

                <Text style={styles.cancelText}>Cancel anytime. Secure checkout via Razorpay.</Text>
            </ScrollView>
        </ThemeWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    content: {
        padding: 20,
    },
    heroCard: {
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        marginBottom: 30,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 15,
        marginBottom: 5,
    },
    heroPrice: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFF',
    },
    perMonth: {
        fontSize: 16,
        fontWeight: 'normal',
        opacity: 0.8,
    },
    benefitsSection: {
        gap: 20,
        marginBottom: 40,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: COLORS.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    benefitText: {
        flex: 1,
    },
    btnTitle: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    btnDesc: {
        color: COLORS.textMuted,
        fontSize: 14,
        lineHeight: 20,
    },
    upgradeBtn: {
        height: 60,
        borderRadius: 16,
        overflow: 'hidden',
    },
    btnGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelText: {
        textAlign: 'center',
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 15,
        marginBottom: 30,
    }
});

export default PremiumUpgradeScreen;
