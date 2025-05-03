import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';

interface GalleryItem {
  id: string;
  sentence: string;
  filename: string;
  image_base64: string;
}

export default function AdminGallery() {
  const { data: session, status } = useSession();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [bulkActionInProgress, setBulkActionInProgress] = useState(false);
  const router = useRouter();

  // Check authentication status
  const isAuthenticated = status === 'authenticated' && session?.user?.isAdmin === true;
  const isLoading = status === 'loading';

  // Load gallery items when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllGalleryItems();
    }
  }, [isAuthenticated]);

  // Handle Google sign in
  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    signIn('google', { callbackUrl: '/admin' });
  };

  // Logout function
  const handleLogout = () => {
    signOut({ callbackUrl: '/admin' });
  };

  // Load all gallery items without limit
  const loadAllGalleryItems = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/gallery');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setGalleryItems(data.gallery || []);
      setFilteredItems(data.gallery || []);
    } catch (err) {
      setError(`Error loading gallery: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Search gallery items
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(galleryItems);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = galleryItems.filter(item => 
        item.sentence.toLowerCase().includes(query) || 
        item.filename.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);

      // Uncheck "Select All" checkbox when filtering results
      setSelectAll(false);
      setSelectedItems([]);
    }
  }, [searchQuery, galleryItems]);

  // Handle item selection
  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  // Update select all status based on selections
  useEffect(() => {
    if (filteredItems.length > 0 && selectedItems.length === filteredItems.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedItems, filteredItems]);

  // Delete a single gallery item
  const deleteGalleryItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove item from both lists
      setGalleryItems(galleryItems.filter(item => item.id !== id));
      setFilteredItems(filteredItems.filter(item => item.id !== id));
      
      // Remove from selected items if present
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
      
      setMessage('Item deleted successfully');

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(`Error deleting item: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Bulk delete selected gallery items
  const bulkDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      setError('No items selected for deletion');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedItems.length} selected items? This action cannot be undone.`)) {
      return;
    }

    setBulkActionInProgress(true);
    setError('');
    let deletedCount = 0;
    let errorCount = 0;

    // Create a copy of the selected items since we'll be manipulating the list
    const itemsToDelete = [...selectedItems];

    for (const id of itemsToDelete) {
      try {
        const response = await fetch(`/api/admin/gallery/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          deletedCount++;
          // Remove the deleted item from selected items
          setSelectedItems(prev => prev.filter(itemId => itemId !== id));
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error deleting item ${id}:`, error);
        errorCount++;
      }
    }

    // Update gallery items list
    loadAllGalleryItems();

    setBulkActionInProgress(false);
    
    if (errorCount > 0) {
      setMessage(`Deleted ${deletedCount} items. Failed to delete ${errorCount} items.`);
    } else {
      setMessage(`Successfully deleted ${deletedCount} items.`);
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedItems([]);
    setSelectAll(false);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div>
        <Head>
          <title>Admin Login - Almond Spark</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href="/images/logo.png" type="image/png" />
        </Head>

        <nav className="main-nav">
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/personal-note">Personal Note</Link></li>
          </ul>
        </nav>

        <div className="container">
          <header className="hero">
            <div className="title-container">
              <h1 className="main-title">Admin Login</h1>
              <p className="tagline">Manage your gallery</p>
            </div>
          </header>
          
          <main className="content">
            <section className="admin-login">
              {error && <div className="error-message">{error}</div>}
              {status === 'unauthenticated' && (
                <div className="admin-form">
                  <p className="admin-login-message">Please sign in with your Google account to access the admin area.</p>
                  <div className="button-wrapper">
                    <button 
                      onClick={handleLogin} 
                      className="admin-button google-login-button"
                      disabled={isLoading}
                    >
                      <i className="fa fa-google"></i> {isLoading ? 'Loading...' : 'Sign in with Google'}
                    </button>
                  </div>
                </div>
              )}
              {status === 'loading' && (
                <div className="admin-loading">
                  <div className="spinner"></div>
                  <p>Checking authentication...</p>
                </div>
              )}
              {status === 'authenticated' && !session?.user?.isAdmin && (
                <div className="error-message">
                  <p>Your account ({session?.user?.email}) is not authorized to access the admin area.</p>
                  <button onClick={() => signOut({ callbackUrl: '/admin' })} className="admin-button">
                    Sign Out
                  </button>
                </div>
              )}
            </section>
          </main>
        </div>

        <footer>
          <p>&copy; 2025 Almond Spark. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Admin Gallery - Almond Spark</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>

      <nav className="main-nav">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
          <li><Link href="/personal-note">Personal Note</Link></li>
          <li><Link href="/admin" className="active">Admin</Link></li>
        </ul>
      </nav>

      <div className="container">
        <header className="hero">
          <div className="title-container">
            <h1 className="main-title">Admin Gallery</h1>
            <p className="tagline">Manage your gallery items</p>
          </div>
        </header>
        
        <main className="content">
          <section className="admin-controls">
            <div className="admin-header">
              <h2>Gallery Management</h2>
              <div className="admin-user-info">
                {session?.user?.image && (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || 'Admin user'} 
                    className="admin-user-avatar" 
                  />
                )}
                <span className="admin-user-name">
                  {session?.user?.name || session?.user?.email}
                </span>
                <button onClick={handleLogout} className="admin-logout-button">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            </div>
            
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            
            <div className="admin-search-bar">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search by prompt or filename..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-search-input"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="admin-search-clear"
                    title="Clear search"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              
              <div className="admin-bulk-actions">
                <div className="selection-stats">
                  {selectedItems.length > 0 ? (
                    <span>{selectedItems.length} of {filteredItems.length} selected</span>
                  ) : (
                    <span>0 selected</span>
                  )}
                </div>
                <button
                  onClick={bulkDeleteSelected}
                  className="admin-bulk-delete-button"
                  disabled={selectedItems.length === 0 || bulkActionInProgress}
                  title="Delete selected items"
                >
                  {bulkActionInProgress ? (
                    <>
                      <div className="spinner-small"></div> Deleting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash-alt"></i> Delete Selected
                    </>
                  )}
                </button>
                {selectedItems.length > 0 && (
                  <button
                    onClick={clearSelections}
                    className="admin-clear-selection-button"
                    title="Clear selection"
                  >
                    <i className="fas fa-times"></i> Clear
                  </button>
                )}
              </div>
            </div>
            
            <div className="admin-gallery">
              {loading ? (
                <div className="gallery-loading">
                  <div className="spinner"></div>
                  <p>Loading gallery items...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="gallery-empty">
                  {searchQuery ? (
                    <p>No gallery items match your search query.</p>
                  ) : (
                    <p>No gallery items available.</p>
                  )}
                </div>
              ) : (
                <>
                  <div className="admin-select-all">
                    <label className="admin-checkbox-container">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                      />
                      <span className="admin-checkbox-label">Select All ({filteredItems.length} items)</span>
                    </label>
                  </div>
                  
                  <div className="admin-grid">
                    {filteredItems.map((item) => (
                      <div key={item.id} className={`admin-item ${selectedItems.includes(item.id) ? 'selected' : ''}`}>
                        <div className="admin-item-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleItemSelection(item.id)}
                          />
                        </div>
                        <div className="admin-item-image">
                          <img
                            src={`data:image/png;base64,${item.image_base64}`}
                            alt={item.sentence}
                            className="gallery-image"
                          />
                        </div>
                        <div className="admin-item-details">
                          <p className="admin-item-sentence">{item.sentence}</p>
                          <p className="admin-item-filename">File: {item.filename}</p>
                          <div className="admin-item-actions">
                            <button 
                              onClick={() => deleteGalleryItem(item.id)}
                              className="admin-delete-button"
                              title="Delete this item"
                            >
                              <i className="fas fa-trash-alt"></i> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
      </div>

      <footer>
        <p>&copy; 2025 Almond Spark. All rights reserved.</p>
      </footer>
    </div>
  );
}