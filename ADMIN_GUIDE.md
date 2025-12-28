# Stream Pharm Admin Panel Guide

## Overview

The Stream Pharm admin panel is a simple, web-based interface that allows you to manage all content on your platform. Upload tracks, create playlists, and manage content with just a few clicks.

## Accessing the Admin Panel

1. Navigate to `streampharm.com/admin` in your web browser
2. You'll be prompted to log in with your admin credentials
3. Enter your email and password, then click "Sign In"

## Creating Your First Admin Account

Before you can use the admin panel, you need to create an admin account:

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Run this SQL command (replace with your actual email):

```sql
-- First, create an auth user
-- (You can also do this through the Supabase Auth UI)

-- Then, add the user to the admin_users table
INSERT INTO admin_users (id, email, full_name)
VALUES (
  'YOUR_USER_ID_FROM_AUTH',
  'admin@streampharm.com',
  'Admin Name'
);
```

Or use the Supabase Dashboard:
1. Go to Authentication → Users
2. Click "Invite User"
3. Enter the admin email and password
4. Once created, copy the user ID
5. Go to Table Editor → admin_users
6. Click "Insert" → "Insert row"
7. Paste the user ID and fill in the email and name
8. Click "Save"

## Using the Admin Panel

### Dashboard

After logging in, you'll see the main dashboard with:
- **Dashboard Stats**: Total tracks, playlists, artists, and plays
- **Quick Actions**: Three main buttons for uploading tracks, creating playlists, and managing content

### Uploading a Track

1. Click **"Upload Track"** from the dashboard
2. Fill in the track information:
   - **Track Title**: Enter the song name
   - **Artist Name**: Type or select from existing artists
   - **Album Name**: Optional album name
   - **Genre**: Select from the genre chips
3. Upload files:
   - Click **"Select Audio File"** to upload the MP3 or audio file
   - Click **"Select Cover Image"** to upload album artwork (square images work best)
4. Click **"Upload Track"** and wait for the upload to complete
5. Choose to upload another track or return to the dashboard

### Creating a Playlist

1. Click **"Create Playlist"** from the dashboard
2. Fill in playlist information:
   - **Playlist Title**: Enter the playlist name
   - **Description**: Brief description of the playlist
   - **Curator Name**: Type or select from existing artists
   - **Category**: Select the playlist category (Mix, Hip-Hop, etc.)
   - Check **"Mark as Featured"** if you want it on the homepage
   - Upload a cover image
3. Add tracks to the playlist:
   - Search for tracks using the search box
   - Click the **+** button to add tracks
   - Selected tracks appear at the top
   - Use the up/down arrows to reorder tracks
   - Click the X button to remove tracks
4. Click **"Create Playlist"** when done
5. Choose to create another or return to dashboard

### Managing Content

1. Click **"Manage Content"** from the dashboard
2. Use the tabs to switch between:
   - **Tracks**: View all uploaded tracks
   - **Playlists**: View all created playlists
3. Use the search bar to find specific content
4. Click the **trash icon** to delete any track or playlist
5. You'll be asked to confirm before deletion

### Logging Out

Click the **"Logout"** button at the bottom of the dashboard to sign out safely.

## Tips and Best Practices

### For Tracks
- Use high-quality audio files (320kbps MP3 recommended)
- Album artwork should be square (1:1 aspect ratio), at least 1000x1000px
- Enter complete track information for better organization
- Create artist profiles before uploading multiple tracks from the same artist

### For Playlists
- Create playlists with at least 5-10 tracks for a good listening experience
- Use descriptive titles and descriptions
- Choose appropriate categories to help users discover content
- Mark your best playlists as "Featured" to showcase them on the homepage
- Order tracks thoughtfully for flow and listening experience

### For Images
- Use square images (1:1 ratio) for best display
- Recommended size: 1000x1000 pixels minimum
- Keep file sizes under 5MB
- JPEG or PNG formats work best

## Troubleshooting

### Can't Log In
- Make sure you're using the correct email and password
- Verify that your account has been added to the `admin_users` table in Supabase
- Check that your admin account is active in Supabase Authentication

### Upload Fails
- Check your internet connection
- Ensure the audio file is in a supported format (MP3, AAC, M4A)
- Verify that image files are JPEG or PNG
- Make sure file sizes aren't too large (audio < 50MB, images < 5MB)

### Content Not Appearing
- Refresh the app to see newly uploaded content
- Check that the upload completed successfully
- Verify that tracks are added to playlists correctly

## Support

For technical support or questions about the admin panel, contact your development team.

## Security Notes

- Never share your admin credentials
- Always log out when finished
- Use a strong, unique password
- Admin access is powerful - be careful when deleting content
- Deletions are permanent and cannot be undone
