import Joi from "joi"
import { DB } from '../Database'
import { MessageHandler } from "../MessageHandler"
import { PlaylistContent } from '../tableDefinitions'

async function onMessage(msg : PlaylistContent): Promise<any> {
    const contents = await DB.runQuery('get_playlist_content', msg.playlist_id)
    console.log(contents)
    return { contents }
}

const schema = {
    _id: Joi.optional(),
    id: Joi.optional(),
    'playlist_id': Joi.number().positive().required()
}

export const GetPlaylistContentHandler = new MessageHandler(
    'get_playlist_content',
    schema,
    onMessage
)