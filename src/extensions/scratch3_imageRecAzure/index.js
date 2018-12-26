const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const blockIconURI = 'https://connectoricons-prod.azureedge.net/cognitiveservicescomputervision/icon_1.0.1046.1227.png';

class Scratch3ImageRecBlocks{
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    getInfo () {
        return {
            // The machine-readable name of this extension.
            id: 'imageRecExt',
            
            // Show status indicator button
            showStatusButton: true,

            // The human-readable name of this extension as string.
            name: formatMessage({
                id: 'imageRecExt.name',
                default: 'Image Recognition',
                description: 'Label for the image recognition extension category'
            }),
    
            // Optional: URI for a block icon, to display at the edge of each block for this
            // extension. Data URI OK.
            blockIconURI: blockIconURI,
    
            // Optional: URI for an icon to be displayed in the blocks category menu.
            // Data URI OK.
            menuIconURI: blockIconURI,
    
            // Required: the list of blocks implemented by this extension,
            // in the order intended for display.
            blocks: [
                // Block that recognises image based on image URL provided
                {
                    // Required: the machine-readable name of this operation.
                    opcode: 'recogImageByURL', 
    
                    // Required: the kind of block we're defining
                    blockType: BlockType.REPORTER,
    
                    // Required: the human-readable text on this block, including argument
                    // placeholders.
                    text: formatMessage({
                        id: 'imageRecExt.recogImageByURL',
                        default: 'Recognise image (URL): [IMAGE_URL]',
                        description: 'Recognise image based on URL provided'
                    }),
    
                    // Required: Describe each argument.
                    arguments: {
                        // Required: the ID of the argument, which will be the name in the
                        // args object passed to the implementation function.
                        IMAGE_URL: {
                            // Required: type of the argument / shape of the block input
                            type: ArgumentType.STRING,
    
                            // Optional: the default value of the argument
                            defaultValue: ''
                        }
                    }
                },
                {
                    // Required: the machine-readable name of this operation.
                    opcode: 'predictFromModel',

                    // Required: the kind of block we're defining
                    blockType: BlockType.REPORTER,

                    // Required: the human-readable text on this block, including argument
                    // placeholders.
                    text: formatMessage({
                        id: 'imageRecExt.predictFromModel',
                        default: 'Predict from model (URL): [IMAGE_URL]',
                        description: 'Predict image from image URL based on model you have trained'
                    }),

                    // Required: Describe each argument.
                    arguments: {
                        // Required: the ID of the argument, which will be the name in the
                        // args object passed to the implementation function.
                        IMAGE_URL: {
                            // Required: type of the argument / shape of the block input
                            type: ArgumentType.STRING,
    
                            // Optional: the default value of the argument
                            defaultValue: ''
                        }
                    }
                },
                {
                    // Required: the machine-readable name of this operation.
                    opcode: 'predictFromModelAndProb',

                    // Required: the kind of block we're defining
                    blockType: BlockType.REPORTER,

                    // Required: the human-readable text on this block, including argument
                    // placeholders.
                    text: formatMessage({
                        id: 'imageRecExt.predictFromModelAndProb',
                        default: 'Predict from model & Get probability (URL): [IMAGE_URL]',
                        description: 'Predict image from image URL based on model you have trained' +  
                        'and get the probability of correct prediction'
                    }),

                    // Required: Describe each argument.
                    arguments: {
                        // Required: the ID of the argument, which will be the name in the
                        // args object passed to the implementation function.
                        IMAGE_URL: {
                            // Required: type of the argument / shape of the block input
                            type: ArgumentType.STRING,
    
                            // Optional: the default value of the argument
                            defaultValue: ''
                        }
                    }
                }
                // Experimental block that takes a local file hosted on localhost
                /*{
                    // Required: the machine-readable name of this operation.
                    opcode: 'recogImageByLocalhostFile',

                    // Required: the kind of block we're defining
                    blockType: BlockType.REPORTER,

                    // Required: the human-readable text on this block, including argument
                    // placeholders.
                    text: formatMessage({
                        id: 'imageRecExt.recogImageByLocalhostFile',
                        default: 'Localhost URI: [IMAGE_URI]',
                        description: 'Recognise local image based on URI provided'
                    }),

                    // Required: Describe each argument.
                    arguments: {
                        // Required: the ID of the argument, which will be the name in the
                        // args object passed to the implementation function.
                        IMAGE_URI: {
                            // Required: type of the argument / shape of the block input
                            type: ArgumentType.STRING,
    
                            // Optional: the default value of the argument
                            defaultValue: ''
                        }
                    }


                }*/
            ]
    
        };
    }

