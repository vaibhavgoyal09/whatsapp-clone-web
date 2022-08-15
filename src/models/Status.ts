enum StatusType {
   image = 0,
   video = 1
}

interface Status {
   id: number;
   userId: string;
   type: number;
   createdAt: number;
   mediaUrl: string
}

export default Status;
export { StatusType };
