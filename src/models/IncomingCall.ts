interface IncomingCall {
  call_type: string;
  user_name: string;
  user_id: string;
  user_profile_image_url?: string | null;
}

export default IncomingCall;
