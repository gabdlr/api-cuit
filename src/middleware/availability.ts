import { IncomingMessage } from "http";
export function availabilty(
  users: Partial<{ [key: string]: Date }>,
  req: IncomingMessage
) {
  let timeLeft: number = 0;
  if (req.socket.remoteAddress) {
    const userAddr = req.socket.remoteAddress;
    if (users[userAddr] === undefined) {
      users[userAddr] = new Date();
      timeLeft = 0;
    } else {
      timeLeft = new Date().getTime() - (users[userAddr]!.getTime() + 60000);
      if (timeLeft >= 0) {
        users[userAddr] = new Date();
      }
    }
  }
  return timeLeft;
}
