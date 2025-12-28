import { Playlist } from '@/types';

export const playlists: Playlist[] = [
  {
    id: '1',
    title: 'WIZ FOLDER',
    description: 'A collection of wizard-level beats and tracks',
    coverImage: '',
    embedCode: '<iframe width="100%" height="450" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1869453329%3Fsecret_token%3Ds-V24huOY4aEO&color=%23a17165&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/haksmusic" title="HAKSMUSIC" target="_blank" style="color: #cccccc; text-decoration: none;">HAKSMUSIC</a> · <a href="https://soundcloud.com/haksmusic/sets/wiz-folder/s-V24huOY4aEO" title="WIZ FOLDER" target="_blank" style="color: #cccccc; text-decoration: none;">WIZ FOLDER</a></div>',
    tracks: 24,
    duration: '1h 12m',
    creator: 'SUNLAND MUSIC',
    category: 'Beats'
  },
  {
    id: '2',
    title: 'VIBES',
    description: 'Smooth vibes and atmospheric sounds',
    coverImage: '',
    embedCode: '<iframe width="100%" height="450" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1879746482%3Fsecret_token%3Ds-VXxKAvIsXDA&color=%23a17c46&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/haksmusic" title="HAKSMUSIC" target="_blank" style="color: #cccccc; text-decoration: none;">HAKSMUSIC</a> · <a href="https://soundcloud.com/haksmusic/sets/seckou-possibles/s-VXxKAvIsXDA" title="VIBES" target="_blank" style="color: #cccccc; text-decoration: none;">VIBES</a></div>',
    tracks: 18,
    duration: '1h 45m',
    creator: 'SUNLAND MUSIC',
    category: 'Chill'
  },
  {
    id: '3',
    title: 'AFRO SEPT 2024',
    description: 'The best Afrobeats tracks from September 2024',
    coverImage: '',
    embedCode: '<iframe width="100%" height="450" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1884134066%3Fsecret_token%3Ds-7ETAQ2PlUXa&color=%235b3c28&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/haksmusic" title="HAKSMUSIC" target="_blank" style="color: #cccccc; text-decoration: none;">HAKSMUSIC</a> · <a href="https://soundcloud.com/haksmusic/sets/afro-september-2024/s-7ETAQ2PlUXa" title="AFRO SEPT 2024" target="_blank" style="color: #cccccc; text-decoration: none;">AFRO SEPT 2024</a></div>',
    tracks: 15,
    duration: '58m',
    creator: 'SUNLAND MUSIC',
    category: 'Afrobeats'
  },
  {
    id: '4',
    title: 'MORE MUSIC',
    description: 'A diverse collection of tracks for every mood',
    coverImage: '',
    embedCode: '<iframe width="100%" height="450" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1935391851%3Fsecret_token%3Ds-C4HJ2JS589L&color=%23544a48&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/haksmusic" title="HAKSMUSIC" target="_blank" style="color: #cccccc; text-decoration: none;">HAKSMUSIC</a> · <a href="https://soundcloud.com/haksmusic/sets/more-music/s-C4HJ2JS589L" title="MORE MUSIC" target="_blank" style="color: #cccccc; text-decoration: none;">MORE MUSIC</a></div>',
    tracks: 20,
    duration: '1h 30m',
    creator: 'SUNLAND MUSIC',
    category: 'Mix'
  }
];

export const categories = [
  'All',
  'Beats',
  'Chill',
  'Afrobeats',
  'Mix'
];

export const getFeaturedPlaylists = () => {
  return playlists;
};

export const getPlaylistsByCategory = (category: string) => {
  if (category === 'All') return playlists;
  return playlists.filter(playlist => playlist.category === category);
};

export const getPlaylistById = (id: string) => {
  return playlists.find(playlist => playlist.id === id);
};