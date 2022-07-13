import { Stream, Duplex } from 'stream';

/**
 * Convert Stream data to buffer.
 *
 * @param stream stream data.
 * @returns buffer
 *
 * @publicApi
 */
export async function toBuffer(stream: Stream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffers: Uint8Array[] = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
}
/**
 * Convert Buffer data to stream.
 *
 * @param buffer buffer data.
 * @param encoding buffer class.
 * @returns stream
 *
 * @publicApi
 */
export async function toStream(buffer: Buffer, encoding?: BufferEncoding): Promise<Duplex> {
  const stream = new Duplex();
  stream.push(buffer, encoding);
  stream.push(null, encoding);
  return stream;
}
