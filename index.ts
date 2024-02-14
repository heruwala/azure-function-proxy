import { AzureFunction, Context, HttpRequest } from '@azure/functions';
const axios = require('axios');

/**
 * Azure Function to perform legacy authentication for EPIC API calls
 * @param context {Context} An object containing the context of the function
 * @param req {HttpRequest} An object containing the request
 */
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    let reqUrl = req.url;
    context.log('Request URL: ' + reqUrl);

    // req.url http://localhost:7071/api/proxy/doc/prod/servlet/DisplayDocServlet?protocol=79615069526c5159665764673869544f6f394e7a6e737234573750466144524c626c596b48596d62637364416c7747435a31417969444d3055666a4454714b5971455846636b495737676c5231734f31314d31674c75413430453058304b336d4f512f696d7154743339384744506856634e4a504249414f6a4d4377565378627632355a6f3053477452314e7a4e72316835304e2f6b6c6f4b694f6c50747545304a41317567596d325a6b3d
    // transform to https://apps.target.org/doc/prod/servlet/DisplayDocServlet?protocol=79615069526c5159665764673869544f6f394e7a6e737234573750466144524c626c596b48596d62637364416c7747435a31417969444d3055666a4454714b5971455846636b495737676c5231734f31314d31674c75413430453058304b336d4f512f696d7154743339384744506856634e4a504249414f6a4d4377565378627632355a6f3053477452314e7a4e72316835304e2f6b6c6f4b694f6c50747545304a41317567596d325a6b3d

    const targetAppURI = process.env.TARGET_APP_URI;

    let transformedUrl = reqUrl.replace('http://localhost:7071/api/proxy', targetAppURI);

    context.log('website URL: ' + transformedUrl);

    // if the response has any stylesheets reference to /epermit/prod, replace them with https://apps.nbme.org/epermit/prod
    let response = await axios.get(transformedUrl);
    context.log('Response: ' + response);
    context.res = {
        status: response.status,
        body: response.data.replace(/\/epermit\/prod/g, targetAppURI + '/epermit/prod'),
        headers: {
            'Content-Type': 'text/html'
        }
    };
};

export default httpTrigger;
