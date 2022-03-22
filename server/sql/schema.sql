-- NOTE: I figured we'd want this for the section on SQL
PRAGMA foreign_keys;

-- NOTE: For the SQL assignment, we could have them normalize
-- this database farther. Perhaps they can learn about SERIAL and
-- then go implement a way to change a room_name without losing
-- references by using a FOREIGN KEY into a rooms table with an 
-- int primary key.
CREATE TABLE songs (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	artist_id NOT NULL,
	song_title TEXT NOT NULL,
	notes VARCHAR NOT NULL,
    cover_art BLOB NULL,
	CONSTRAINT fk_artist_id
	    FOREIGN KEY(artist_id)
	    REFERENCES artist(artist_id)
        ON DELETE CASCADE
);

CREATE TABLE artist (
    artist_id INTEGER PRIMARY KEY AUTOINCREMENT,
    artist_name TEXT UNIQUE NOT NULL,
    `image` BLOB NULL,
    country varchar NOT NULL
);

CREATE TABLE playlist (
    playlist_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    playlist_name TEXT NOT NULL,
    creator TEXT NOT NULL,
    date_created TEXT NOT NULL,
    cover_art BLOB NULL
);

CREATE TABLE playlist_contents (
    contents_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    playlist_id NOT NULL,
    song_id NOT NULL,
    CONSTRAINT fk_playlist
        FOREIGN KEY(playlist_id)
        REFERENCES playlist(playlist_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_song
        FOREIGN KEY(song_id)
        REFERENCES songs(id)
        ON DELETE CASCADE
);

-- INSERT INTO songs (id, song_title, notes) 
-- VALUES (1, 'Ode to Joy (Dubstep Remix)', 'E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4 D4 D4');


INSERT INTO artist(artist_name, country, `image`) VALUES ("Friedrich Schiller", "Germany", NULL);
INSERT INTO artist(artist_name, country, `image`) VALUES ("Shane", "CA, USA", NULL);
INSERT INTO artist(artist_name, country, `image`) VALUES ("Alex", "China", NULL);
INSERT INTO artist(artist_name, country, `image`) VALUES ("Ramzi", "Lebanon", NULL);
INSERT INTO artist(artist_name, country, `image`) VALUES ("Bhavana", "India", NULL);

INSERT INTO songs(id, artist_id, song_title, notes) VALUES (1, 1, "Ode To Joy (Dubstep Remix)", "E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4 D4 D4");
INSERT INTO playlist(playlist_name, creator, date_created) VALUES ('Classical Music', 'Ramzi', datetime('now'));
