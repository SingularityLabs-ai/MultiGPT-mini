import { CreateCompletionRequestPrompt, CreateCompletionRequest } from "openai";
import { AsyncCaller } from "../util/async_caller.js";
export declare const promptLayerTrackRequest: (callerFunc: AsyncCaller, functionName: string, prompt: CreateCompletionRequestPrompt, kwargs: CreateCompletionRequest, plTags: string[] | undefined, requestResponse: any, startTime: number, endTime: number, apiKey: string | undefined) => Promise<any>;
