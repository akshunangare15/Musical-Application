import Joi from 'joi'
import { Socket } from 'socket.io'
import { DB } from '../Database'
import { MessageHandler } from '../MessageHandler'
import { Song } from '../tableDefinitions'

async function onMessage(msg : Song, socket: Socket): Promise<any> {

    if(msg.cover_art === undefined || msg.cover_art === null) {
        msg.cover_art = null
    }

    const songsInfo = await DB.runQuery('add_song', msg.artist_name, msg.song_title, msg.notes, msg.cover_art)
    
    return { songsInfo }
}

const schema = {
    id: Joi.optional(),
    _id: Joi.optional(),
    'artist_name': Joi.string().required(),
    'song_title': Joi.string().required(),
    'notes': Joi.string().optional(),
    'cover_art': Joi.binary().encoding('base64').optional()
}

export const AddSongHandler = new MessageHandler(
    'add_song',
    schema,
    onMessage
)