// Sample data for demo purposes
let posts = [];

let currentUser = null;
let currentFilter = 'all';
let uploadedImages = [];
let savedPosts = [];
let searchQuery = '';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Community page loaded');
    loadUserData();
    console.log('Current user:', currentUser);
    loadPostsFromStorage();
    loadSavedPosts();
    renderPosts();
    setupEventListeners();
});

// Load posts from localStorage
function loadPostsFromStorage() {
    const storedPosts = localStorage.getItem('communityPosts');
    if (storedPosts) {
        posts = JSON.parse(storedPosts);
    } else {
        // Initialize with sample posts if none exist
        posts = [
            {
                id: Date.now() + 1,
                author: 'John Smith',
                userType: 'engineer',
                avatar: '👷',
                timestamp: '2 hours ago',
                category: 'project',
                content: 'Just completed a modern residential project in downtown! The client wanted a minimalist design with sustainable materials. Here are some photos from the final walkthrough.',
                tags: ['Architecture', 'Residential', 'Sustainable'],
                images: ['projects/foundation.jpeg', 'projects/commercial.jpeg'],
                likes: 45,
                comments: [
                    { author: 'Sarah Lee', userType: 'client', text: 'Looks amazing! What materials did you use?', time: '1 hour ago' },
                    { author: 'Mike Johnson', userType: 'engineer', text: 'Great work! Love the clean lines.', time: '45 mins ago' }
                ],
                liked: false
            },
            {
                id: Date.now() + 2,
                author: 'Emily Davis',
                userType: 'client',
                avatar: '👩',
                timestamp: '5 hours ago',
                category: 'discussion',
                content: 'Looking for recommendations for a commercial building renovation. Budget is around $500K. Any experienced engineers available for consultation?',
                tags: ['Commercial', 'Renovation', 'Consultation'],
                images: [],
                likes: 28,
                comments: [
                    { author: 'Alex Chen', userType: 'engineer', text: "I've done several commercial renovations. Happy to discuss!", time: '4 hours ago' }
                ],
                liked: false
            },
            {
                id: Date.now() + 3,
                author: 'Robert Martinez',
                userType: 'engineer',
                avatar: '👨‍💼',
                timestamp: '1 day ago',
                category: 'project',
                content: 'Luxury villa project nearing completion. This one features smart home integration, infinity pool, and panoramic glass walls. The client is thrilled with the progress!',
                tags: ['Luxury', 'SmartHome', 'Villa'],
                images: ['projects/luxury.jpeg'],
                likes: 89,
                comments: [
                    { author: 'Lisa Wang', userType: 'client', text: 'Stunning design! How long did this take?', time: '18 hours ago' },
                    { author: 'Tom Brown', userType: 'engineer', text: 'The glass work is incredible!', time: '12 hours ago' },
                    { author: 'Jennifer Kim', userType: 'client', text: 'Would love to see more photos!', time: '8 hours ago' }
                ],
                liked: false
            }
        ];
        savePostsToStorage();
    }
}

// Save posts to localStorage
function savePostsToStorage() {
    localStorage.setItem('communityPosts', JSON.stringify(posts));
}

// Load user data from localStorage
function loadUserData() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        document.getElementById('userName').textContent = currentUser.name || currentUser.username;
        document.getElementById('userType').textContent = currentUser.role === 'engineer' ? 'Engineer' : 'Client';
        document.getElementById('userAvatar').textContent = currentUser.role === 'engineer' ? '👷' : '👤';
        document.getElementById('authLink').textContent = 'Logout';
        document.getElementById('authLink').href = '#';
        document.getElementById('authLink').onclick = logout;
        
        // Show create post section for logged-in users
        document.getElementById('createPostSection').style.display = 'block';
    } else {
        // Hide create post section for guests
        document.getElementById('createPostSection').style.display = 'none';
    }
}

// Load saved posts
function loadSavedPosts() {
    const saved = localStorage.getItem('savedPosts');
    if (saved) {
        savedPosts = JSON.parse(saved);
    }
    updateSavedCount();
}

