declare module "image-size" {
  export interface ImageSizeResult {
    width?: number
    height?: number
    type?: string
  }

  export default function imageSize(input: string | Buffer): ImageSizeResult
}
