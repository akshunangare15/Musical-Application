// 3rd party library imports
import classNames from "classnames";
import { List } from "immutable";
import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import {
  RadioButton20,
  RadioButtonChecked20,
  Music20,
} from "@carbon/icons-react";
import ReactModal from "react-modal";

// project imports
import { initializeSocket, send } from "./Socket";
import { DispatchAction } from "./Reducer";
import { AppState } from "./State";
import { Instrument } from "./Instruments";
import { Visualizer } from "./Visualizers";

/** ------------------------------------------------------------------------ **
 * All the components in the side navigation.
 ** ------------------------------------------------------------------------ */

interface SideNavProps {
  state: AppState;
  dispatch: React.Dispatch<DispatchAction>;
}

const Section: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <div className="flex flex-column h-25 bb b--light-gray pa3">
      <div className="fw7 mb2">{title} </div>
      <div className="flex-auto overflow-scroll">{children}</div>
    </div>
  );
};

interface RadioButtonProps {
  to: any;
  text: string;
  active: boolean;
  onClick: () => void;
}

function RadioButton({
  to,
  text,
  active,
  onClick,
}: RadioButtonProps): JSX.Element {
  return (
    <Link to={to} className="no-underline">
      <div
        className={classNames("f6 flex items-center black", { fw7: active })}
        onClick={onClick}
      >
        {active ? (
          <RadioButtonChecked20 className="mr1" />
        ) : (
          <RadioButton20 className="mr1" />
        )}
        <div className="dim">{text}</div>
      </div>
    </Link>
  );
}

function Instruments({ state }: SideNavProps): JSX.Element {
  const instruments: List<Instrument> = state.get("instruments");
  const activeInstrument = state.get("instrument")?.name;
  const location = useLocation();
  return (
    <Section title="Instruments">
      {instruments.map((i) => (
        <RadioButton
          key={i.name}
          to={`/${i.name}${location.search}`}
          text={i.name}
          active={i.name === activeInstrument}
          onClick={() => console.log(i.name)}
        />
      ))}
    </Section>
  );
}

function Visualizers({ state }: SideNavProps): JSX.Element {
  const visualizers: List<Visualizer> = state.get("visualizers");
  const activeVisualizer = state.get("visualizer")?.name;
  const location = useLocation();

  return (
    <Section title="Visualizers">
      {visualizers.map((v) => (
        <RadioButton
          key={v.name}
          to={{
            pathname: location.pathname,
            search: `?visualizer=${v.name}`,
          }}
          text={v.name}
          active={v.name === activeVisualizer}
          onClick={() => console.log(v.name)}
        />
      ))}
    </Section>
  );
}

function Songs({ state, dispatch }: SideNavProps): JSX.Element {
  const songs: List<any> = state.get("songs", List());

  const songStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
  };

  const textStyle: React.CSSProperties = {
    margin: 0,
  };

  const imageStyle: React.CSSProperties = {
    height: "50px",
  };

  return (
    <Section title="Songs">
      {songs === undefined ? (
        <div>This playlist has no songs. You're out of luck...</div>
      ) : (
        songs.map((song) => (
          <div
            key={song.get("id")}
            className="f6 pointer underline flex items-center no-underline i dim"
            onClick={() =>
              dispatch(new DispatchAction("PLAY_SONG", { id: song.get("id") }))
            }
          >
            {song.get("image") == null ? (
              <Music20 className="mr2" />
            ) : (
              <img
                className="mr2"
                src={`data:image;base64,${song.get("image")}`}
                alt={`${song.get("songTitle")} cover art`}
                style={imageStyle}
              />
            )}

            <div style={songStyle}>
              <p style={textStyle}>{song.get("songTitle")}</p>
              <p style={textStyle}>{song.get("artistName")}</p>
            </div>
          </div>
        ))
      )}
    </Section>
  );
}

function Playlists({ state, dispatch }: SideNavProps): JSX.Element {
  //const songs: List<any> = state.get("songs", List());
  const [show, setShow] = useState(false);

  const playlists: List<any> = state.get("playlists", List());

  const playlistStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
  };

  const textStyle: React.CSSProperties = {
    margin: 0,
  };

  const imageStyle: React.CSSProperties = {
    height: "50px",
  };


  return (
    <Section title="Playlist">
      {playlists.map((playlist) => (
        <div
          key={playlist.get("playlistId")}
          className="f6 pointer underline flex items-center no-underline i dim"
          onClick= {async () => {
            const { contents } = await send(
              state.get("socket"),
              "get_playlist_content",
              { playlist_id: playlist.get("playlistId") }
            )
            console.log('CONTENTS')
            
            
            console.log(contents)
            
            dispatch(new DispatchAction("SET_SONGS", {songs: contents }));
          }}
        >
          {playlist.get("coverArt") == null ? (
            <Music20 className="mr2" />
          ) : (
            <img
              className="mr2"
              src={`data:image;base64,${playlist.get("coverArt")}`}
              alt={`${playlist.get("playlistName")} cover art`}
              style={imageStyle}
            />
          )}

          <div style={playlistStyle}>
            <p style={textStyle}>{playlist.get("playlistName")}</p>
            <p style={textStyle}>{playlist.get("creator")}</p>
          </div>

          <AddSongModal
            key={`modal-playlist-${playlist.get("playlistId")}`}
            state={state}
            dispatch={dispatch}
            playlistID={playlist.get("playlistId")}
            setShow={setShow}
            showed={show}
          ></AddSongModal>
        </div>
      ))}
    </Section>
  );
}

interface SongModalProps {
  state: AppState;
  dispatch: React.Dispatch<DispatchAction>;
  playlistID: number;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  showed: boolean;
}