// Update saved posts count
function updateSavedCount() {
    document.getElementById('savedCount').textContent = savedPosts.length;
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderPosts();
        });
    });

    // Submit post
    document.getElementById('submitPost').addEventListener('click', createPost);

    // Cancel post
    document.getElementById('cancelPost').addEventListener('click', function() {
        document.getElementById('postContent').value = '';
        document.getElementById('postTags').value = '';
        document.getElementById('imagePreview').innerHTML = '';
        uploadedImages = [];
    });

    // Image upload
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

    // Load more
    document.getElementById('loadMoreBtn').addEventListener('click', function() {
        alert('Loading more posts... (Feature coming soon!)');
    });

    // Tag filters
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent.replace('#', '');
            filterByTag(tagText);
        });
    });

    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // View saved posts
    document.getElementById('viewSavedBtn').addEventListener('click', showSavedPosts);
}

// Create new post
function createPost() {
    if (!currentUser) {
        alert('Please log in to post!');
        return;
    }

    const content = document.getElementById('postContent').value.trim();
    if (!content) {
        alert('Please write something to post!');
        return;
    }

    const category = document.getElementById('postCategory').value;
    const tags = document.getElementById('postTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);

    const newPost = {
        id: Date.now(), // Unique ID based on timestamp
        author: currentUser.name || currentUser.username,
        userType: currentUser.role,
        avatar: currentUser.role === 'engineer' ? '👷' : '👤',
        timestamp: 'Just now',
        category: category,
        content: content,
        tags: tags,
        images: uploadedImages.slice(), // Copy array
        likes: 0,
        comments: [],
        liked: false
    };

    posts.unshift(newPost);
    savePostsToStorage(); // Save to localStorage
    renderPosts();

    // Clear form
    document.getElementById('postContent').value = '';
    document.getElementById('postTags').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    uploadedImages = [];

    // Show success message
    showNotification('Post created successfully! Visible to all users.');
}

// Handle image upload
function handleImageUpload(e) {
    const files = e.target.files;
    const preview = document.getElementById('imagePreview');

    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            uploadedImages.push(imageUrl);

            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${imageUrl}" alt="Preview">
                <button class="remove-image" onclick="removeImage(${uploadedImages.length - 1})">×</button>
            `;
            preview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    }
}

// Remove image from upload
function removeImage(index) {
    uploadedImages.splice(index, 1);
    const preview = document.getElementById('imagePreview');
    preview.children[index].remove();
}

// Perform search
function performSearch() {
    searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
    renderPosts();
}

// Render posts
function renderPosts() {
    const feed = document.getElementById('postsFeed');
    let filteredPosts = posts;

    // Apply search filter
    if (searchQuery) {
        filteredPosts = filteredPosts.filter(post => 
            post.content.toLowerCase().includes(searchQuery) ||
            post.author.toLowerCase().includes(searchQuery) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
    }

    // Apply category filter
    if (currentFilter !== 'all') {
        filteredPosts = filteredPosts.filter(post => {
            if (currentFilter === 'engineer' || currentFilter === 'client') {
                return post.userType === currentFilter;
            }
            return post.category === currentFilter;
        });
    }

    if (filteredPosts.length === 0) {
        feed.innerHTML = '<div class="no-posts-message"><h3>No posts found</h3><p>Try adjusting your search or filters</p></div>';
        return;
    }

    feed.innerHTML = filteredPosts.map(post => `
        <div class="post-card" data-post-id="${post.id}">
            <div class="post-header">
                <div class="post-avatar">${post.avatar}</div>
                <div class="post-user-info">
                    <h4>${post.author} <span class="user-badge">${post.userType}</span></h4>
                    <div class="post-meta">
                        <span>${post.timestamp}</span>
                        <span>•</span>
                        <span>${getCategoryName(post.category)}</span>
                    </div>
                </div>
            </div>
            
            <div class="post-content">
                <p>${post.content}</p>
                ${post.images.length > 0 ? `
                    <div class="post-images">
                        ${post.images.map(img => `<img src="${img}" alt="Post image">`).join('')}
                    </div>
                ` : ''}
            </div>
            
            ${post.tags.length > 0 ? `
                <div class="post-tags-display">
                    ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="post-actions-bar">
                <button class="action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                    <span>${post.liked ? '❤️' : '🤍'}</span>
                    <span>${post.likes} Likes</span>
                </button>
                <button class="action-btn" onclick="toggleComments(${post.id})">
                    <span>💬</span>
                    <span>${post.comments.length} Comments</span>
                </button>
                <button class="action-btn ${savedPosts.includes(post.id) ? 'saved' : ''}" onclick="toggleSave(${post.id})">
                    <span>${savedPosts.includes(post.id) ? '📑' : '🔖'}</span>
                    <span>${savedPosts.includes(post.id) ? 'Saved' : 'Save'}</span>
                </button>
                <button class="action-btn" onclick="sharePost(${post.id})">
                    <span>🔗</span>
                    <span>Share</span>
                </button>
            </div>
            
            <div class="comments-section" id="comments-${post.id}" style="display: none;">
                ${post.comments.map(comment => `
                    <div class="comment">
                        <div class="comment-header">
                            <span class="comment-author">${comment.author} <span class="user-badge" style="font-size: 0.7rem;">${comment.userType || 'user'}</span></span>
                            <span class="comment-time">${comment.time}</span>
                        </div>
                        <div class="comment-text">${comment.text}</div>
                    </div>
                `).join('')}
                
                ${currentUser ? `
                    <div class="add-comment">
                        <input type="text" placeholder="Write a comment..." id="comment-input-${post.id}">
                        <button onclick="addComment(${post.id})">Post</button>
                    </div>
                ` : '<p style="text-align: center; color: #999; padding: 1rem;">Log in to comment</p>'}
            </div>
        </div>
    `).join('');
}

// Toggle like
function toggleLike(postId) {
    if (!currentUser) {
        alert('Please log in to like posts!');
        return;
    }

    const post = posts.find(p => p.id === postId);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        savePostsToStorage(); // Save changes
        renderPosts();
    }
}

