import Joi from "joi"
import { DB } from "../Database"
import { MessageHandler } from "../MessageHandler"
import { PlaylistContent } from '../tableDefinitions'

async function onMessage(msg: PlaylistContent) {
    const playlistEntry = await DB.runQuery('add_song_to_playlist', msg.playlist_id, msg.song_id)
    
    return { playlistEntry }
}

const schema = {
    id: Joi.optional(),
    _id: Joi.optional(),
    'playlist_id': Joi.number().positive().integer().required(),
    'song_id': Joi.number().positive().integer().required()
}

export const AddSongToPlaylistHandler = new MessageHandler(
    'add_song_to_playlist',
    schema,
    onMessage
)