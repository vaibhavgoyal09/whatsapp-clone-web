enum IncomingCallResponseType {
  accepted = 0,
  rejected = 1,
}

interface IncomingCallResponse {
  by_user_id: string;
  to_user_id: string;
  response: number;
}

export default IncomingCallResponse;
export { IncomingCallResponseType };
