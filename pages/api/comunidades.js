import {SiteClient} from 'datocms-client';

export default async function requestReceiver(request, response) {
    
    if(request.method === 'POST'){
        const tokenFull = 'aa620473d54952e733542c5577ba3a';
    const client = new SiteClient(tokenFull)
    

    //Deveria validar os dados
    const createdRecord = await client.items.create({
        itemType: '976024', //ID to model de comunidade gerado pelo DatoCMS
        ...request.body,
    })

    response.json({
        data: 'nada nada',
        record: createdRecord
    })
    }
    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST temos!'
    })
}