    recogImageByURL (args) {
    
        var imageURL = args.IMAGE_URL;
    
        // If no URL entered, return warning message
        if(imageURL == ""){
            console.log("Please enter URL...");
            return "Please enter a URL!";
        }
    
        // If imageURL passes input checks
        var xhttp = new XMLHttpRequest();
    
        // Setup necessary request parameters
        setupComputerVisionRequest(xhttp);

        // Data containing image URL to send in POST request
        var data =  {"url": imageURL};
        
        // Set Request headers for XMLHttpRequest
        xhttp.setRequestHeader("Content-Type", "application/json");
    
        // Send request with imageURL data
        xhttp.send(JSON.stringify(data));
    
        // If response is ready and request is successful/no errors
        if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            var response = JSON.parse(xhttp.response);
            // Takes in caption returned from API call
            caption = response["description"]["captions"][0]["text"];
            console.log(caption);
            // Displays caption
            return caption;
        }
        // Display invalid URL for all remaining errors and highlight error 
        // in console with status code
        else{
            console.log("xhttp.readState:", xhttp.readyState);
            console.log("xhttp.status:", xhttp.status);
            return "Invalid URL!";
        }
    }

    customVisionPredictFromURL(xhttp, imageURL){
        // Data containing image URL to send in POST request
        var data =  {"Url": imageURL};
        
        // Set Request headers for XMLHttpRequest
        xhttp.setRequestHeader("Content-Type", "application/json");
    
        // Send request with imageURL data
        xhttp.send(JSON.stringify(data));
    }

    predictFromModel(args){

        var imageURL = args.IMAGE_URL;
    
        // If no URL entered, return warning message
        if(imageURL == ""){
            console.log("Please enter URL...");
            return "Please enter a URL!";
        }
    
        // If imageURL passes input checks
        var xhttp = new XMLHttpRequest();
    
        // Setup necessary request parameters
        setupCustomVisionRequest(xhttp);

        // Do the prediction
        customVisionPredictFromURL(xhttp, imageURL);
    
        // If response is ready and request is successful/no errors
        if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            var response = JSON.parse(xhttp.response);
            console.log(response);
            // Takes in image predicted returned from API call
            item = response["predictions"][0]["tagName"];
            console.log(item);
            // Displays image predicted
            return item;
        }
        // Display invalid URL for all remaining errors and highlight error 
        // in console with status code
        else{
            console.log("xhttp.readState:", xhttp.readyState);
            console.log("xhttp.status:", xhttp.status);
            return "Invalid URL!";
        }
    }

    predictFromModelAndProb(args){
        var imageURL = args.IMAGE_URL;
    
        // If no URL entered, return warning message
        if(imageURL == ""){
            console.log("Please enter URL...");
            return "Please enter a URL!";
        }

        // If imageURL passes input checks
        var xhttp = new XMLHttpRequest();
    
        // Setup necessary request parameters
        setupCustomVisionRequest(xhttp);

        // Do the prediction
        customVisionPredictFromURL(xhttp, imageURL);

        // If response is ready and request is successful/no errors
        if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            var response = JSON.parse(xhttp.response);
            console.log(response);
            // Displays image predicted
            return response;
        }
        // Display invalid URL for all remaining errors and highlight error 
        // in console with status code
        else{
            console.log("xhttp.readState:", xhttp.readyState);
            console.log("xhttp.status:", xhttp.status);
            return "Invalid URL!";
        }
    }

    /*recogImageByLocalhostFile (args){
        var imageURI = args.IMAGE_URI;
        console.log("Image URI: ", imageURI);

        // If no URI entered, return warning message
        if(imageURI == ""){
            console.log("Please enter localhost URI...");
            return "Please enter a localhost URI!";
        }

        // Request to get image from localhost
        var getImage = new XMLHttpRequest();
        
        // Open request
        getImage.open("GET", imageURI, false); //false to sync/wait till request complete
        getImage.send();

        // If response is ready and request is successful/no errors
        if (getImage.readyState === XMLHttpRequest.DONE && getImage.status === 200) {
            var rawImage = getImage.response;
        }
        
        // Display invalid URI for all remaining errors and highlight error 
        // in console with status code
        else{
            console.log("getImage.readState:", getImage.readyState);
            console.log("getImage.status:", getImage.status);
            return "Invalid local file URI!";
        }

        processImage = new XMLHttpRequest();
        setupXMLHTTPRequest(processImage);

        // Set Request headers for XMLHttpRequest
        processImage.setRequestHeader("Content-Type", "application/octet-stream");

        // Send request with imageURL data
        processImage.send(rawImage);
    
        // If response is ready and request is successful/no errors
        if (processImage.readyState === XMLHttpRequest.DONE && processImage.status === 200) {
            var response = JSON.parse(processImage.response);
            // Takes in caption returned from API call
            caption = response["description"]["captions"][0]["text"];
            console.log(caption);
            // Displays caption
            return caption;
        }
        // Display invalid URL for all remaining errors and highlight error 
        // in console with status code
        else{
            console.log(processImage.response);
            console.log("processImage.readState:", processImage.readyState);
            console.log("processImage.status:", processImage.status);
            return "Invalid file!";
        }

    }*/
}

