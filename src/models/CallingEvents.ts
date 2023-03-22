enum CallingEventType {
  aborted = 0,
  disconnected = 1,
}

interface CallingEvent {
  to_user_id: string;
  event: number;
}

export default CallingEvent;
export { CallingEventType };
