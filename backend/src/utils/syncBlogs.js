const Parser = require('rss-parser');
const Blog = require('../models/blog.model');

const parser = new Parser({
    customFields: {
        item: [
            ['content:encoded', 'contentEncoded'],
            ['category', 'categories', { keepArray: true }]
        ]
    }
});

const syncBlogs = async () => {
    try {
        console.log('Fetching RSS feed...');
        const feed = await parser.parseURL('https://www.novaedgedigitallabs.tech/rss.xml');
        
        for (const item of feed.items) {
            // Extract slug from link
            const linkParts = item.link.split('/');
            const slug = linkParts[linkParts.length - 1] || linkParts[linkParts.length - 2];
            
            // Extract image from enclosure if available
            let imageUrl = '';
            if (item.enclosure && item.enclosure.url) {
                imageUrl = item.enclosure.url;
            }

            // Categories/Tags
            const categories = item.categories || [];
            const category = categories.length > 0 ? categories[0] : 'Uncategorized';
            
            const publishedAtDate = new Date(item.pubDate);
            const dateStr = publishedAtDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            const publishedAt = publishedAtDate.toISOString().split('T')[0];

            // Try to split content into paragraphs to match existing structure if possible,
            // or just save it as html. We will just save as html for now and standard paragraph fallback.
            const body = [
                {
                    type: 'html',
                    content: item.contentEncoded || item.content || item.description
                }
            ];

            const excerpt = item.contentSnippet ? item.contentSnippet.substring(0, 160) + '...' : (item.description || '').substring(0, 160);

            const blogData = {
                title: item.title,
                metaTitle: item.title,
                metaDescription: excerpt,
                date: dateStr,
                publishedAt: publishedAt,
                author: item.creator || 'NovaEdge Digital Labs',
                category: category,
                readTime: '5 min read',
                imageUrl: imageUrl,
                excerpt: excerpt,
                tags: categories,
                coverImage: {
                    src: imageUrl,
                    alt: item.title,
                    caption: ''
                },
                body: body,
                isActive: true
            };

            await Blog.findOneAndUpdate(
                { slug: slug },
                { $set: blogData },
                { upsert: true, new: true }
            );
        }
        console.log(`Successfully synced ${feed.items.length} blogs from RSS feed.`);
    } catch (error) {
        console.error('Error syncing RSS feed:', error.message);
    }
};

module.exports = syncBlogs;
