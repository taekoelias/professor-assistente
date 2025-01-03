export const fileToDataUrl = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const dataUrlToFile = (
  url: string,
  metadata?: Record<string, unknown>
) => {
  const filename = (metadata?.filename as string) ?? "tempfile";
  const mimeType = metadata?.mineType as string;
  if (url.startsWith("data:")) {
    const arr = url.split(",");

    let mime = arr[0];
    const matches = mime.match(/:(.*?);/);
    if (matches !== null) {
      mime = matches[1];
    }

    const bstr = atob(arr[arr.length - 1]);

    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    var file = new File([u8arr], filename, { type: mime || mimeType });
    return Promise.resolve(file);
  }
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buf) => new File([buf], filename, { type: mimeType }));
};
