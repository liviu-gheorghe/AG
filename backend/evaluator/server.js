var http = require('http');
var child_process = require('child_process');

http.createServer(
    (request,response) => {
        if(request.method != "POST" || request.url != "/")
        {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            json_string = JSON.stringify({'message':'Bad Request'});
            response.end(json_string);
        }
        let request_body = '';
        request.on('data' , chunk => {
            request_body+=chunk.toString();
        });
        request.on('end',() => {
        // Get the type of the source from the request to know what 
        // type of worker should be called
        try 
        {
            var type_of_source = JSON.parse(request_body).type_of_source;
        } 
        catch(error) 
        {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            json_string = JSON.stringify({ 'message': 'Bad Request' });
            response.end(json_string);       
        }
        // Call the required worker subprocess based on the type of the language 
        // and provide the request body as a json string
            child_process.exec(`python3 /workers/${type_of_source}_worker.py '${request_body}'`,
            (error,stdout,stderr) => {
                if(error)
                {
                    response.writeHead(500, { 'Content-Type':'application/json'});
                    response.end(`"message":${error}`); 
                }
                else
                {
                    response.writeHead(200, { 'Content-Type':'application/json'});
                    response.end(stdout); 
                }
            }
        ) 
        });
    }
).listen(8080);