// Toggle comments section
function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
}

// Add comment
function addComment(postId) {
    if (!currentUser) {
        alert('Please log in to comment!');
        return;
    }

    const input = document.getElementById(`comment-input-${postId}`);
    const commentText = input.value.trim();

    if (!commentText) return;

    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments.push({
            author: currentUser.name || currentUser.username,
            userType: currentUser.role, // Add user type to comments
            text: commentText,
            time: 'Just now'
        });
        input.value = '';
        savePostsToStorage(); // Save changes
        renderPosts();
        document.getElementById(`comments-${postId}`).style.display = 'block';
        showNotification('Comment added successfully!');
    }
}

// Get category display name
function getCategoryName(category) {
    const names = {
        project: 'Project Showcase',
        discussion: 'Discussion',
        question: 'Question',
        update: 'Update'
    };
    return names[category] || category;
}

// Filter by tag
function filterByTag(tagName) {
    const feed = document.getElementById('postsFeed');
    const filteredPosts = posts.filter(post => 
        post.tags.some(tag => tag.toLowerCase().includes(tagName.toLowerCase()))
    );

    if (filteredPosts.length === 0) {
        feed.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">No posts found with this tag.</p>';
    } else {
        // Temporarily render filtered posts
        const currentPosts = posts;
        posts = filteredPosts;
        renderPosts();
        posts = currentPosts;
    }
}

// Toggle save post
function toggleSave(postId) {
    if (!currentUser) {
        alert('Please log in to save posts!');
        return;
    }

    const index = savedPosts.indexOf(postId);
    if (index > -1) {
        savedPosts.splice(index, 1);
        showNotification('Post removed from saved');
    } else {
        savedPosts.push(postId);
        showNotification('Post saved successfully!');
    }

    localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
    updateSavedCount();
    renderPosts();
}

// Show saved posts
function showSavedPosts() {
    if (!currentUser) {
        alert('Please log in to view saved posts!');
        return;
    }

    if (savedPosts.length === 0) {
        showNotification('You have no saved posts');
        return;
    }

    const feed = document.getElementById('postsFeed');
    const savedPostsData = posts.filter(post => savedPosts.includes(post.id));
    
    if (savedPostsData.length === 0) {
        feed.innerHTML = '<div class="no-posts-message"><h3>No saved posts</h3><p>Posts you save will appear here</p></div>';
    } else {
        const currentPosts = posts;
        posts = savedPostsData;
        renderPosts();
        posts = currentPosts;
        showNotification('Showing saved posts');
    }
}

// Share post
function sharePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        const shareText = `Check out this post from ${post.author}: ${post.content.substring(0, 100)}...`;
        
        if (navigator.share) {
            navigator.share({
                title: 'BuildHub Community Post',
                text: shareText,
                url: window.location.href
            }).catch(() => copyToClipboard(shareText));
        } else {
            copyToClipboard(shareText);
        }
    }
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Link copied to clipboard!');
    }).catch(() => {
        showNotification('Failed to copy link');
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