function setupComputerVisionRequest(xhttp){
    // Replace with valid subscription key accordingly
    var subscriptionKey = "6ea075b7325c4df79d8464695622b2e1";

    // You must use the same Azure region in your REST API method as you used to
    // get your subscription keys.
    var uriBase =
        "https://southeastasia.api.cognitive.microsoft.com/vision/v2.0/analyze";

    // Request parameters.
    // Ref: https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa
    var params = {
        "visualFeatures": "Description",
        "details": "",
        "language": "en",
    };
    
    // Append all parameters to url string
    var url = new URL(uriBase);
    for (var key in params){
        url.searchParams.append(key, params[key]);
    }

    // Open request
    xhttp.open("POST", url, false); //false to sync/wait till request complete

    // Set Request headers for XMLHttpRequest
    xhttp.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
}

function setupCustomVisionRequest(xhttp){
    // Replace with valid subscription key accordingly
    var subscriptionKey = "73d00993d12d4e089e56bfda09b6f7b7";

    // You must use the same Azure region in your REST API method as you used to
    // get your subscription keys.
    var uriBase =
        "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/" +
        "Prediction/264a421d-1075-4a4e-8a08-26efed57a75c/url?iterationId=c0ed0" + 
        "68a-3587-446a-af1f-9503f25652e9";

    // Request parameters.
    // Ref: https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa
    var params = {
        "visualFeatures": "Description",
        "details": "",
        "language": "en",
    };
    
    // Append all parameters to url string
    var url = new URL(uriBase);
    for (var key in params){
        url.searchParams.append(key, params[key]);
    }

    // Open request
    xhttp.open("POST", url, false); //false to sync/wait till request complete

    // Set Request headers for XMLHttpRequest
    xhttp.setRequestHeader("Prediction-Key", subscriptionKey);
}

/**
 * Function that converts a string into its binary representation
 * 
 * @see https://gist.github.com/eyecatchup/6742657
 * @author https://github.com/eyecatchup
 */
function stringToBinary(str, spaceSeparatedOctets) {
    function zeroPad(num) {
        return "00000000".slice(String(num).length) + num;
    }

    return str.replace(/[\s\S]/g, function(str) {
        str = zeroPad(str.charCodeAt().toString(2));
        return !1 == spaceSeparatedOctets ? str : str + " "
    });
}

function stringToArrayBuffer(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);

    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }

    return buf;
}

module.exports = Scratch3ImageRecBlocks;
