let CrudController = (app, middleware, api_version, modelType, model) => {

    /*  endpoint: /models/:id
     *  GET ONE
     */
    middleware(app, api_version+modelType+'s/:id')
    app.get(api_version+modelType+'s/:id', function (req, res) {
        model.findById(req.params.id)
        .then(modelResponse => {
            
            if(modelResponse) {
                let responseModel = {}
                responseModel[modelType] = modelResponse
                res.send(JSON.stringify(responseModel))
            } else
                res.status(404).send({
                   message: modelType + ', does not exist'
                })
                
        }).catch(error => res.status(500).end())
    })

    /*  endpoint: /models
     *  GET ALL
     */
    app.get(api_version+modelType+'s', function (req, res) {
        model.findAndCountAll({
            where: {},
            offset: (req.query.page - 1) *   30,
            limit: 30
        })
        .then(result => {

            let responseModel = {}
            responseModel[modelType + 's'] = result.rows
            responseModel['counts'] = result.rows.length
            responseModel['total'] = result.count
            responseModel['limit'] = 30
            res.send(JSON.stringify(responseModel))
        }).catch(error => res.status(500).end())
    })
    
    /*  endpoint: /models
     *  POST CREATE
     */
    app.post(api_version+modelType+'s', function (req, res) {
        model.build(req.body)
            .save()
            .then(modelResponse => {
                let responseModel = {}
                responseModel[modelType] = modelResponse
                res.send(JSON.stringify(responseModel))
            })
            .catch(error => res.status(500).end())
    })

    /*  endpoint: /models/:id
     *  DELETE DELETE
     */
    app.delete(api_version+modelType+'s/:id', function (req, res) {
        console.log('id: ', req.params.id)
        model.destroy({
            where: {
                id: req.params.id
            }
        }).then(isDelete => {
            isDelete ? 
            res.send({
                message: modelType + ', successfully deleted'
            }) :
            res.status(404).send({
                message: modelType + ', does not exist'
            })
        })
        .catch(error => res.status(500).end())
    })

    /*  endpoint: /models/:id
     *  PUT UPDATE
     */
    app.put(api_version+modelType+'s/:id', function (req, res) {
        model.update(
            req.body,
            { where: { id: req.params.id }}
            )
            .then(isUpdate => {
                if(isUpdate == 1) {
                    model.findById(req.params.id)
                    .then(modelResponse => {
                        let responseModel = {}
                        responseModel[modelType] = modelResponse
                        res.send(JSON.stringify(responseModel))
                    }).catch(error => res.status(500).end())
                } else {
                    res.status(404).send({
                        message: modelType + ', does not exist'
                    })
                }
            })
            .catch(error => res.status(500).end())
    })
}

export default CrudController
