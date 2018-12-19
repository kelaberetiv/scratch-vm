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
                        default: 'Image URL: [IMAGE_URL]',
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
                }
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
    
        // Replace with valid subscription key accordingly
        var subscriptionKey = "6ea075b7325c4df79d8464695622b2e1";
    
        // You must use the same Azure region in your REST API method as you used to
        // get your subscription keys.
        var uriBase =
            "https://southeastasia.api.cognitive.microsoft.com/vision/v2.0/analyze";
    
        // Data containing image URL to send in POST request
        var data =  {"url": imageURL};
        
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
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    
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
}

module.exports = Scratch3ImageRecBlocks;
