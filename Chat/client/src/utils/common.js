const BASE_URL = "http://localhost:8800/";

export const downloadMedia = async (e, filename, setLoading) => {
  e.preventDefault();
  try {
    setLoading(true);
    fetch(`${BASE_URL}api/files/${filename}`)
      .then((resp) => resp.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;

        const nameSplit = filename.split("/");
        const duplicateName = nameSplit.pop();

        // the filename you want
        a.download = "" + duplicateName + "";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error while downloading the content ", error);
        setLoading(false);
      });
  } catch (error) {
    console.log("Error while downloading the content ", error);
    setLoading(false);
  }
};

export const formatBytes = (bytes) => {
  if (bytes < 1024) {
    return bytes + " Bytes";
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
};

export const formatTimeCaptureVideo = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};
