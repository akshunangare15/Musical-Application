export interface Artist {
    artist_name: string
    image: string | undefined | null
    country: string
}

export interface Song {
    artist_name : string
    song_title : string,
    notes : string
    cover_art : string | undefined | null
}

export interface Playlist {
    playlist_name : string
    creator : string
    date_created : string
    cover_art : string | null | undefined
}

export interface PlaylistContent {
    playlist_id: number
    song_id: number | null | undefined
}