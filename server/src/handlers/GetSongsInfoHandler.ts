import { DB } from '../Database'
import { MessageHandler } from '../MessageHandler'


async function onMessage(): Promise<any> {
    const songsInfo = await DB.runQuery('get_songs_info')
    
    return { songsInfo };
}

const schema = {}

export const GetSongsInfoHandler =  new MessageHandler(
    'get_songs_info',
    schema,
    onMessage
)