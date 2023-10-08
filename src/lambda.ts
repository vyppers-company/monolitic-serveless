import { Callback, Context, Handler } from 'aws-lambda';
import { bootstrapLambda } from './main/setups/lambda';

let server: Handler;

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrapLambda());
  return server(event, context, callback);
};
