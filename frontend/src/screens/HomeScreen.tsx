import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    Image, 
    TextInput, 
    ActivityIndicator, 
    Linking, 
    Alert,
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import ThemeWrapper from '../components/ThemeWrapper';
import { useAuthStore } from '../store/authStore';
import postApi, { Post } from '../api/postApi';

const HomeScreen: React.FC<any> = ({ navigation }) => {
    const { user } = useAuthStore();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostText, setNewPostText] = useState('');
    const [newPostLink, setNewPostLink] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchFeed = useCallback(async (showLoader = false) => {
        if (showLoader) setIsLoading(true);
        const res = await postApi.getFeed();
        if (res && res.success) {
            setPosts(res.data);
        }
        setIsLoading(false);
        setIsRefreshing(false);
    }, []);

    useEffect(() => {
        fetchFeed(true);
    }, [fetchFeed]);

    const handleCreatePost = async () => {
        if (!newPostText.trim()) {
            Alert.alert('Empty Post', 'Please write something before posting.');
            return;
        }

        setIsPosting(true);
        const res = await postApi.createPost(newPostText, newPostLink);
        setIsPosting(false);

        if (res && res.success) {
            setNewPostText('');
            setNewPostLink('');
            // Add new post directly to local state for instant feedback, then fetch feed
            setPosts((prev) => [res.data, ...prev]);
        } else {
            Alert.alert('Error', res.message || 'Failed to publish post.');
        }
    };

    const handleLikePost = async (postId: string) => {
        // Optimistic UI update
        const currentUserId = user?._id || '';
        setPosts((prevPosts) => 
            prevPosts.map((post) => {
                if (post._id === postId) {
                    const liked = post.likes.includes(currentUserId);
                    const updatedLikes = liked 
                        ? post.likes.filter((id) => id !== currentUserId)
                        : [...post.likes, currentUserId];
                    return { ...post, likes: updatedLikes };
                }
                return post;
            })
        );

        // API Call in background
        await postApi.likePost(postId);
    };

    const handleOpenLink = async (url: string) => {
        try {
            let formattedUrl = url.trim();
            if (!/^https?:\/\//i.test(formattedUrl)) {
                formattedUrl = 'https://' + formattedUrl;
            }
            const supported = await Linking.canOpenURL(formattedUrl);
            if (supported) {
                await Linking.openURL(formattedUrl);
            } else {
                Alert.alert('Invalid URL', 'Cannot open this link.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to open the link.');
        }
    };

    const handleDeletePost = (postId: string) => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive', 
                    onPress: async () => {
                        setPosts((prev) => prev.filter((p) => p._id !== postId));
                        const res = await postApi.deletePost(postId);
                        if (!res || !res.success) {
                            Alert.alert('Error', res.message || 'Failed to delete post.');
                            fetchFeed();
                        }
                    } 
                }
            ]
        );
    };

    const getRelativeTime = (dateString: string) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffMs = now.getTime() - postDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const renderPostItem = ({ item }: { item: Post }) => {
        const isLiked = item.likes.includes(user?._id || '');
        const isOwner = item.userId?._id === user?._id;
        const relativeTime = getRelativeTime(item.createdAt);
        const userInitial = item.userId?.name?.charAt(0) || 'U';

        return (
            <View style={[styles.postCard, COLORS.glass]}>
                <View style={styles.postHeader}>
                    <View style={[styles.avatarContainer, COLORS.getGlow(COLORS.primary, 8, 0.2)]}>
                        <Text style={styles.avatarText}>{userInitial}</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{item.userId?.name || 'User'}</Text>
                        <Text style={styles.userEmail}>{item.userId?.email || ''} • {relativeTime}</Text>
                    </View>
                    {isOwner && (
                        <TouchableOpacity onPress={() => handleDeletePost(item._id)} style={{ padding: 4 }}>
                            <Ionicons name="trash-outline" size={18} color={COLORS.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>
                
                <Text style={styles.postContent}>{item.content}</Text>
                
                {item.link && (
                    <TouchableOpacity onPress={() => handleOpenLink(item.link!)} activeOpacity={0.7} style={styles.linkContainer}>
                        <Ionicons name="link-outline" size={16} color={COLORS.primary} style={{ marginRight: 4 }} />
                        <Text numberOfLines={1} style={styles.linkText}>{item.link}</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.postActions}>
                    <TouchableOpacity 
                        onPress={() => handleLikePost(item._id)} 
                        style={styles.actionButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons 
                            name={isLiked ? 'heart' : 'heart-outline'} 
                            size={18} 
                            color={isLiked ? '#ef4444' : COLORS.textMuted} 
                        />
                        <Text style={[styles.actionText, isLiked && { color: '#ef4444' }]}>
                            {item.likes.length}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <ThemeWrapper>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoRow}>
                    <Image source={require('../../assets/icon.png')} style={styles.headerIcon} />
                    <View>
                        <View style={styles.logoContainer}>
                            <Text style={[styles.logoNova, COLORS.getGlow(COLORS.primary, 15, 0)]}>NovaEdge</Text>
                        </View>
                        <Text style={styles.subtitle}>Digital Labs</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.7}>
                    <Ionicons name="person-circle-outline" size={32} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                renderItem={renderPostItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl 
                        refreshing={isRefreshing} 
                        onRefresh={() => {
                            setIsRefreshing(true);
                            fetchFeed(false);
                        }} 
                        tintColor={COLORS.primary}
                    />
                }
                ListHeaderComponent={
                    <View style={[styles.createPostCard, COLORS.glass]}>
                        <Text style={styles.cardHeading}>Share an Update</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="What's happening?"
                            placeholderTextColor={COLORS.textMuted}
                            multiline
                            maxLength={280}
                            value={newPostText}
                            onChangeText={setNewPostText}
                        />
                        <View style={styles.linkInputRow}>
                            <Ionicons name="link" size={18} color={COLORS.textMuted} style={{ marginRight: 8 }} />
                            <TextInput
                                style={styles.linkInput}
                                placeholder="Add link (optional)"
                                placeholderTextColor={COLORS.textMuted}
                                value={newPostLink}
                                onChangeText={setNewPostLink}
                                autoCapitalize="none"
                                keyboardType="url"
                            />
                        </View>
                        <View style={styles.cardFooter}>
                            <Text style={[styles.charCount, newPostText.length >= 260 && { color: '#ef4444' }]}>
                                {280 - newPostText.length} characters left
                            </Text>
                            <TouchableOpacity 
                                style={[styles.postButton, (!newPostText.trim() || isPosting) && styles.postButtonDisabled, COLORS.getGlow(COLORS.primary, 8, 0.2)]}
                                onPress={handleCreatePost}
                                disabled={!newPostText.trim() || isPosting}
                                activeOpacity={0.8}
                            >
                                {isPosting ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.postButtonText}>Post</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    isLoading ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="chatbubble-ellipses-outline" size={48} color={COLORS.textMuted} />
                            <Text style={styles.emptyText}>No posts yet. Be the first to share an update!</Text>
                        </View>
                    )
                }
            />
        </ThemeWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: 'transparent',
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        width: 38,
        height: 38,
        resizeMode: 'contain',
        marginRight: 10,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoNova: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.white,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 12,
        color: COLORS.textMuted,
        fontWeight: '600',
        marginTop: -4,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    createPostCard: {
        padding: 16,
        borderRadius: 20,
        marginBottom: 20,
    },
    cardHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 12,
    },
    textInput: {
        minHeight: 80,
        color: COLORS.white,
        fontSize: 15,
        textAlignVertical: 'top',
        marginBottom: 12,
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
    },
    linkInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 40,
        marginBottom: 15,
    },
    linkInput: {
        flex: 1,
        color: COLORS.white,
        fontSize: 14,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    charCount: {
        color: COLORS.textMuted,
        fontSize: 12,
    },
    postButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    postButtonDisabled: {
        opacity: 0.5,
    },
    postButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    postCard: {
        padding: 16,
        borderRadius: 20,
        marginBottom: 15,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: 'bold',
    },
    userEmail: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
    postContent: {
        color: COLORS.white,
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 12,
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 12,
    },
    linkText: {
        color: COLORS.primary,
        fontSize: 14,
        flex: 1,
    },
    postActions: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        paddingTop: 10,
        flexDirection: 'row',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        color: COLORS.textMuted,
        fontSize: 13,
        marginLeft: 6,
        fontWeight: '600',
    },
    loaderContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyContainer: {
        paddingVertical: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: COLORS.textMuted,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 12,
        paddingHorizontal: 40,
    },
});

export default HomeScreen;
