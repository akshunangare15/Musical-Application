import Joi, {ObjectSchema, Schema } from 'joi'
import { Socket } from 'socket.io'
import { DB } from '../Database'
import { MessageHandler } from '../MessageHandler'
import { Artist } from '../tableDefinitions'

// how to pass in args with signal?
async function onMessage(msg: Artist, socket: Socket): Promise<any> {

    if(msg.image === undefined || msg.image === null) {
        msg.image = null
    }

    const songsInfo = await DB.runQuery('add_artist', msg.artist_name, msg.image, msg.country)

    return { songsInfo }
}

const schema = {
    _id: Joi.optional(),
    id: Joi.optional(),
    'artist_id': Joi.number().positive().optional(),
    'artist_name': Joi.string().required(),
    'country': Joi.string().required(),
    'image': Joi.binary().encoding('base64').optional()
}

export const AddArtistHandler = new MessageHandler(
    'add_artist',
    schema,
    onMessage
)
