import { GoogleAuth } from "google-auth-library";
import { BaseLanguageModelCallOptions } from "../base_language/index.js";
import { AsyncCaller } from "./async_caller.js";
import { GoogleVertexAIBasePrediction, GoogleVertexAIConnectionParams, GoogleVertexAILLMResponse, GoogleVertexAIModelParams } from "../types/googlevertexai-types.js";
export declare class GoogleVertexAIConnection<CallOptions extends BaseLanguageModelCallOptions, InstanceType, PredictionType extends GoogleVertexAIBasePrediction> implements GoogleVertexAIConnectionParams {
    caller: AsyncCaller;
    endpoint: string;
    location: string;
    model: string;
    auth: GoogleAuth;
    constructor(fields: GoogleVertexAIConnectionParams | undefined, caller: AsyncCaller);
    request(instances: InstanceType[], parameters: GoogleVertexAIModelParams, options: CallOptions): Promise<GoogleVertexAILLMResponse<PredictionType>>;
}
