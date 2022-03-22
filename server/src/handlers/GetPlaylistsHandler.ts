import Joi from "joi"
import { DB } from '../Database'
import { MessageHandler } from "../MessageHandler"


async function onMessage() : Promise<any> {
    const playlists = await DB.runQuery('get_playlists')    

    return { playlists }
}

const schema = {}

export const GetPlaylistsHandler = new MessageHandler(
    'get_playlists',
    schema,
    onMessage
)