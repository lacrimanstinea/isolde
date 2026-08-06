import { networkInterfaces } from 'os';

// this funky function because i wanted to have a dev:all command bruh
export function getLocalIPv4(): string {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}
