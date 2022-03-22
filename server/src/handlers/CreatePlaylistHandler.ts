import Joi from "joi"
import { DB } from '../Database'
import { MessageHandler } from "../MessageHandler"
import { Playlist } from '../tableDefinitions'

async function onMessage(msg : Playlist): Promise<any> {
    const playlist = await DB.runQuery('create_playlist', msg.playlist_name, msg.creator, msg.date_created)

    return { playlist }
}

const schema = {
    _id: Joi.optional(),
    id: Joi.optional(),
    'playlist_name' : Joi.string().required(),
    'creator' : Joi.string().required(),
    'date_created' : Joi.string().isoDate().required()
}

export const CreatePlaylistHandler = new MessageHandler(
    'create_playlist',
    schema,
    onMessage
)