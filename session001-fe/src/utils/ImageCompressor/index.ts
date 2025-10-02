import Compressor from 'compressorjs';

export async function imageCompresser(images: File | File[]): Promise<File[]> {
  const imageArray = Array.isArray(images) ? images : [images];

  return Promise.all(
    imageArray.map((image) => {
      return new Promise<File>((resolve, reject) => {
        new Compressor(image, {
          quality: 0.3,

          convertSize: 1000000,
          success(result: Blob) {
            const compressedFile = new File([result], image.name, {
              type: result.type,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          error(err: any) {
            reject(err);
          },
        });
      });
    })
  );
}