function AddSongModal({
  state,
  dispatch,
  playlistID,
  showed,
  setShow,
}: SongModalProps): JSX.Element {
  const getAllSongs = async () => {
    if (!showed) {
      showed = true;
      setShow(showed);
      const allSongs = await send(state.get("socket"), "get_songs", {});
      dispatch(new DispatchAction("SHOW_ALL_SONGS", { allSongs }));
    } else {
      showed = false;
      setShow(showed);
    }
  };

  const addSongToPlaylist = async (song: any) => {
    await send(state.get("socket"), "add_song_to_playlist", {
      playlist_id: playlistID,
      song_id: song.get("id"),
    });
    

    const { songs } = await send(state.get("socket"), "get_playlist_conents", {
        playlist_id: playlistID
    });
    
    console.log("SONGS CONTENT")
    console.log(songs)

    dispatch(new DispatchAction("SET_SONGS", { songs }));
    

    // const { playlistContents } = await send(state.get('socket'), '')
  };

  let allSongs: List<any> = state.get("all_songs", List());

  let modalStyle = {
    overlay: {
      display: "table",
      top: "55%",
      left: "16rem",
      //margin: "10px",
      //width: "50%",
      margin: "0 auto",
      height: "40%",
      backgroundColor: "rgba(255, 255, 255, 0.75)",
    },
    content: {
      //textAlign: "center",
      border: "1px solid #ccc",
      margin: "0 auto",
      background: "#fff",
      borderRadius: "4px",
      outline: "none",
      padding: "20px",
      //margin: "10px",
    },
  };

  return (
    <>
      <IconButton style={{ marginLeft: "auto" }} onClick={getAllSongs}>
        <AddRoundedIcon />
      </IconButton>
      <ReactModal className="ma5" style={modalStyle} isOpen={showed}>
        {allSongs === undefined ? (
          <div>There are no songs. You're out of luck...</div>
        ) : (
          allSongs.map((song) => (
            <div
              key={`addSongModal-${song.get(0).get("id")}`}
              className="f6 pointer underline flex items-center no-underline i dim"
            >
              {song.get(0).get("image") == null ? (
                <Music20
                //className="mr2"
                />
              ) : (
                <img
                  className="mr2 h3"
                  src={`data:image;base64,${song.get(0).get("image")}`}
                  alt={`${song.get(0).get("songTitle")} cover art`}
                />
              )}

              <div>
                <p>{song.get(0).get("songTitle")}</p>
                <p>{song.get(0).get("artistName")}</p>
                {console.log(`${song.get(0).get('id')} - ${song.get(0).get('songTitle')}`)}
              </div>
              <AddRoundedIcon
                onClick={() => {
                  setShow(false);
                  addSongToPlaylist(song.get(0));
                }}
              />
            </div>
          ))
        )}
      </ReactModal>
    </>
  );
}

function PlaylistModal({ state, dispatch }: SideNavProps): JSX.Element {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let modalStyle = {
    overlay: {
      display: "table",
      top: "50%",
      //margin: "10px",
      //width: "50%",
      margin: "0 auto",
      height: "40%",
      backgroundColor: "rgba(255, 255, 255, 0.75)",
    },
    content: {
      //textAlign: "center",
      border: "1px solid #ccc",
      margin: "0 auto",
      background: "#fff",
      borderRadius: "4px",
      outline: "none",
      padding: "20px",
      //margin: "10px",
    },
  };

  let namePlaylist = "testName";
  let creatorPlaylist = "testcreatorName";
  let timePlaylistCreated = new Date(Date.now()).toISOString();

  function createPlaylist() {
    // add playlist to database
    dispatch(
      new DispatchAction("CREATE_PLAYLIST", {
        playlist_name: namePlaylist,
        creator: creatorPlaylist,
        date_created: timePlaylistCreated,
        cover_art: null,
      })
    );
    update();
    handleClose();
  }

  const update = async () => {
    const { playlists } = await send(state.get("socket"), "get_playlists", {});
    dispatch(new DispatchAction("SET_PLAYLISTS", { playlists }));
  };

  return (
    <>
      <button onClick={handleShow} type="button" className="btn btn-default">
        +
      </button>

      <ReactModal className="ma5" style={modalStyle} isOpen={show}>
        <TextField
          id="playlist-name-text-field"
          className="playlist-modal-text-field"
          margin="normal"
          label="Name"
          variant="outlined"
          onChange={(event) => {
            namePlaylist = event.currentTarget.value;
          }}
          required
        />

        <TextField
          id="playlist-name-text-field"
          className="playlist-modal-text-field"
          margin="normal"
          label="Creator"
          variant="outlined"
          onChange={(event) => {
            creatorPlaylist = event.currentTarget.value;
          }}
          required
        />

        <div>
          <Button onClick={createPlaylist} variant="outlined">
            Submit
          </Button>
          <Button
            onClick={handleClose}
            type="button"
            className="btn btn-primary"
          >
            Cancel
          </Button>
        </div>
      </ReactModal>
    </>
  );
}

export function SideNav({ state, dispatch }: SideNavProps): JSX.Element {
  return (
    <div className="absolute top-0 left-0 bottom-0 w5 z-1 shadow-1 bg-white flex flex-column">
      <div className="h3 fw7 f5 flex items-center pl3 bb b--light-gray">
        Sleep Deprived's App
      </div>
      <div className="flex-auto">
        <Instruments state={state} dispatch={dispatch} />
        <Visualizers state={state} dispatch={dispatch} />
        <PlaylistModal state={state} dispatch={dispatch} />
        <Playlists state={state} dispatch={dispatch} />
        <Songs state={state} dispatch={dispatch} />
      </div>
    </div>
  );
}
